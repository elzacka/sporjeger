/**
 * Remove duplicate entries from Google Sheet based on URL
 * Keeps the first occurrence of each URL
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

// Load service account key
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

async function removeDuplicates() {
  console.log('🔍 Checking for duplicate URLs in Google Sheet...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get the actual sheet ID
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });
  const sheetId = spreadsheet.data.sheets[0].properties.sheetId;
  console.log(`Using sheet ID: ${sheetId}\n`);

  // Get all data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:G',
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('✓ Sheet is empty or has only header');
    return;
  }

  const header = rows[0];
  const dataRows = rows.slice(1);

  // Track URLs and find duplicates
  const urlMap = new Map(); // URL -> first row index
  const duplicateRows = []; // Row indices to delete

  dataRows.forEach((row, index) => {
    const url = row[2]; // Column C (URL)
    const rowIndex = index + 2; // +2 for 0-index and header

    if (!url) {
      console.log(`⚠️  Row ${rowIndex} has no URL, skipping`);
      return;
    }

    if (urlMap.has(url)) {
      const firstOccurrence = urlMap.get(url);
      console.log(`❌ Duplicate found: Row ${rowIndex} (duplicate of row ${firstOccurrence})`);
      console.log(`   URL: ${url}`);
      console.log(`   Name: ${row[1]}`);
      duplicateRows.push(rowIndex);
    } else {
      urlMap.set(url, rowIndex);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total rows: ${dataRows.length}`);
  console.log(`   Unique URLs: ${urlMap.size}`);
  console.log(`   Duplicates found: ${duplicateRows.length}`);

  if (duplicateRows.length === 0) {
    console.log('\n✅ No duplicates found!');
    return;
  }

  // Delete duplicate rows (in reverse order to maintain indices)
  console.log(`\n🗑️  Deleting ${duplicateRows.length} duplicate rows...`);

  // Sort in descending order to delete from bottom to top
  duplicateRows.sort((a, b) => b - a);

  for (const rowIndex of duplicateRows) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId, // Use actual sheet ID
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // 0-indexed
              endIndex: rowIndex
            }
          }
        }]
      }
    });
    console.log(`   ✓ Deleted row ${rowIndex}`);

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Successfully removed ${duplicateRows.length} duplicate entries!`);
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables or service account key');
    }

    await removeDuplicates();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
