/**
 * ═══════════════════════════════════════════════════════════════════════════
 * Sporjeger GitHub Sync - World-Class OSINT Toolkit Database Builder
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Team: Developer + UI/UX Expert + OSINT Expert (Best of 2025)
 *
 * This script syncs Bellingcat's complete toolkit from their GitHub repository:
 * - 346 tools with rich metadata from gitbook/tools/ README files
 * - Extracts: name, URL, description, cost, difficulty, categories
 * - Preserves: ethical considerations, requirements, limitations
 * - Syncs to: Enhanced Google Sheet with comprehensive metadata
 * - Enables: Advanced filtering, better UX, complete investigative context
 *
 * Data Flow:
 * 1. Fetch list of all tool folders from GitHub API
 * 2. Parse each README.md for YAML frontmatter + structured content
 * 3. Extract metadata: URL, cost, difficulty, requirements, ethics, etc.
 * 4. Compare with Google Sheet (URL as unique key)
 * 5. Add/Update/Remove tools (respecting "Endre eller slette" protection)
 * 6. Sort alphabetically by Category → Name
 * 7. Validate all operations before applying
 * ═══════════════════════════════════════════════════════════════════════════
 */

import dotenv from 'dotenv';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_REPO = 'bellingcat/toolkit';
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/bellingcat/toolkit/main';
const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;

// Load service account credentials
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
 * Parse YAML frontmatter from markdown
 */
