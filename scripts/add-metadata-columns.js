/**
 * Add new metadata columns to Google Sheet
 * H: Vanskelighetsgrad (1-5)
 * I: Plattform (Web/iOS/Android/API)
 * J: Veiledning (tutorial link)
 * K: Sist oppdatert (last updated date)
 */

import dotenv from 'dotenv';
import { google } from 'googleapis';
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
 * Generate Bellingcat guide URL from tool name
 */
function getBellingcatGuideUrl(toolName) {
  if (!toolName) return '';

  // Convert tool name to Bellingcat URL slug
  const slug = toolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `https://bellingcat.gitbook.io/toolkit/tools/${slug}`;
}

/**
 * Detect platform from tool details
 */
function detectPlatform(url, details) {
  const platforms = [];

  // Most tools are web-based
  platforms.push('Web');

  // Check for mobile indicators
  if (url?.includes('apps.apple.com') || details?.toLowerCase().includes('ios')) {
    platforms.push('iOS');
  }
  if (url?.includes('play.google.com') || details?.toLowerCase().includes('android')) {
    platforms.push('Android');
  }
  if (details?.toLowerCase().includes('api')) {
    platforms.push('API');
  }

  return platforms.join(', ');
}

async function addMetadataColumns() {
  console.log('📊 Adding metadata columns to Google Sheet...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get current data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:G',
  });

  const rows = response.data.values || [];
  console.log(`Found ${rows.length} rows (including header)\n`);

  // Update header row
  const header = rows[0];
  const newHeader = [
    ...header,
    'Vanskelighetsgrad',
    'Plattform',
    'Veiledning',
    'Sist oppdatert'
  ];

  console.log('Updating header row...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'A1:K1',
    valueInputOption: 'RAW',
    resource: {
      values: [newHeader]
    }
  });
  console.log('✓ Header updated\n');

  // Prepare batch data for all rows
  const batchData = [];
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  console.log('Generating metadata for each tool...\n');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 1;
    const toolName = row[1] || '';
    const url = row[2] || '';
    const details = row[5] || '';

    // Generate metadata
    const guideUrl = getBellingcatGuideUrl(toolName);
    const platform = detectPlatform(url, details);
    const difficulty = ''; // Will be populated by next script
    const lastUpdated = today;

    batchData.push({
      range: `H${rowIndex}:K${rowIndex}`,
      values: [[difficulty, platform, guideUrl, lastUpdated]]
    });

    if (i % 50 === 0) {
      console.log(`  Processed ${i} tools...`);
    }
  }

  // Batch update all metadata
  console.log(`\n📤 Updating ${batchData.length} rows with metadata...`);

  const CHUNK_SIZE = 100;
  for (let i = 0; i < batchData.length; i += CHUNK_SIZE) {
    const chunk = batchData.slice(i, i + CHUNK_SIZE);

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: chunk
      }
    });

    console.log(`   ✓ Updated rows ${i + 2} to ${Math.min(i + chunk.length + 1, rows.length)}`);

    if (i + CHUNK_SIZE < batchData.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Successfully added metadata to ${batchData.length} tools!`);
  console.log('   - Vanskelighetsgrad: Empty (will be filled by difficulty script)');
  console.log('   - Plattform: Auto-detected from URL/details');
  console.log('   - Veiledning: Bellingcat guide links generated');
  console.log(`   - Sist oppdatert: ${today}`);
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await addMetadataColumns();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
