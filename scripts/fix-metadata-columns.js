/**
 * Fix metadata columns - shift from H:K to G:J
 * The original script assumed Språk column at G, but it doesn't exist
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

async function fixMetadataColumns() {
  console.log('🔧 Fixing metadata column positions...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get current data with all columns
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:K',
  });

  const rows = response.data.values || [];
  console.log(`Found ${rows.length} rows (including header)\n`);

  // Fix header row
  console.log('Fixing header row...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: 'G1:J1',
    valueInputOption: 'RAW',
    resource: {
      values: [['Vanskelighetsgrad', 'Plattform', 'Veiledning', 'Sist oppdatert']]
    }
  });
  console.log('✓ Header fixed\n');

  // Shift data from H:K to G:J for each row
  const batchData = [];
  let fixedCount = 0;

  console.log('Shifting metadata columns...\n');

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowIndex = i + 1;

    // Get data from columns H, I, J, K (indices 7, 8, 9, 10)
    const vanskelighetsgrad = row[7] || '';
    const plattform = row[8] || '';
    const veiledning = row[9] || '';
    const sistOppdatert = row[10] || '';

    // Write to columns G, H, I, J (indices 6, 7, 8, 9)
    batchData.push({
      range: `G${rowIndex}:J${rowIndex}`,
      values: [[vanskelighetsgrad, plattform, veiledning, sistOppdatert]]
    });

    fixedCount++;

    if (i % 50 === 0) {
      console.log(`  Processed ${i} tools...`);
    }
  }

  // Batch update all data
  console.log(`\n📤 Updating ${batchData.length} rows...`);

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

  // Delete column K (now empty/duplicate)
  console.log('\n🗑️  Deleting old column K...');
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId: 0,
            dimension: 'COLUMNS',
            startIndex: 10, // Column K (0-indexed)
            endIndex: 11
          }
        }
      }]
    }
  });
  console.log('✓ Column K deleted\n');

  console.log(`\n✅ Successfully fixed ${fixedCount} rows!`);
  console.log('   Columns are now:');
  console.log('   G: Vanskelighetsgrad');
  console.log('   H: Plattform');
  console.log('   I: Veiledning');
  console.log('   J: Sist oppdatert');
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await fixMetadataColumns();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