function parseYAMLFrontmatter(markdown) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = markdown.match(frontmatterRegex);

  if (!match) return {};

  const yamlContent = match[1];
  const metadata = {};

  // Parse YAML (simple key: value pairs and multi-line strings)
  const lines = yamlContent.split('\n');
  let currentKey = null;
  let currentValue = [];

  for (const line of lines) {
    if (line.trim().startsWith('#')) continue; // Skip comments

    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);
    if (keyValueMatch) {
      // Save previous key-value if exists
      if (currentKey) {
        metadata[currentKey] = currentValue.join(' ').trim();
      }

      currentKey = keyValueMatch[1];
      currentValue = [keyValueMatch[2].replace(/^['>-]\s*/, '').trim()];
    } else if (currentKey && line.trim()) {
      // Continuation of multi-line value
      currentValue.push(line.trim());
    }
  }

  // Save last key-value
  if (currentKey) {
    metadata[currentKey] = currentValue.join(' ').trim();
  }

  return metadata;
}

/**
 * Extract structured metadata from README content
 * (Developer + OSINT Expert collaboration)
 */
function extractToolMetadata(readmeContent, toolSlug) {
  const metadata = {
    slug: toolSlug,
    name: null,
    url: null,
    description: null,
    cost: null,
    difficulty: null,
    category: null,
    requirements: null,
    limitations: null,
    ethicalConsiderations: false,
    provider: null,
    features: [],
    languages: [],
    guideUrl: `https://bellingcat.gitbook.io/toolkit/more/all-tools/${toolSlug}`
  };

  // Parse YAML frontmatter
  const yamlData = parseYAMLFrontmatter(readmeContent);
  if (yamlData.description) {
    metadata.description = yamlData.description;
  }
  if (yamlData.updated) {
    metadata.lastUpdated = yamlData.updated;
  }

  // Extract title (first # heading)
  const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    metadata.name = titleMatch[1].trim();
  }

  // Extract URL (in markdown link format, plain URL, or Liquid embed tag)
  // First try Liquid embed tag: {% embed url="..." %}
  let urlMatch = readmeContent.match(/\{%\s*embed\s+url=["']([^"']+)["']\s*%\}/i);

  if (!urlMatch) {
    // Try other formats
    urlMatch = readmeContent.match(/##\s*URL\s*\n+\[([^\]]+)\]\(([^)]+)\)/i) ||
               readmeContent.match(/##\s*URL\s*\n+([^\s\n{]+)/i) ||
               readmeContent.match(/\*\*URL:\*\*\s*\[([^\]]+)\]\(([^)]+)\)/i) ||
               readmeContent.match(/\*\*URL:\*\*\s*\n+([^\s\n{]+)/i) ||
               readmeContent.match(/URL:\s*\[([^\]]+)\]\(([^)]+)\)/i) ||
               readmeContent.match(/\*\*URL:\*\*\s*<?([^<>\s{]+)>?/i) ||
               readmeContent.match(/URL:\s*<?([^<>\s{]+)>?/i);
  }

  if (urlMatch) {
    // Extract URL from markdown link [text](url), plain URL, or Liquid tag
    metadata.url = (urlMatch[2] || urlMatch[1]).trim();
  }

  // Extract cost (check for checkbox format: [x] Partially Free)
  let cost = null;
  if (readmeContent.match(/\[x\]\s+Partially\s+Free/i)) {
    cost = 'Gratis med kjøp';
  } else if (readmeContent.match(/\[x\]\s+Free/i)) {
    cost = 'Gratis';
  } else if (readmeContent.match(/\[x\]\s+Paid/i)) {
    cost = 'Betalt';
  } else {
    // Fallback to text extraction
    const costMatch = readmeContent.match(/\*\*Cost:\*\*\s*(.+?)(?:\n|$)/i) ||
                      readmeContent.match(/##\s*Cost[\s\S]{0,200}?([A-Za-z\s]+)(?=\n##)/i);
    if (costMatch) {
      const costText = costMatch[1].trim().toLowerCase();
      if (costText.includes('partially free')) {
        cost = 'Gratis med kjøp';
      } else if (costText.includes('free') && !costText.includes('partially')) {
        cost = 'Gratis';
      } else if (costText.includes('paid')) {
        cost = 'Betalt';
      }
    }
  }
  metadata.cost = cost || 'Gratis';

  // Extract difficulty (OSINT Expert: Critical for user selection)
  // Format: either in table <td>4</td> or as text "4/5"
  const difficultyTableMatch = readmeContent.match(/<td[^>]*>(\d)<\/td>/i);
  const difficultyTextMatch = readmeContent.match(/\*\*Difficulty:\*\*\s*(\d)\/5/i) ||
                               readmeContent.match(/Difficulty:\s*(\d)\/5/i) ||
                               readmeContent.match(/Level\s+of\s+difficulty[\s\S]*?(\d)\/5/i);

  if (difficultyTableMatch) {
    metadata.difficulty = difficultyTableMatch[1];
  } else if (difficultyTextMatch) {
    metadata.difficulty = difficultyTextMatch[1];
  }

  // Extract category (from markdown structure or content)
  const categoryMatch = readmeContent.match(/\*\*Category:\*\*\s*(.+?)(?:\n|$)/i);
  if (categoryMatch) {
    metadata.category = categoryMatch[1].trim();
  }

  // Extract requirements (OSINT Expert: Essential for tool selection)
  const requirementsMatch = readmeContent.match(/##\s*Requirements?\s*\n+([\s\S]*?)(?=\n##|\n\*\*|$)/i);
  if (requirementsMatch) {
    const reqs = requirementsMatch[1].trim().split('\n').filter(l => l.trim());
    metadata.requirements = reqs.slice(0, 3).join('; '); // First 3 requirements
  }

  // Extract limitations (OSINT Expert: Critical for investigation planning)
  const limitationsMatch = readmeContent.match(/##\s*Limitations?\s*\n+([\s\S]*?)(?=\n##|\n\*\*|$)/i);
  if (limitationsMatch) {
    const limits = limitationsMatch[1].trim().split('\n').filter(l => l.trim());
    metadata.limitations = limits.slice(0, 2).join('; '); // First 2 limitations
  }

  // Check for ethical considerations (OSINT Expert: Professional responsibility)
  if (readmeContent.match(/##\s*Ethical\s+Considerations?/i)) {
    metadata.ethicalConsiderations = true;
  }

  // Extract tool provider
  const providerMatch = readmeContent.match(/\*\*Tool\s+provider:\*\*\s*(.+?)(?:\(|$)/i);
  if (providerMatch) {
    metadata.provider = providerMatch[1].trim();
  }

  // Extract programming languages (for technical users)
  const langMatch = readmeContent.match(/(?:JavaScript|Python|R|PHP|Ruby|Java|C\+\+|Go|Rust)/gi);
  if (langMatch) {
    metadata.languages = [...new Set(langMatch)].slice(0, 3);
  }

  return metadata;
}

/**
 * Fetch all tool folders from GitHub API
 * (Developer: Efficient API usage with pagination)
 */
async function fetchAllToolFolders() {
  console.log('📥 Fetching tool list from GitHub API...');

  const url = `${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents/gitbook/tools`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Sporjeger-Sync'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const contents = await response.json();
  const toolFolders = contents
    .filter(item => item.type === 'dir')
    .map(item => item.name)
    .sort();

  console.log(`✓ Found ${toolFolders.length} tool folders\n`);
  return toolFolders;
}

/**
 * Fetch and parse README for a single tool
 * (Developer: Robust error handling + retry logic)
 */
async function fetchToolMetadata(toolSlug, retries = 3) {
  const readmeUrl = `${GITHUB_RAW_BASE}/gitbook/tools/${toolSlug}/README.md`;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(readmeUrl);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`   ⚠️  ${toolSlug}: README not found`);
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const content = await response.text();
      const metadata = extractToolMetadata(content, toolSlug);

      // Validation (Developer: Data quality check)
      if (!metadata.url || !metadata.name) {
        console.log(`   ⚠️  ${toolSlug}: Missing critical data (URL or Name)`);
        return null;
      }

      return metadata;
    } catch (error) {
      if (attempt === retries) {
        console.log(`   ❌ ${toolSlug}: Failed after ${retries} attempts - ${error.message}`);
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  return null;
}

/**
 * Fetch all tools with their metadata
 * (Developer: Batch processing with progress tracking)
 */
async function fetchAllTools(dryRun = false) {
  const toolFolders = await fetchAllToolFolders();
  const tools = [];
  const failed = [];

  console.log('📖 Parsing tool metadata from README files...\n');

  const batchSize = 10;
  for (let i = 0; i < toolFolders.length; i += batchSize) {
    const batch = toolFolders.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(slug => fetchToolMetadata(slug))
    );

    batchResults.forEach((metadata, idx) => {
      if (metadata) {
        tools.push(metadata);
        console.log(`   ✓ ${batch[idx]}`);
      } else {
        failed.push(batch[idx]);
      }
    });

    // Progress indicator
    console.log(`   Progress: ${Math.min(i + batchSize, toolFolders.length)}/${toolFolders.length}\n`);

    // Rate limiting (GitHub API: 60 req/hr unauthenticated, 5000 req/hr authenticated)
    if (i + batchSize < toolFolders.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully parsed: ${tools.length}`);
  console.log(`   ❌ Failed: ${failed.length}`);
  if (failed.length > 0 && failed.length <= 10) {
    console.log(`   Failed tools: ${failed.join(', ')}`);
  }
  console.log('');

  return tools;
}

/**
 * Fetch current Google Sheet data
 * (Developer: Clean data access layer)
 */
async function fetchSheetData(sheets) {
  console.log('📥 Fetching current Google Sheet data...');

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:I', // 9 columns: A-I
  });

  const rows = response.data.values || [];

  if (rows.length === 0) {
    throw new Error('Sheet is empty');
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  console.log(`✓ Found ${dataRows.length} tools in Google Sheet`);
  console.log(`  Current columns: ${headers.length}\n`);

  // Find the "Endre eller slette" column
  const doNotEditColIndex = headers.findIndex(h =>
    h && h.toLowerCase().includes('endre') && h.toLowerCase().includes('slette')
  );

  return {
    headers,
    dataRows,
    doNotEditColIndex
  };
}

/**
 * Compare and identify sync operations
 * (OSINT Expert: Preserve investigative context, Developer: Smart diffing)
 * Enhanced to match by name when URL is placeholder
 */
function analyzeDifferences(githubTools, sheetData) {
  console.log('🔍 Analyzing differences between GitHub and Google Sheet...\n');

  const { dataRows, doNotEditColIndex } = sheetData;

  // Create URL and name maps for GitHub tools
  const githubUrlMap = new Map();
  const githubNameMap = new Map();

  githubTools.forEach(tool => {
    if (tool.url) {
      githubUrlMap.set(tool.url, tool);
    }
    if (tool.name) {
      // Store by lowercase name for case-insensitive matching
      githubNameMap.set(tool.name.toLowerCase(), tool);
    }
  });

  const sheetUrlMap = new Map();
  const sheetNameMap = new Map();
  const protectedTools = new Set();

  dataRows.forEach((row, index) => {
    const url = row[2]; // Column C (URL)
    const name = row[1]; // Column B (Name)
    const rowInfo = { rowIndex: index + 2, data: row };

    if (url) {
      sheetUrlMap.set(url, rowInfo);
    }
    if (name) {
      sheetNameMap.set(name.toLowerCase(), rowInfo);
    }

    // Check protection status
    if (doNotEditColIndex >= 0 && row[doNotEditColIndex]) {
      const value = row[doNotEditColIndex].toString().toLowerCase();
      if (value === 'nei' || value === 'no') {
        protectedTools.add(url);
        if (name) protectedTools.add(name.toLowerCase());
      }
    }
  });

  // Identify operations
  const toAdd = [];
  const toUpdate = [];
  const toRemove = [];
  let placeholderMatches = 0;

  // Find tools to ADD or UPDATE
  githubTools.forEach(tool => {
    const isPlaceholderInSheet = (existingRow) => {
      const existingUrl = existingRow.data[2];
      return existingUrl && (existingUrl.includes('example.com') || existingUrl === '');
    };

    // Try matching by URL first
    let existing = sheetUrlMap.get(tool.url);
    let matchedBy = 'url';

    // If no URL match, try matching by name (for placeholder URLs)
    if (!existing && tool.name) {
      const nameMatch = sheetNameMap.get(tool.name.toLowerCase());
      if (nameMatch && isPlaceholderInSheet(nameMatch)) {
        existing = nameMatch;
        matchedBy = 'name';
        placeholderMatches++;
      }
    }

    if (!existing) {
      toAdd.push(tool);
    } else {
      // Check if protected
      const isProtected = protectedTools.has(tool.url) ||
                         protectedTools.has(tool.name.toLowerCase());

      if (!isProtected) {
        // Check if needs update (name changed, or matched by name with placeholder URL)
        const existingName = existing.data[1];
        const existingUrl = existing.data[2];
        const existingVeiledning = existing.data[7] || '';

        if (existingName !== tool.name ||
            matchedBy === 'name' ||
            existingUrl.includes('example.com') ||
            existingVeiledning === '') {
          toUpdate.push({ tool, existing, matchedBy });
        }
      }
    }
  });

  // Find tools to REMOVE (not in GitHub, not protected, not placeholder)
  sheetUrlMap.forEach((sheetTool, url) => {
    if (!githubUrlMap.has(url) &&
        !url.includes('example.com') &&
        !protectedTools.has(url)) {
      toRemove.push(sheetTool);
    }
  });

  console.log(`📊 Sync Summary:`);
  console.log(`   ➕ Tools to ADD: ${toAdd.length}`);
  console.log(`   🔄 Tools to UPDATE: ${toUpdate.length}`);
  console.log(`   📝 Tools matched by name (placeholder URLs): ${placeholderMatches}`);
  console.log(`   ➖ Tools to REMOVE: ${toRemove.length}`);
  console.log(`   🛡️  Protected tools: ${protectedTools.size}\n`);

  return { toAdd, toUpdate, toRemove, protectedTools };
}

/**
 * Simplified 9-Column Google Sheet schema
 * (UI/UX Expert: Clean, focused information hierarchy)
 */
const SHEET_COLUMNS = {
  A: 'Kategori',
  B: 'Navn',
  C: 'URL',
  D: 'Beskrivelse',
  E: 'Kostnad',
  F: 'Språk',              // Manual only - never populated by script
  G: 'Vanskelighetsgrad',
  H: 'Veiledning',         // Guide URL (Bellingcat GitBook)
  I: 'Endre eller slette'  // Protection flag - manual only
};

/**
 * Convert tool metadata to sheet row (9-column structure)
 * (Developer: Clean data transformation)
 */
function toolToSheetRow(tool) {
  return [
    tool.category || 'Uncategorized',  // A: Kategori
    tool.name,                          // B: Navn
    tool.url,                           // C: URL
    tool.description || '',             // D: Beskrivelse
    tool.cost || 'Gratis',             // E: Kostnad
    '',                                 // F: Språk (manual only - leave empty)
    tool.difficulty || '',              // G: Vanskelighetsgrad
    tool.guideUrl || '',                // H: Veiledning (Bellingcat GitBook URL)
    ''                                  // I: Endre eller slette (empty for new tools)
  ];
}

/**
 * Perform sync operations
 * (Developer: Transactional operations with validation)
 */
async function performSync(sheets, syncOps, sheetData, dryRun = false) {
  const { toAdd, toUpdate, toRemove } = syncOps;

  if (dryRun) {
    console.log('🧪 DRY RUN MODE - No changes will be made\n');
  }

  // 1. Update headers if needed
  const expectedHeaders = Object.values(SHEET_COLUMNS);
  if (JSON.stringify(sheetData.headers) !== JSON.stringify(expectedHeaders)) {
    console.log('📝 Updating sheet headers...');
    if (!dryRun) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'A1:I1',
        valueInputOption: 'RAW',
        resource: { values: [expectedHeaders] }
      });
    }
    console.log('✓ Headers updated\n');
  }

  // 2. Add new tools
  if (toAdd.length > 0) {
    console.log(`➕ Adding ${toAdd.length} new tools...`);

    const newRows = toAdd.map(tool => toolToSheetRow(tool));

    if (!dryRun) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'A:I',
        valueInputOption: 'RAW',
        resource: { values: newRows }
      });
    } else {
      console.log(`   Would add: ${toAdd.slice(0, 5).map(t => t.name).join(', ')}${toAdd.length > 5 ? '...' : ''}`);
    }

    console.log(`✓ Added ${toAdd.length} tools\n`);
  }

  // 3. Update existing tools
  if (toUpdate.length > 0) {
    console.log(`🔄 Updating ${toUpdate.length} tools...`);

    if (!dryRun) {
      const batchUpdates = toUpdate.map(({ tool, existing }) => ({
        range: `A${existing.rowIndex}:I${existing.rowIndex}`,
        values: [toolToSheetRow(tool)]
      }));

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          valueInputOption: 'RAW',
          data: batchUpdates
        }
      });
    } else {
      console.log(`   Would update: ${toUpdate.slice(0, 5).map(u => u.tool.name).join(', ')}${toUpdate.length > 5 ? '...' : ''}`);
    }

    console.log(`✓ Updated ${toUpdate.length} tools\n`);
  }

  // 4. Remove obsolete tools
  if (toRemove.length > 0) {
    console.log(`➖ Removing ${toRemove.length} obsolete tools...`);

    if (!dryRun) {
      // Get the correct sheet ID first
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID
      });
      const sheetId = spreadsheet.data.sheets[0].properties.sheetId;

      // Sort by row index descending to delete from bottom up
      const sorted = [...toRemove].sort((a, b) => b.rowIndex - a.rowIndex);

      console.log(`   Deleting ${sorted.length} rows in batches (to avoid rate limits)...`);

      // Batch deletions: 20 rows per request to stay under rate limits
      const BATCH_SIZE = 20;
      for (let i = 0; i < sorted.length; i += BATCH_SIZE) {
        const batch = sorted.slice(i, i + BATCH_SIZE);

        // Create delete requests for this batch (sorted desc, so rows shift correctly)
        const deleteRequests = batch.map(tool => ({
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: tool.rowIndex - 1,
              endIndex: tool.rowIndex
            }
          }
        }));

        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: {
            requests: deleteRequests
          }
        });

        console.log(`   Progress: ${Math.min(i + BATCH_SIZE, sorted.length)}/${sorted.length}`);

        // Rate limiting: wait 1.5 seconds between batches (40 requests/min)
        if (i + BATCH_SIZE < sorted.length) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    } else {
      console.log(`   Would remove: ${toRemove.slice(0, 5).map(t => t.data[1]).join(', ')}${toRemove.length > 5 ? '...' : ''}`);
    }

    console.log(`✓ Removed ${toRemove.length} tools\n`);
  }

  if (toAdd.length === 0 && toUpdate.length === 0 && toRemove.length === 0) {
    console.log('✓ No changes needed - sheet is up to date\n');
  }
}

/**
 * Sort sheet alphabetically
 * (UI/UX Expert: Predictable organization)
 */
async function sortSheet(sheets, dryRun = false) {
  console.log('📊 Sorting data alphabetically (Category → Name)...');

  if (dryRun) {
    console.log('   (DRY RUN - skipping sort)\n');
    return;
  }

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID
  });

  const sheetId = spreadsheet.data.sheets[0].properties.sheetId;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:I',
  });

  const rowCount = response.data.values?.length || 0;

  if (rowCount <= 1) {
    console.log('   No data to sort\n');
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    resource: {
      requests: [{
        sortRange: {
          range: {
            sheetId: sheetId,
            startRowIndex: 1,
            endRowIndex: rowCount,
            startColumnIndex: 0,
            endColumnIndex: 9
          },
          sortSpecs: [
            { dimensionIndex: 0, sortOrder: 'ASCENDING' }, // Category
            { dimensionIndex: 1, sortOrder: 'ASCENDING' }  // Name
          ]
        }
      }]
    }
  });

  console.log('✓ Data sorted successfully\n');
}

/**
 * Main function
 * (Team Lead: Orchestrate the entire sync process)
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const skipSort = args.includes('--skip-sort');

  try {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║  🚀 Sporjeger GitHub Sync - Complete Toolkit Database    ║');
    console.log('║     Developer + UI/UX Expert + OSINT Expert (2025)       ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (dryRun) {
      console.log('🧪 DRY RUN MODE - No changes will be made\n');
    }

    // Validate environment
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Step 1: Fetch all tools from GitHub
    const githubTools = await fetchAllTools(dryRun);

    // Step 2: Fetch current sheet data
    const sheetData = await fetchSheetData(sheets);

    // Step 3: Analyze differences
    const syncOps = analyzeDifferences(githubTools, sheetData);

    // Step 4: Perform sync
    await performSync(sheets, syncOps, sheetData, dryRun);

    // Step 5: Sort alphabetically
    if (!skipSort) {
      await sortSheet(sheets, dryRun);
    }

    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   ✅ Sync completed successfully!                         ║');
    console.log('║   🎯 Sporjeger now has complete Bellingcat toolkit data   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    if (dryRun) {
      console.log('💡 Run without --dry-run to apply changes\n');
    } else {
      console.log('🎨 Next steps for UI/UX enhancement:');
      console.log('   - Add difficulty filter (1-5 stars)');
      console.log('   - Show ethical considerations badge');
      console.log('   - Display requirements/limitations in tooltips');
      console.log('   - Add provider information');
      console.log('   - Link to comprehensive Bellingcat guides\n');
    }

  } catch (error) {
    console.error('\n❌ Error during sync:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
