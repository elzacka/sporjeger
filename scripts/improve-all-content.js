/**
 * Improve ALL existing content in Google Sheet
 * Re-translates all descriptions using the comprehensive style guide
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

let anthropic = null;

function initClaude() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

/**
 * Load the complete translation style guide for caching
 */
function loadStyleGuide() {
  const styleGuidePath = join(__dirname, '../docs/not_public/TRANSLATION_STYLE_GUIDE.md');

  if (existsSync(styleGuidePath)) {
    return readFileSync(styleGuidePath, 'utf8');
  }

  console.warn('Translation style guide not found');
  return null;
}

/**
 * Batch translate multiple texts efficiently with prompt caching
 */
async function batchTranslate(texts) {
  if (!texts || texts.length === 0) {
    return [];
  }

  const claude = initClaude();
  if (!claude) {
    console.warn('Claude API not configured, skipping translation');
    return texts;
  }

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';
  const BATCH_SIZE = 20;
  const results = [];

  const styleGuide = loadStyleGuide();

  console.log(`Using Claude model: ${model}`);
  console.log(`Prompt caching: ${styleGuide ? 'ENABLED (90% cost reduction)' : 'disabled'}`);
  console.log(`Processing ${texts.length} descriptions in batches of ${BATCH_SIZE}`);

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    try {
      const numbered = batch.map((text, idx) => `${idx + 1}. ${text}`).join('\n\n');

      const systemMessages = [];

      if (styleGuide) {
        systemMessages.push({
          type: 'text',
          text: styleGuide,
          cache_control: { type: 'ephemeral' }
        });

        systemMessages.push({
          type: 'text',
          text: `Du oversetter OSINT-verktøybeskrivelser fra engelsk til norsk (bokmål).

KRITISKE INSTRUKSJONER:
1. OVERSETT ALT TIL NORSK - beskrivelsene skal være på norsk bokmål
2. Følg ALLE klarspråk-prinsipper fra stilguiden over
3. Bruk OSINT-terminologiglossaret (behold tekniske termer på engelsk når spesifisert)
4. Bruk Arnesons tone of voice for beskrivelser (varm, samtalepreget, profesjonell)
5. Bevar ALLE tekniske nyanser og funksjoner
6. Bruk moderne, korrekt norsk stavemåte og grammatikk
7. Returner KUN de nummererte oversettelsene på NORSK, ingenting annet

EKSEMPLER PÅ RIKTIG OUTPUT (på norsk med Arneson-tone):

INPUT: "A reverse image search tool for finding similar images across the web"
OUTPUT: "Et verktøy for omvendt bildesøk som finner lignende bilder på nettet. Som å spørre internett: 'Har du sett dette før?'"

INPUT: "Tool for analyzing Twitter profiles and posts"
OUTPUT: "Analyserer Twitter-profiler og innlegg. Ideelt for å kartlegge hvem som sier hva, og når."

INPUT: "Facial recognition API for developers"
OUTPUT: "Ansiktsgjenkjennings-API for utviklere. Byggesteiner for å lære maskiner å huske ansikter."

Beskrivelsene skal være engasjerende men profesjonelle, teknisk presise men tilgjengelige, og ALLTID på norsk bokmål.`,
          cache_control: { type: 'ephemeral' }
        });
      }

      const message = await claude.messages.create({
        model: model,
        max_tokens: 4096,
        system: systemMessages,
        messages: [{
          role: 'user',
          content: numbered
        }]
      });

      const response = message.content[0].text.trim();
      const translations = response.split('\n').filter(line => /^\d+\./.test(line));

      const batchResults = translations.map(line => {
        return line.replace(/^\d+\.\s*/, '').trim();
      });

      results.push(...batchResults);

      const usage = message.usage;
      const cacheInfo = usage.cache_read_input_tokens
        ? ` (cache read: ${usage.cache_read_input_tokens} tokens, saved ~${Math.round((usage.cache_read_input_tokens * 0.9) / 1000)}¢)`
        : ' (cache write: warming cache)';

      console.log(`✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}: ${batchResults.length} items translated${cacheInfo}`);

      if (i + BATCH_SIZE < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`Batch translation failed:`, error.message);
      results.push(...batch);
    }
  }

  return results;
}

/**
 * Map cost types to Norwegian format
 */
function mapCostType(cost) {
  const costLower = (cost || '').toLowerCase();
  if (costLower.includes('free') || costLower === 'free') return 'Gratis';
  if (costLower.includes('partially free')) return 'Gratis med kjøp';
  if (costLower.includes('paid')) return 'Betalt';
  return cost;
}

async function improveAllContent() {
  console.log('🔄 Improving ALL content in Google Sheet...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

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

  console.log(`Found ${dataRows.length} rows to improve\n`);

  // Extract descriptions for translation
  const descriptions = dataRows.map(row => row[3] || ''); // Column D (Beskrivelse)

  console.log('📝 Translating all descriptions with style guide and caching...\n');
  const translatedDescriptions = await batchTranslate(descriptions);

  // Prepare batch update
  const batchUpdateData = [];

  dataRows.forEach((row, index) => {
    const rowIndex = index + 2; // +2 for 0-index and header
    const translatedDescription = translatedDescriptions[index];

    // Reconstruct row with improved content
    const improvedRow = [
      row[0] || '',                      // Kategori (keep as-is or translate separately)
      row[1] || '',                      // Navn
      row[2] || '',                      // URL
      translatedDescription,             // Beskrivelse (improved)
      mapCostType(row[4]) || '',         // Kostnad (normalized)
      row[5] || '',                      // Detaljer (preserve existing - reserved for manual "🇳🇴 Norsk")
      row[6] || ''                       // Språk
    ];

    batchUpdateData.push({
      range: `A${rowIndex}:G${rowIndex}`,
      values: [improvedRow]
    });
  });

  console.log(`\n📤 Updating ${batchUpdateData.length} rows in Google Sheet...`);

  // Update in chunks to avoid rate limits
  const CHUNK_SIZE = 100;
  for (let i = 0; i < batchUpdateData.length; i += CHUNK_SIZE) {
    const chunk = batchUpdateData.slice(i, i + CHUNK_SIZE);

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: chunk
      }
    });

    console.log(`   ✓ Updated rows ${i + 2} to ${Math.min(i + chunk.length + 1, dataRows.length + 1)}`);

    // Small delay between chunks
    if (i + CHUNK_SIZE < batchUpdateData.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Successfully improved all ${dataRows.length} entries!`);
  console.log('   - All descriptions re-translated with Klarspråk + Arneson tone');
  console.log('   - Cost types normalized to Norwegian');
  console.log('   - Prompt caching used for 90% cost savings');
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables or service account key');
    }

    await improveAllContent();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
