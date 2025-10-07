/**
 * Sync Bellingcat OSINT Tools to Google Sheets
 *
 * This script:
 * 1. Downloads the latest all-tools.csv from Bellingcat
 * 2. Parses the CSV data
 * 3. Translates descriptions to Norwegian (optional)
 * 4. Updates Google Sheet with new/updated tools
 */

import dotenv from 'dotenv';
import { google } from 'googleapis';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import Anthropic from '@anthropic-ai/sdk';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, existsSync } from 'fs';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const BELLINGCAT_CSV_URL = 'https://github.com/bellingcat/toolkit/releases/download/csv/all-tools.csv';
const SHEET_ID = process.env.VITE_GOOGLE_SHEET_ID;

// Load service account key from JSON file or environment variable
let SERVICE_ACCOUNT_KEY;
const serviceAccountPaths = [
  join(__dirname, '../osint-verktoydatabase-d1d26dc983b4.json'),
  join(__dirname, '../../osint-verktoydatabase-d1d26dc983b4.json'),
];

const serviceAccountPath = serviceAccountPaths.find(path => existsSync(path));
if (serviceAccountPath) {
  console.log('Loading service account from file:', serviceAccountPath);
  SERVICE_ACCOUNT_KEY = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  console.log('Loading service account from environment variable');
  SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
} else {
  SERVICE_ACCOUNT_KEY = null;
}

let anthropic = null;

/**
 * Initialize Claude API client
 */
