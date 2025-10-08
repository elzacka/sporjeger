/**
 * SAFE BA-style improvement with validation
 * Processes ONE item at a time to prevent scrambling
 */

import dotenv from 'dotenv';
import { google } from 'googleapis';
import Anthropic from '@anthropic-ai/sdk';
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

let anthropic = null;

function initClaude() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function loadStyleGuide() {
  const styleGuidePath = join(__dirname, '../docs/not_public/TRANSLATION_STYLE_GUIDE.md');
  if (existsSync(styleGuidePath)) {
    return readFileSync(styleGuidePath, 'utf8');
  }
  return null;
}

function loadCategoryMapping() {
  const mappingPath = join(__dirname, 'category-mapping.json');
  if (existsSync(mappingPath)) {
    return JSON.parse(readFileSync(mappingPath, 'utf8'));
  }
  return {};
}

function translateCategory(category, mapping) {
  return mapping[category] || category;
}

function mapCostType(cost) {
  const costLower = (cost || '').toLowerCase();
  if (costLower.includes('free') || costLower === 'free') return 'Gratis';
  if (costLower.includes('partially free')) return 'Gratis med kjøp';
  if (costLower.includes('paid')) return 'Betalt';
  return cost;
}

/**
 * Translate ONE description with BA-style (safe)
 */
async function translateOneWithBAStyle(toolName, description, styleGuide, systemMessage) {
  const claude = initClaude();
  if (!claude) return description;

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';

  try {
    const message = await claude.messages.create({
      model: model,
      max_tokens: 1024,
      system: systemMessage,
      messages: [{
        role: 'user',
        content: `Tool name: ${toolName}\nDescription: ${description}\n\nWrite a BA-style Norwegian description (2-3 sentences with personality, metaphors, warmth):`
      }]
    });

    const result = message.content[0].text.trim();
    return result;
  } catch (error) {
    console.warn(`Failed for ${toolName}:`, error.message);
    return description;
  }
}

async function improveSafely() {
  console.log('🎨 SAFE BA-style improvement (one-by-one processing)...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const categoryMapping = loadCategoryMapping();
  const styleGuide = loadStyleGuide();

  // Build system message once
  const systemMessage = [];
  if (styleGuide) {
    systemMessage.push({
      type: 'text',
      text: styleGuide,
      cache_control: { type: 'ephemeral' }
    });

    systemMessage.push({
      type: 'text',
      text: `Du er Bjarte Arneson og skriver OSINT-verktøybeskrivelser på norsk (bokmål).

STIL REQUIREMENTS:
- Varm, samtalepreget, metaforisk
- Finn gleden i det praktiske
- 2-3 setninger minimum
- Legg til personlighet og humor

GODE EKSEMPLER:
✅ "Akademisk digitalt bibliotek – Bøker og artikler på hyllene – perfekt for de som liker fotnoter."
✅ "Digital whiteboard – Et virtuelt møterom der ideer flyter fritt. Bokser og piler som oppfører seg, uten krangel om hvem som har markeren."
✅ "Ansiktsanalyseverktøy – Leser ansiktstrekk og mønstre. Som en venn som alltid legger merke til mørke ringer under øynene."

UNNGÅ:
❌ Tørre fakta uten personlighet
❌ Korte enkeltord
❌ Kjedelige tekniske beskrivelser

Skriv PÅ NORSK med BA-personlighet!`,
      cache_control: { type: 'ephemeral' }
    });
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'A:G',
  });

  const rows = response.data.values || [];
  if (rows.length <= 1) {
    console.log('✓ Sheet is empty');
    return;
  }

  const dataRows = rows.slice(1);
  console.log(`Found ${dataRows.length} rows\n`);
  console.log('Processing ONE-BY-ONE for safety...\n');

  let processed = 0;
  const BATCH_UPDATE_SIZE = 50;
  const updates = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const rowIndex = i + 2;
    const toolName = row[1] || '';
    const category = row[0] || '';
    const description = row[3] || '';

    // Skip if description is already good (has personality indicators and is in Norwegian)
    const isGood = description.length > 80 &&
                   (description.includes('–') || description.includes('.')) &&
                   !description.includes(':') && // Likely English stubs end with ":"
                   !/^[A-Z][a-z]+ [A-Z]/.test(description); // Not "WebMemory" style

    if (isGood) {
      // Still update category if needed
      const translatedCategory = translateCategory(category, categoryMapping);
      if (translatedCategory !== category) {
        updates.push({
          range: `A${rowIndex}`,
          values: [[translatedCategory]]
        });
      }
      console.log(`${rowIndex}. ${toolName}: ✓ Already good`);
      processed++;
      continue;
    }

    // Translate
    console.log(`${rowIndex}. ${toolName}: Improving...`);
    const improved = await translateOneWithBAStyle(toolName, description, styleGuide, systemMessage);

    const translatedCategory = translateCategory(category, categoryMapping);

    const improvedRow = [
      translatedCategory,
      row[1] || '',
      row[2] || '',
      improved,
      mapCostType(row[4]) || '',
      row[5] || '',
      row[6] || ''
    ];

    updates.push({
      range: `A${rowIndex}:G${rowIndex}`,
      values: [improvedRow]
    });

    processed++;

    // Batch update every 50 items
    if (updates.length >= BATCH_UPDATE_SIZE) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: {
          valueInputOption: 'RAW',
          data: updates
        }
      });
      console.log(`   📤 Saved ${updates.length} updates\n`);
      updates.length = 0;
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Final batch
  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: updates
      }
    });
    console.log(`   📤 Saved final ${updates.length} updates\n`);
  }

  console.log(`\n✅ Processed ${processed} entries safely!`);
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await improveSafely();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
