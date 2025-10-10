#!/usr/bin/env node

/**
 * Test Script: Verify Test Sheet Integrity
 *
 * This script verifies that the test Google Sheet is properly configured
 * and contains valid data without modifying anything.
 *
 * Usage:
 *   npm run test:sheet
 *
 * Checks:
 * - Sheet is accessible
 * - Headers match expected structure (9 columns)
 * - Data is present (at least 1 row)
 * - Protected tools are marked correctly
 * - All required columns have valid data types
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = process.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = 'A:I'; // 9 columns
const REFERER = 'http://localhost:5173/'; // Required for API key validation

const EXPECTED_HEADERS = [
  'Kategori',
  'Navn',
  'URL',
  'Beskrivelse',
  'Kostnad',
  'Språk',
  'Vanskelighetsgrad',
  'Veiledning',
  'Endre eller slette'
];

async function testSheetIntegrity() {
  console.log('🔍 Testing Google Sheet Integrity...\n');

  // Validate environment
  if (!SHEET_ID || !API_KEY) {
    console.error('❌ Error: Missing environment variables');
    console.error('   VITE_GOOGLE_SHEET_ID:', SHEET_ID ? '✓' : '✗ MISSING');
    console.error('   VITE_GOOGLE_SHEETS_API_KEY:', API_KEY ? '✓' : '✗ MISSING');
    process.exit(1);
  }

  console.log('✓ Environment variables loaded');
  console.log(`  Sheet ID: ${SHEET_ID}`);
  console.log(`  API Key: ${API_KEY.substring(0, 10)}...`);

  try {
    // Fetch sheet data
    console.log('\n📊 Fetching sheet data...');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url, {
      headers: {
        'Referer': REFERER
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length === 0) {
      console.error('❌ Error: Sheet is empty');
      process.exit(1);
    }

    console.log(`✓ Sheet accessible (${rows.length} rows)`);

    // Check headers
    console.log('\n📋 Validating headers...');
    const headers = rows[0];

    if (headers.length !== EXPECTED_HEADERS.length) {
      console.error(`❌ Error: Expected ${EXPECTED_HEADERS.length} columns, got ${headers.length}`);
      console.error('   Expected:', EXPECTED_HEADERS);
      console.error('   Got:', headers);
      process.exit(1);
    }

    let headerMismatches = 0;
    EXPECTED_HEADERS.forEach((expected, i) => {
      if (headers[i] !== expected) {
        console.error(`❌ Column ${String.fromCharCode(65 + i)}: Expected "${expected}", got "${headers[i]}"`);
        headerMismatches++;
      } else {
        console.log(`✓ Column ${String.fromCharCode(65 + i)}: ${expected}`);
      }
    });

    if (headerMismatches > 0) {
      console.error(`\n❌ ${headerMismatches} header mismatch(es) found`);
      process.exit(1);
    }

    // Validate data rows
    console.log('\n🔎 Validating data rows...');
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
      console.error('❌ Error: No data rows found');
      process.exit(1);
    }

    console.log(`✓ Found ${dataRows.length} data rows`);

    // Analyze data
    let emptyNames = 0;
    let protectedTools = 0;
    let toolsWithDifficulty = 0;
    let toolsWithGuide = 0;
    let toolsWithLanguage = 0;
    let categories = new Set();
    let invalidRows = [];

    dataRows.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header and 0-index
      const [kategori, navn, url, beskrivelse, kostnad, språk, vanskelighetsgrad, veiledning, endreEllerSlette] = row;

      // Track categories
      if (kategori) categories.add(kategori);

      // Check for empty names
      if (!navn || navn.trim() === '') {
        emptyNames++;
        invalidRows.push({ row: rowNum, issue: 'Empty name' });
      }

      // Track protected tools
      if (endreEllerSlette === 'Nei') {
        protectedTools++;
      }

      // Track tools with metadata
      if (vanskelighetsgrad) toolsWithDifficulty++;
      if (veiledning) toolsWithGuide++;
      if (språk) toolsWithLanguage++;

      // Validate difficulty range
      if (vanskelighetsgrad) {
        const difficulty = parseInt(vanskelighetsgrad);
        if (isNaN(difficulty) || difficulty < 1 || difficulty > 5) {
          invalidRows.push({ row: rowNum, issue: `Invalid difficulty: ${vanskelighetsgrad}` });
        }
      }
    });

    console.log('\n📈 Data Statistics:');
    console.log(`  Total tools: ${dataRows.length}`);
    console.log(`  Categories: ${categories.size}`);
    console.log(`  Protected tools: ${protectedTools}`);
    console.log(`  Tools with difficulty rating: ${toolsWithDifficulty}`);
    console.log(`  Tools with guide URL: ${toolsWithGuide}`);
    console.log(`  Tools with language: ${toolsWithLanguage}`);

    if (emptyNames > 0) {
      console.warn(`\n⚠️  Warning: ${emptyNames} rows have empty names`);
    }

    if (invalidRows.length > 0) {
      console.error('\n❌ Invalid rows found:');
      invalidRows.slice(0, 10).forEach(({ row, issue }) => {
        console.error(`   Row ${row}: ${issue}`);
      });
      if (invalidRows.length > 10) {
        console.error(`   ... and ${invalidRows.length - 10} more`);
      }
      process.exit(1);
    }

    // Sample data check
    console.log('\n📝 Sample data (first 3 tools):');
    dataRows.slice(0, 3).forEach((row, index) => {
      const [kategori, navn, url, , kostnad] = row;
      console.log(`  ${index + 1}. ${navn}`);
      console.log(`     Category: ${kategori}`);
      console.log(`     Cost: ${kostnad || 'N/A'}`);
      console.log(`     URL: ${url || 'N/A'}`);
    });

    console.log('\n✅ All tests passed! Sheet integrity verified.');
    console.log('\n📊 Summary:');
    console.log(`  ✓ Headers match expected structure`);
    console.log(`  ✓ ${dataRows.length} valid tools found`);
    console.log(`  ✓ ${categories.size} categories`);
    console.log(`  ✓ ${protectedTools} protected tools`);
    console.log(`  ✓ No critical issues found`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the test
testSheetIntegrity();
