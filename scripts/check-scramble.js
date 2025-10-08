/**
 * Check if descriptions got scrambled
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

async function checkScramble() {
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A2:D30',
  });

  const rows = response.data.values || [];

  console.log('\n🔍 First 30 entries:\n');

  rows.forEach((row, index) => {
    console.log(`${index + 2}. ${row[1]} (${row[0]})`);
    console.log(`   ${row[3]?.substring(0, 100)}${row[3]?.length > 100 ? '...' : ''}`);
    console.log('');
  });
}

async function main() {
  try {
    await checkScramble();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
