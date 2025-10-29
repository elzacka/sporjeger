import type { OSINTTool, GoogleSheetsResponse } from '@/types';
import { API_CONFIG } from '@/constants';

/**
 * Google Sheets API service for fetching OSINT tool data
 * Uses Google Sheets API v4 with read-only access
 */

// Get environment variables
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// Google Sheets API endpoint
const SHEETS_API_BASE = 'https://sheets.googleapis.com/v4/spreadsheets';

/**
 * Fetches tool data from Google Sheets
 * @returns Promise<OSINTTool[]>
 */
export async function fetchToolsFromGoogleSheets(): Promise<OSINTTool[]> {
  if (!SHEET_ID || !API_KEY) {
    throw new Error(
      'Google Sheets konfigurering mangler. Sjekk at VITE_GOOGLE_SHEET_ID og VITE_GOOGLE_API_KEY er satt i .env.local'
    );
  }

  // Sheet range (extended to include new fields: A-Q)
  // A: Kategori, B: Navn, C: URL, D: Beskrivelse, E: Kostnad
  // F: Språk, G: Krever registrering, H: Designkvalitet, I: Vanskelighetsgrad
  // J: Veiledning, K: Endre eller slette
  // L: Tool Type, M: Platform, N: Tags (comma-separated), O: Category Path (comma-separated)
  // P: Last Verified, Q: Alternatives (comma-separated)
  const range = 'Ark 1!A2:Q'; // Skip header row (Norwegian sheet name)

  // Construct API URL
  const url = `${SHEETS_API_BASE}/${SHEET_ID}/values/${range}?key=${API_KEY}`;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          'Tilgang nektet. Sjekk at Google Sheets API-nøkkelen er gyldig og at regnearket er delt offentlig.'
        );
      }
      if (response.status === 404) {
        throw new Error(
          'Regnearket ble ikke funnet. Sjekk at VITE_GOOGLE_SHEET_ID er riktig.'
        );
      }
      throw new Error(`Google Sheets API feil: ${response.status} ${response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length === 0) {
      throw new Error('Ingen data funnet i regnearket.');
    }

    // Transform rows to OSINTTool objects
    const tools = data.values.map((row) => transformRowToTool(row)).filter(Boolean) as OSINTTool[];

    console.log(`📊 Google Sheets data: ${data.values.length} rows fetched, ${tools.length} tools after validation`);
    const rejectedCount = data.values.length - tools.length;
    if (rejectedCount > 0) {
      console.warn(`⚠️ ${rejectedCount} rows rejected due to validation failures (check console for details)`);
    }

    return tools;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(
          `Forespørselen tok for lang tid (>${API_CONFIG.REQUEST_TIMEOUT / 1000}s). Sjekk internettforbindelsen.`
        );
      }
      throw error;
    }
    throw new Error('Ukjent feil ved henting av data fra Google Sheets.');
  }
}

/**
 * Transforms a Google Sheets row to an OSINTTool object
 * Row format: [Kategori, Navn, URL, Beskrivelse, Kostnad, Språk, Krever registrering,
 *              Designkvalitet, Vanskelighetsgrad, Veiledning, Endre eller slette,
 *              Tool Type, Platform, Tags, Category Path, Last Verified, Alternatives]
 */
function transformRowToTool(row: string[]): OSINTTool | null {
  // Validate required fields (A-E: Kategori, Navn, URL, Beskrivelse, Kostnad)
  if (!row[0] || !row[1] || !row[2] || !row[3] || !row[4]) {
    console.warn('Skipping row with missing required fields:', row);
    return null;
  }

  // Validate Kostnad type (case-insensitive, with normalization)
  const kostnadRaw = row[4]?.trim().toUpperCase();
  let kostnad: 'GRATIS' | 'KOSTNAD' | 'GRATISH';

  if (kostnadRaw === 'GRATIS' || kostnadRaw === 'FREE') {
    kostnad = 'GRATIS';
  } else if (kostnadRaw === 'KOSTNAD' || kostnadRaw === 'BETALT' || kostnadRaw === 'PAID') {
    kostnad = 'KOSTNAD';
  } else if (kostnadRaw === 'GRATISH' || kostnadRaw === 'GRATIS MED KJØP' || kostnadRaw === 'FREEMIUM') {
    kostnad = 'GRATISH';
  } else {
    console.warn(`Invalid Kostnad value "${row[4]}" in row - skipping:`, row[1]);
    return null;
  }

  // Validate RegistreringKrav if present
  const kreverRegistrering = row[6]?.trim();
  if (
    kreverRegistrering &&
    kreverRegistrering !== 'Ja' &&
    kreverRegistrering !== 'Delvis' &&
    kreverRegistrering !== 'Nei'
  ) {
    console.warn(`Invalid RegistreringKrav value "${kreverRegistrering}" in row:`, row);
  }

  // Validate Vanskelighetsgrad if present
  const vanskelighetsgrad = row[8]?.trim();
  if (
    vanskelighetsgrad &&
    vanskelighetsgrad !== '1' &&
    vanskelighetsgrad !== '2' &&
    vanskelighetsgrad !== '3' &&
    vanskelighetsgrad !== '4' &&
    vanskelighetsgrad !== '5'
  ) {
    console.warn(`Invalid Vanskelighetsgrad value "${vanskelighetsgrad}" in row:`, row);
  }

  // Validate Tool Type if present
  const toolType = row[11]?.trim().toLowerCase();
  const validToolTypes = ['web', 'terminal', 'dork', 'browser-extension', 'api', 'mobile'];
  if (toolType && !validToolTypes.includes(toolType)) {
    console.warn(`Invalid ToolType value "${toolType}" in row:`, row);
  }

  // Validate Platform if present
  const platform = row[12]?.trim().toLowerCase();
  const validPlatforms = ['web', 'windows', 'mac', 'linux', 'mobile', 'all'];
  if (platform && !validPlatforms.includes(platform)) {
    console.warn(`Invalid Platform value "${platform}" in row:`, row);
  }

  // Parse comma-separated fields
  const parseCsvField = (value: string | undefined): string[] | undefined => {
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
    kostnad: kostnad as 'GRATIS' | 'KOSTNAD' | 'GRATISH',
    språk: row[5]?.trim() || undefined,
    kreverRegistrering:
      (kreverRegistrering as 'Ja' | 'Delvis' | 'Nei' | undefined) || undefined,
    designkvalitet: (row[7]?.trim() as '1' | '2' | '3' | undefined) || undefined,
    vanskelighetsgrad:
      (vanskelighetsgrad as '1' | '2' | '3' | '4' | '5' | undefined) || undefined,
    veiledning: row[9]?.trim() || undefined,
    enderEllerSlette: row[10]?.trim() || undefined,
    toolType:
      (toolType as 'web' | 'terminal' | 'dork' | 'browser-extension' | 'api' | 'mobile' | undefined) ||
      undefined,
    platform:
      (platform as 'web' | 'windows' | 'mac' | 'linux' | 'mobile' | 'all' | undefined) || undefined,
    tags: parseCsvField(row[13]),
    categoryPath: parseCsvField(row[14]),
    lastVerified: row[15]?.trim() || undefined,
    alternatives: parseCsvField(row[16]),
  };
}

/**
 * Checks if Google Sheets environment variables are configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return Boolean(SHEET_ID && API_KEY);
}
