/**
 * Fetch current Google Sheets data to analyze structure
 *
 * Usage: SHEET_ID=your_sheet_id node scripts/fetch-current-data.js
 */

const SHEET_ID = process.env.SHEET_ID || process.env.VITE_GOOGLE_SHEET_ID;

if (!SHEET_ID) {
  console.error('❌ Missing SHEET_ID environment variable');
  console.log('ℹ️  Usage: SHEET_ID=your_sheet_id node scripts/fetch-current-data.js');
  process.exit(1);
}

// Try public CSV export URL
const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;

async function fetchData() {
  try {
    console.log('📥 Attempting to fetch via CSV export...');
    console.log(`🔗 URL: ${csvUrl}`);

    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    console.log('\n✅ Successfully fetched data!\n');
    console.log('📊 First 2000 characters:');
    console.log('─'.repeat(80));
    console.log(csvText.substring(0, 2000));
    console.log('─'.repeat(80));

    // Count rows
    const rows = csvText.split('\n').filter(row => row.trim());
    console.log(`\n📈 Total rows: ${rows.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nℹ️  The sheet may not be publicly accessible.');
    console.log('ℹ️  Please ensure the sheet is shared with "Anyone with the link can view"');
  }
}

fetchData();
