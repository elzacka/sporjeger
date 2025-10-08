/**
 * Fetch difficulty ratings from Bellingcat GitBook pages
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

/**
 * Fetch difficulty from Bellingcat GitBook page
 */
async function fetchDifficulty(guideUrl) {
  if (!guideUrl || !guideUrl.includes('bellingcat.gitbook.io')) {
    return null;
  }

  try {
    // Fetch the raw README from GitHub
    const toolSlug = guideUrl.split('/').pop();
    const githubUrl = `https://raw.githubusercontent.com/bellingcat/toolkit/main/gitbook/tools/${toolSlug}/README.md`;

    const response = await fetch(githubUrl);
    if (!response.ok) return null;

    const markdown = await response.text();

    // Extract difficulty from markdown
    // Format: "difficulty: 1/5" or "difficulty: '1/5'"
    const difficultyMatch = markdown.match(/difficulty:\s*['"]*(\d)\/5/i);

    if (difficultyMatch) {
      return difficultyMatch[1];
    }

    return null;
  } catch (error) {
    return null;
  }
}

async function updateDifficulties() {
  console.log('⭐ Fetching difficulty ratings from Bellingcat...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get current data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:K',
  });

  const rows = response.data.values || [];
  const dataRows = rows.slice(1); // Skip header

  console.log(`Found ${dataRows.length} tools\n`);

  const updates = [];
  let fetched = 0;
  let skipped = 0;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const rowIndex = i + 2;
    const toolName = row[1] || '';
    const guideUrl = row[9] || ''; // Column J (Veiledning)

    if (!guideUrl || !guideUrl.includes('bellingcat.gitbook.io')) {
      skipped++;
      continue;
    }

    console.log(`${rowIndex}. ${toolName}: Fetching...`);

    const difficulty = await fetchDifficulty(guideUrl);

    if (difficulty) {
      updates.push({
        range: `H${rowIndex}`,
        values: [[difficulty]]
      });
      console.log(`   ✓ Difficulty: ${difficulty}/5`);
      fetched++;
    } else {
      console.log(`   - Not found`);
      skipped++;
    }

    // Delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Found: ${fetched}`);
  console.log(`   Skipped: ${skipped}`);

  if (updates.length > 0) {
    console.log(`\n📤 Updating ${updates.length} difficulty ratings...`);

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });

    console.log(`✅ Updated ${updates.length} tools with difficulty ratings!`);
  } else {
    console.log('\n⚠️  No difficulty ratings found');
  }
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await updateDifficulties();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
