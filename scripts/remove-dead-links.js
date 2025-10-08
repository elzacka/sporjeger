/**
 * Check URLs and remove tools with dead links from Google Sheet
 *
 * This script:
 * 1. Fetches all tools from the Google Sheet
 * 2. Checks each URL in column C to see if it's accessible
 * 3. Removes rows where URLs return 404, timeout, or other errors
 * 4. Provides dry-run mode to preview deletions
 */

import dotenv from 'dotenv';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;

let SERVICE_ACCOUNT_KEY;
const serviceAccountPaths = [
  join(__dirname, '../osint-verktoydatabase-d1d26dc983b4.json'),
  join(__dirname, '../../osint-verktoydatabase-d1d26dc983b4.json'),
];

const serviceAccountPath = serviceAccountPaths.find(path => existsSync(path));
if (serviceAccountPath) {
  SERVICE_ACCOUNT_KEY = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
}

// Check if a URL is accessible
async function checkUrl(url, toolName) {
  if (!url || url.trim() === '') {
    return { alive: false, status: 'empty', message: 'Empty URL' };
  }

  try {
    // Set a reasonable timeout (10 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD for faster checks
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Sporjeger-LinkChecker/1.0)'
      },
      redirect: 'follow' // Follow redirects
    });

    clearTimeout(timeout);

    // Consider 200-399 as alive
    if (response.ok || (response.status >= 200 && response.status < 400)) {
      return { alive: true, status: response.status, message: 'OK' };
    }

    // 404, 410 (Gone), 403 (Forbidden) are considered dead
    if (response.status === 404 || response.status === 410 || response.status === 403) {
      return { alive: false, status: response.status, message: `HTTP ${response.status}` };
    }

    // Other 4xx/5xx errors - might be temporary, so mark as alive for now
    return { alive: true, status: response.status, message: `HTTP ${response.status} (kept)` };

  } catch (error) {
    // Network errors, timeouts, invalid URLs
    if (error.name === 'AbortError') {
      return { alive: false, status: 'timeout', message: 'Timeout (10s)' };
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { alive: false, status: 'dns', message: 'DNS/Connection failed' };
    }

    // For SSL errors or other issues, keep the link (might be temporary)
    return { alive: true, status: 'error', message: `Error: ${error.message} (kept)` };
  }
}

async function removeDeadLinks(dryRun = true) {
  console.log('🔗 Checking URLs for dead links...\n');
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes will be made)' : '⚠️  LIVE MODE (will delete rows)'}\n`);

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get all data
  console.log('Fetching tools from Google Sheet...');
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:I',
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('No tools found in sheet.');
    return;
  }

  console.log(`Found ${rows.length - 1} tools to check\n`);

  const deadLinks = [];
  const aliveLinks = [];

  // Check each URL (skip header row)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const toolName = row[1] || 'Unknown';
    const url = row[2] || '';
    const rowIndex = i + 1; // +1 for 1-based indexing

    process.stdout.write(`[${i}/${rows.length - 1}] Checking ${toolName}... `);

    const result = await checkUrl(url, toolName);

    if (result.alive) {
      console.log(`✓ ${result.message}`);
      aliveLinks.push({ rowIndex, toolName, url, status: result.message });
    } else {
      console.log(`✗ ${result.message} [WILL BE REMOVED]`);
      deadLinks.push({ rowIndex, toolName, url, status: result.message });
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTS');
  console.log('='.repeat(80));
  console.log(`✓ Alive links: ${aliveLinks.length}`);
  console.log(`✗ Dead links: ${deadLinks.length}`);

  if (deadLinks.length > 0) {
    console.log('\n🗑️  Tools with dead links:');
    deadLinks.forEach(link => {
      console.log(`  • ${link.toolName} (row ${link.rowIndex})`);
      console.log(`    URL: ${link.url}`);
      console.log(`    Status: ${link.status}`);
    });

    if (!dryRun) {
      console.log('\n⚠️  Deleting rows with dead links...');

      // Delete rows in reverse order to avoid index shifting
      const sortedDeadLinks = [...deadLinks].sort((a, b) => b.rowIndex - a.rowIndex);

      for (const link of sortedDeadLinks) {
        console.log(`  Deleting row ${link.rowIndex}: ${link.toolName}`);

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: link.rowIndex - 1, // 0-based index
                  endIndex: link.rowIndex
                }
              }
            }]
          }
        });

        // Small delay between deletions
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`\n✅ Successfully removed ${deadLinks.length} tools with dead links!`);
    } else {
      console.log('\n🔍 DRY RUN: No changes were made.');
      console.log('   Run with --live flag to actually delete these rows:');
      console.log('   npm run check-dead-links -- --live');
    }
  } else {
    console.log('\n✅ All URLs are working! No dead links found.');
  }
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Check for --live flag in command line arguments
    const isLiveMode = process.argv.includes('--live');
    const dryRun = !isLiveMode;

    await removeDeadLinks(dryRun);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
