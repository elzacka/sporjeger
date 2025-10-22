/**
 * Build script to fetch tools from Google Sheets and save to static JSON
 * This allows faster initial load times with fallback to live API
 *
 * Usage: node scripts/fetch-tools.js
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local from project root
const projectRoot = resolve(__dirname, '..');
config({ path: resolve(projectRoot, '.env.local') });

// Get environment variables
const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = process.env.VITE_GOOGLE_API_KEY;

// Google Sheets API endpoint
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

async function fetchTools() {
  if (!SHEET_ID || !API_KEY) {
    console.error('❌ Missing Google Sheets credentials in .env.local');
    console.log('ℹ️  Using dummy data instead');
    return null;
  }

  const range = 'Ark 1!A1:K'; // Get current data with headers
  const url = `${SHEETS_API_BASE}/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    console.log('📥 Fetching tools from Google Sheets...');
    console.log(`📍 Sheet ID: ${SHEET_ID}`);
    console.log(`📍 Range: ${range}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      throw new Error('No data found in sheet');
    }

    // Transform rows to tool objects
    const tools = data.values
      .map((row) => transformRowToTool(row))
      .filter(Boolean);

    console.log(`✅ Successfully fetched ${tools.length} tools`);
    return tools;
  } catch (error) {
    console.error('❌ Error fetching from Google Sheets:', error.message);
    return null;
  }
}

function transformRowToTool(row) {
  // Validate required fields
  if (!row[0] || !row[1] || !row[2] || !row[3] || !row[4]) {
    console.warn('⚠️  Skipping row with missing required fields');
    return null;
  }

  // Validate kostnad
  const kostnad = row[4]?.trim();
  if (!['GRATIS', 'KOSTNAD', 'GRATISH'].includes(kostnad)) {
    console.warn(`⚠️  Invalid Kostnad value: "${kostnad}"`);
    return null;
  }

  // Parse comma-separated fields
  const parseCsvField = (value) => {
    if (!value?.trim()) return undefined;
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  return {
    kategori: row[0]?.trim() || '',
    navn: row[1]?.trim() || '',
    url: row[2]?.trim() || '',
    beskrivelse: row[3]?.trim() || '',
    kostnad: kostnad,
    språk: row[5]?.trim() || undefined,
    kreverRegistrering: row[6]?.trim() || undefined,
    designkvalitet: row[7]?.trim() || undefined,
    vanskelighetsgrad: row[8]?.trim() || undefined,
    veiledning: row[9]?.trim() || undefined,
    enderEllerSlette: row[10]?.trim() || undefined,
    toolType: row[11]?.trim().toLowerCase() || undefined,
    platform: row[12]?.trim().toLowerCase() || undefined,
    tags: parseCsvField(row[13]),
    categoryPath: parseCsvField(row[14]),
    lastVerified: row[15]?.trim() || undefined,
    alternatives: parseCsvField(row[16]),
  };
}

async function main() {
  const tools = await fetchTools();

  if (!tools) {
    console.log('ℹ️  No fresh data from API - using existing tools.json');
    console.log('✨ Build will continue with cached data');
    process.exit(0); // Exit successfully to allow build to continue
  }

  // Write to src/data/tools.json
  const outputPath = join(__dirname, '../src/data/tools.json');
  const json = JSON.stringify(tools, null, 2);

  writeFileSync(outputPath, json, 'utf8');
  console.log(`💾 Saved ${tools.length} tools to src/data/tools.json`);
  console.log('✨ Build complete!');
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