function initClaude() {
  if (!anthropic && process.env.ANTHROPIC_API_KEY) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

/**
 * Translate text using Claude API
 * Provides context-aware, high-quality Norwegian translations
 *
 * Model selection (as of October 2025):
 * - claude-3-5-haiku-20241022: Fast, cost-effective ($0.50/$2.50 per MTok batch)
 * - claude-sonnet-4-5-20250929: Premium quality ($1.50/$7.50 per MTok batch)
 */
async function translateText(text) {
  if (!text) {
    return text;
  }

  const claude = initClaude();
  if (!claude) {
    console.warn('Claude API not configured, skipping translation');
    return text;
  }

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';

  try {
    const message = await claude.messages.create({
      model: model,
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate the following OSINT tool description from English to Norwegian (bokmål).

Keep technical terms and proper nouns in English when appropriate.
Use natural, concise Norwegian that would be clear to security researchers and investigators.
Return ONLY the translated text, nothing else.

Text to translate: "${text}"`
      }]
    });

    const translatedText = message.content[0].text.trim();
    console.log(`Translated: "${text}" → "${translatedText}"`);
    return translatedText;
  } catch (error) {
    console.warn(`Translation failed for "${text}":`, error.message);
    return text;
  }
}

/**
 * Load the complete translation style guide for caching
 */
function loadStyleGuide() {
  const styleGuidePath = join(__dirname, '../docs/not_public/TRANSLATION_STYLE_GUIDE.md');

  if (existsSync(styleGuidePath)) {
    return readFileSync(styleGuidePath, 'utf8');
  }

  console.warn('Translation style guide not found, using basic instructions');
  return null;
}

/**
 * Batch translate multiple texts efficiently with prompt caching
 * Reduces API calls by translating in batches
 *
 * Uses Claude API with prompt caching for 90% cost reduction on repeated calls.
 * The complete style guide is cached, so after the first translation batch,
 * subsequent translations cost only 10% of the base input token price.
 *
 * Processes 20 descriptions per API call to minimize costs while maintaining quality.
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

  // Model selection: Haiku for cost-efficiency, Sonnet 4.5 for premium quality
  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';
  const BATCH_SIZE = 20; // Translate 20 descriptions at once
  const results = [];

  // Load the complete style guide for caching
  const styleGuide = loadStyleGuide();

  console.log(`Using Claude model: ${model}`);
  console.log(`Prompt caching: ${styleGuide ? 'ENABLED (90% cost reduction)' : 'disabled'}`);
  console.log(`Processing ${texts.length} descriptions in batches of ${BATCH_SIZE}`);

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    try {
      const numbered = batch.map((text, idx) => `${idx + 1}. ${text}`).join('\n\n');

      // Build system message with caching
      const systemMessages = [];

      if (styleGuide) {
        // Cache the complete style guide (this will be reused across all batches)
        systemMessages.push({
          type: 'text',
          text: styleGuide,
          cache_control: { type: 'ephemeral' }
        });

        // Add translation-specific instructions (also cached)
        systemMessages.push({
          type: 'text',
          text: `You are translating OSINT tool descriptions from English to Norwegian (bokmål).

CRITICAL INSTRUCTIONS:
1. Follow ALL klarspråk principles from the style guide above
2. Use the OSINT terminology glossary (keep technical terms in English when specified)
3. Apply Arneson's tone of voice for descriptions (warm, conversational, professional)
4. Preserve ALL technical nuances and capabilities
5. Use modern, correct Norwegian spelling and grammar
6. Return ONLY the numbered translations, nothing else

The descriptions should be engaging but professional, technically accurate but accessible.`,
          cache_control: { type: 'ephemeral' }
        });
      } else {
        // Fallback if style guide not available
        systemMessages.push({
          type: 'text',
          text: `Translate OSINT tool descriptions from English to Norwegian (bokmål).

Keep technical terms and proper nouns in English when appropriate.
Use natural, concise Norwegian that would be clear to security researchers and investigators.
Return ONLY the numbered translations in the same format, nothing else.`
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

      // Show cache performance
      const usage = message.usage;
      const cacheInfo = usage.cache_read_input_tokens
        ? ` (cache read: ${usage.cache_read_input_tokens} tokens, saved ~${Math.round((usage.cache_read_input_tokens * 0.9) / 1000)}¢)`
        : ' (cache write: warming cache for next batch)';

      console.log(`✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}: ${batchResults.length} items translated${cacheInfo}`);

      // Small delay to avoid rate limits
      if (i + BATCH_SIZE < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`Batch translation failed:`, error.message);
      results.push(...batch); // Use original text on failure
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

/**
 * Download and parse Bellingcat CSV
 */
async function fetchBellingcatTools() {
  console.log('Fetching Bellingcat CSV...');
  const response = await fetch(BELLINGCAT_CSV_URL);
  const csvText = await response.text();

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true, // Allow inconsistent column counts
    relax_quotes: true, // Allow malformed quotes
    skip_records_with_error: true, // Skip problematic rows
    escape: '"',
    quote: '"',
    on_record: (record) => {
      // Merge extra columns into Details field if present
      const keys = Object.keys(record);
      if (keys.length > 6) {
        const extraFields = keys.slice(6);
        const extraValues = extraFields.map(k => record[k]).filter(Boolean);
        if (extraValues.length > 0) {
          record.Details = [record.Details, ...extraValues].filter(Boolean).join(', ');
        }
        extraFields.forEach(k => delete record[k]);
      }
      return record;
    }
  });

  console.log(`Found ${records.length} tools in Bellingcat CSV`);
  return records;
}

/**
 * Get existing tools from Google Sheet
 */
async function getExistingTools(sheets) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'A:G',
    });

    const rows = response.data.values || [];
    if (rows.length <= 1) return new Map(); // Empty or header only

    // Skip header row and create a map of Name -> row data
    const toolsMap = new Map();
    rows.slice(1).forEach((row, index) => {
      const name = row[1]; // Column B (Navn)
      if (name) {
        toolsMap.set(name, {
          rowIndex: index + 2, // +2 because: 1 for 0-index, 1 for header
          data: row
        });
      }
    });

    console.log(`Found ${toolsMap.size} existing tools in Google Sheet`);
    return toolsMap;
  } catch (error) {
    console.error('Error fetching existing tools:', error);
    return new Map();
  }
}

/**
 * Sync tools to Google Sheet
 */
async function syncToGoogleSheet(tools, translateDescriptions = false) {
  console.log('Authenticating with Google Sheets...');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const existingTools = await getExistingTools(sheets);

  const newTools = [];
  const updatedTools = [];

  console.log('Processing tools...');

  // Batch translate descriptions if enabled
  let descriptions = tools.map(t => t.Description);
  if (translateDescriptions) {
    console.log(`Translating ${descriptions.length} descriptions using Claude...`);
    descriptions = await batchTranslate(descriptions);
  }

  // Process each tool with translated descriptions
  tools.forEach((tool, index) => {
    const description = descriptions[index];

    const toolData = [
      tool.Category,           // Kategori
      tool.Name,              // Navn
      tool.URL,               // URL
      description,            // Beskrivelse
      mapCostType(tool.Cost), // Kostnad
      tool.Details || '',     // Detaljer
      ''                      // Språk (empty for international tools)
    ];

    if (existingTools.has(tool.Name)) {
      // Tool exists, check if it needs updating
      const existing = existingTools.get(tool.Name);
      const existingData = existing.data;

      // Compare URL and Description (main fields that might change)
      if (existingData[2] !== tool.URL || existingData[3] !== description) {
        updatedTools.push({ rowIndex: existing.rowIndex, data: toolData });
      }
    } else {
      // New tool
      newTools.push(toolData);
    }
  });

  console.log(`New tools: ${newTools.length}, Updated tools: ${updatedTools.length}`);

  // Append new tools
  if (newTools.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'A:G',
      valueInputOption: 'RAW',
      resource: {
        values: newTools
      }
    });
    console.log(`✓ Added ${newTools.length} new tools`);
  }

  // Update existing tools in batches to avoid rate limits
  if (updatedTools.length > 0) {
    console.log(`Updating ${updatedTools.length} tools in batch...`);

    const batchUpdateData = updatedTools.map(update => ({
      range: `A${update.rowIndex}:G${update.rowIndex}`,
      values: [update.data]
    }));

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        valueInputOption: 'RAW',
        data: batchUpdateData
      }
    });

    console.log(`✓ Updated ${updatedTools.length} tools`);
  }

  if (newTools.length === 0 && updatedTools.length === 0) {
    console.log('✓ No changes needed - sheet is up to date');
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Check required environment variables
    if (!SHEET_ID) {
      throw new Error('VITE_GOOGLE_SHEET_ID environment variable is required');
    }
    if (!SERVICE_ACCOUNT_KEY) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY or service account JSON file is required');
    }

    const translateDescriptions = process.env.TRANSLATE_DESCRIPTIONS === 'true';
    console.log(`Translation: ${translateDescriptions ? 'enabled' : 'disabled'}`);

    const tools = await fetchBellingcatTools();
    await syncToGoogleSheet(tools, translateDescriptions);

    console.log('\n✓ Sync completed successfully!');
  } catch (error) {
    console.error('Error during sync:', error);
    process.exit(1);
  }
}

main();
