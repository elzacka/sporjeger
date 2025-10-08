/**
 * Clean the Detaljer column (remove ONLY URLs, preserve "🇳🇴 Norsk" entries)
 * This column is reserved for manual Norwegian flag entries only
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
 * Check if a value should be preserved (contains Norsk or Norwegian flag)
 */
function shouldPreserve(value) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return lower.includes('norsk') || value.includes('🇳🇴');
}

/**
 * Check if a value contains a URL
 */
function containsURL(value) {
  if (!value) return false;
  return value.includes('http://') || value.includes('https://') || value.includes('www.');
}

async function cleanDetaljerColumn() {
  console.log('🧹 Cleaning Detaljer column (removing URLs only, preserving "🇳🇴 Norsk")...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get all data to preserve row structure
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:G',
  });

  const rows = response.data.values || [];
  console.log(`Found ${rows.length - 1} data rows`);

  let urlsRemoved = 0;
  let norskPreserved = 0;
  const updates = [];

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header

    const detaljer = row[5]; // Column F (Detaljer)
    const rowIndex = index + 1;

    if (detaljer) {
      if (shouldPreserve(detaljer)) {
        // Keep Norwegian flag entries
        console.log(`   ✓ Row ${rowIndex}: Preserving "${detaljer}"`);
        norskPreserved++;
      } else if (containsURL(detaljer)) {
        // Remove URLs
        console.log(`   ❌ Row ${rowIndex}: Removing URL "${detaljer.substring(0, 50)}..."`);
        updates.push({
          range: `F${rowIndex}`,
          values: [['']]
        });
        urlsRemoved++;
      } else {
        // Remove other content (not Norsk, not URL)
        console.log(`   ⚠️  Row ${rowIndex}: Removing other content "${detaljer}"`);
        updates.push({
          range: `F${rowIndex}`,
          values: [['']]
        });
        urlsRemoved++;
      }
    }
  });

  if (updates.length === 0) {
    console.log('\n✅ No URLs found in Detaljer column!');
    console.log(`   Preserved ${norskPreserved} "🇳🇴 Norsk" entries.`);
    return;
  }

  console.log(`\nUpdating ${updates.length} rows...`);

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      valueInputOption: 'RAW',
      data: updates
    }
  });

  console.log(`\n✅ Successfully cleaned Detaljer column!`);
  console.log(`   URLs/content removed: ${urlsRemoved}`);
  console.log(`   "🇳🇴 Norsk" preserved: ${norskPreserved}`);
  console.log('   This column is reserved for manual "🇳🇴 Norsk" entries only.');
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await cleanDetaljerColumn();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
