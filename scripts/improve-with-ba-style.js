/**
 * Improve ALL content with strong BA-style and category translation
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
 * Load category mapping
 */
function loadCategoryMapping() {
  const mappingPath = join(__dirname, 'category-mapping.json');
  if (existsSync(mappingPath)) {
    return JSON.parse(readFileSync(mappingPath, 'utf8'));
  }
  return {};
}

/**
 * Translate category using mapping
 */
function translateCategory(category, mapping) {
  return mapping[category] || category;
}

/**
 * Load the complete translation style guide
 */
function loadStyleGuide() {
  const styleGuidePath = join(__dirname, '../docs/not_public/TRANSLATION_STYLE_GUIDE.md');
  if (existsSync(styleGuidePath)) {
    return readFileSync(styleGuidePath, 'utf8');
  }
  return null;
}

/**
 * Batch translate with STRONG BA-style emphasis
 */
async function batchTranslateWithBAStyle(texts) {
  if (!texts || texts.length === 0) {
    return [];
  }

  const claude = initClaude();
  if (!claude) {
    console.warn('Claude API not configured');
    return texts;
  }

  const model = process.env.CLAUDE_MODEL || 'claude-3-5-haiku-20241022';
  const BATCH_SIZE = 20;
  const results = [];

  const styleGuide = loadStyleGuide();

  console.log(`Using Claude model: ${model}`);
  console.log(`Processing ${texts.length} descriptions with STRONG BA-STYLE`);

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
          text: `Du er Bjarte Arneson og skriver OSINT-verktøybeskrivelser på norsk (bokmål).

KRITISK: HVER beskrivelse MÅ ha Bjarte Arnesons varme, lekne, metaforiske stil!

DIN STIL (fra "Kilder til begeistring"):
- Finn gleden og sjarmen i det praktiske
- Bruk uventede metaforer og sammenligninger
- Skap et vennlig, personlig forhold til leseren
- Vær konverserende - som om du snakker med en venn over kaffe
- Legg til små personlige observasjoner og humor

DÅRLIGE eksempler (UNNGÅ):
❌ "Verktøy for å måle ansiktslikhet" (kjedelig, tørt, upersonlig)
❌ "WebMemory" (bare et ord, ingen personlighet)
❌ "TikTok Hashtag Arkiv" (bare fakta, ingen sjel)

GODE eksempler (ETTERLIGN):
✅ "Akademisk digitalt bibliotek – Bøker og artikler på hyllene – perfekt for de som liker fotnoter."
✅ "Digital whiteboard – Et virtuelt møterom der ideer flyter fritt. Bokser og piler som oppfører seg, uten krangel om hvem som har markeren."
✅ "Analyse av brukervilkår – Oversetter juridisk mumling til vanlig norsk."
✅ "Ansiktsgjenkjennings-API – Byggesteiner for å lære maskiner å huske ansikter."
✅ "Ansiktsanalyseverktøy – Leser ansiktstrekk og mønstre. Som en venn som alltid legger merke til mørke ringer under øynene."

OPPSKRIFT for hver beskrivelse:
1. Start med hva det ER (kort, klart)
2. Legg til en metafor eller sammenligning
3. Avslutt med en personlig touch, humor, eller relaterbar observasjon
4. Minst 2-3 setninger (ikke bare ett tørt faktum!)

REGLER:
- ALT på norsk bokmål
- Følg klarspråk-prinsipper (korte setninger, aktiv form)
- Behold tekniske termer på engelsk når nødvendig (OSINT, API, metadata)
- Bevar ALL teknisk info
- Returner KUN de nummererte oversettelsene

Husk: Du er ikke en teknisk manual - du er Bjarte Arneson som forklarer OSINT-verktøy med glede og personlighet!`,
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
        ? ` (cache read: ${usage.cache_read_input_tokens} tokens)`
        : ' (cache write)';

      console.log(`✓ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(texts.length / BATCH_SIZE)}${cacheInfo}`);

      if (i + BATCH_SIZE < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.warn(`Batch failed:`, error.message);
      results.push(...batch);
    }
  }

  return results;
}

/**
 * Map cost types to Norwegian
 */
function mapCostType(cost) {
  const costLower = (cost || '').toLowerCase();
  if (costLower.includes('free') || costLower === 'free') return 'Gratis';
  if (costLower.includes('partially free')) return 'Gratis med kjøp';
  if (costLower.includes('paid')) return 'Betalt';
  return cost;
}

async function improveAll() {
  console.log('🎨 Improving ALL content with BA-style and category translation...\n');

  const auth = new google.auth.GoogleAuth({
    credentials: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const categoryMapping = loadCategoryMapping();

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

  // Extract descriptions for BA-style translation
  const descriptions = dataRows.map(row => row[3] || '');

  console.log('📝 Re-writing with BA-style...\n');
  const improvedDescriptions = await batchTranslateWithBAStyle(descriptions);

  // Prepare batch update with category translation
  const batchUpdateData = [];

  dataRows.forEach((row, index) => {
    const rowIndex = index + 2;
    const category = row[0] || '';
    const translatedCategory = translateCategory(category, categoryMapping);
    const improvedDescription = improvedDescriptions[index];

    const improvedRow = [
      translatedCategory,                // Kategori (translated)
      row[1] || '',                      // Navn
      row[2] || '',                      // URL
      improvedDescription,               // Beskrivelse (BA-style)
      mapCostType(row[4]) || '',         // Kostnad
      row[5] || '',                      // Detaljer (preserve)
      row[6] || ''                       // Språk
    ];

    batchUpdateData.push({
      range: `A${rowIndex}:G${rowIndex}`,
      values: [improvedRow]
    });
  });

  console.log(`\n📤 Updating ${batchUpdateData.length} rows...\n`);

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

    if (i + CHUNK_SIZE < batchUpdateData.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log(`\n✅ Success! All ${dataRows.length} entries improved:`);
  console.log('   - Categories translated to Norwegian');
  console.log('   - Descriptions written in BA-style (warm, metaphorical, personal)');
  console.log('   - All content in Norwegian with Arneson personality');
}

async function main() {
  try {
    if (!SHEET_ID || !SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing required environment variables');
    }

    await improveAll();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
