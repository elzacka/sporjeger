/**
 * Check good BA-style examples
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

async function checkExamples() {
  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Check specific rows and also get a broader sample
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A1:D60',
  });

  const rows = response.data.values || [];

  console.log('\n📌 GOOD EXAMPLES (rows 19, 47, 57):\n');

  [19, 47, 57].forEach(rowNum => {
    const row = rows[rowNum - 1];
    if (row) {
      console.log(`Row ${rowNum}: ${row[1]}`);
      console.log(`  Category: ${row[0]}`);
      console.log(`  Description: ${row[3]}`);
      console.log('');
    }
  });

  console.log('\n📌 WEAK EXAMPLES (short/boring):\n');

  rows.forEach((row, index) => {
    const desc = row[3];
    if (desc && desc.length < 50) {
      console.log(`Row ${index + 1}: ${row[1]}`);
      console.log(`  Description: ${desc}`);
      console.log('');
    }
  });

  console.log('\n📊 ALL UNIQUE CATEGORIES:\n');

  const categories = new Set();
  rows.slice(1).forEach(row => {
    if (row[0]) categories.add(row[0]);
  });

  Array.from(categories).sort().forEach(cat => {
    console.log(`  - ${cat}`);
  });
}

async function main() {
  try {
    await checkExamples();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
