/**
 * Remove Plattform column from Google Sheet
 * Deletes column H (Plattform) and shifts I-J to H-I
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

async function removePlattformColumn() {
  console.log('🗑️  Removing Plattform column from Google Sheet...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Get sheet metadata to find the sheet ID
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const sheetId = spreadsheet.data.sheets[0].properties.sheetId;
  console.log(`Found sheet ID: ${sheetId}`);

  // Delete column H (Plattform) - index 7 (0-based)
  console.log('\nDeleting column H (Plattform)...');

  try {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'COLUMNS',
              startIndex: 7, // Column H (0-indexed)
              endIndex: 8    // Delete only column H
            }
          }
        }]
      }
    });

    console.log('✓ Column H (Plattform) deleted successfully!\n');
    console.log('New column structure:');
    console.log('  A: Kategori');
    console.log('  B: Navn');
    console.log('  C: URL');
    console.log('  D: Beskrivelse');
    console.log('  E: Kostnad');
    console.log('  F: Detaljer');
    console.log('  G: Vanskelighetsgrad');
    console.log('  H: Veiledning');
    console.log('  I: Sist oppdatert');

  } catch (error) {
    console.error('Error deleting column:', error.message);
    throw error;
  }
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await removePlattformColumn();

    console.log('\n✅ Successfully removed Plattform column!');
    console.log('\n⚠️  Remember to update your code:');
    console.log('   1. Update types/index.ts (remove plattform field)');
    console.log('   2. Update services/googleSheets.ts (update column mapping)');
    console.log('   3. Update components/ToolCard.tsx (remove platform display)');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
