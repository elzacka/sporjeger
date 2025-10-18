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

  // Sheet range (all columns A-K)
  const range = 'Ark 1!A2:K'; // Skip header row (Norwegian sheet name)

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
 * Row format: [Kategori, Navn, URL, Beskrivelse, Kostnad, Språk, Krever registrering, Designkvalitet, Vanskelighetsgrad, Veiledning, Endre eller slette]
 */
function transformRowToTool(row: string[]): OSINTTool | null {
  // Validate required fields (A-E: Kategori, Navn, URL, Beskrivelse, Kostnad)
  if (!row[0] || !row[1] || !row[2] || !row[3] || !row[4]) {
    console.warn('Skipping row with missing required fields:', row);
    return null;
  }

  // Validate Kostnad type
  const kostnad = row[4]?.trim();
  if (kostnad !== 'GRATIS' && kostnad !== 'KOSTNAD' && kostnad !== 'GRATISH') {
    console.warn(`Invalid Kostnad value "${kostnad}" in row:`, row);
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
  };
}

/**
 * Checks if Google Sheets environment variables are configured
 */
export function isGoogleSheetsConfigured(): boolean {
  return Boolean(SHEET_ID && API_KEY);
}
