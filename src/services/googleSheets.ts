import type { OSINTTool, SheetData } from '../types';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = 'A:K'; // Columns A-K (11 columns)

export async function fetchOSINTTools(): Promise<OSINTTool[]> {
  // Validate environment variables
  if (!SHEET_ID || !API_KEY) {
    throw new Error(
      'Manglende konfigurasjonsvariabler. Vennligst oppdater siden eller kontakt support.'
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for slower connections

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        // Disable caching for iOS Safari
        cache: 'no-store',
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          'Ingen tilgang til data. Vennligst prøv igjen senere.'
        );
      } else if (response.status === 404) {
        throw new Error(
          'Fant ikke datakilden. Vennligst kontakt support.'
        );
      } else if (response.status >= 500) {
        throw new Error(
          'Serverfeil. Vennligst prøv igjen om noen minutter.'
        );
      } else {
        throw new Error(
          `Kunne ikke laste data (HTTP ${response.status}). Vennligst prøv igjen.`
        );
      }
    }

    const data: SheetData = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Ugyldig dataformat mottatt. Vennligst prøv igjen.');
    }

    if (!data.values || !Array.isArray(data.values) || data.values.length <= 1) {
      console.warn('No tools found in sheet');
      return [];
    }

    // Skip header row and map to OSINTTool objects
    // Column mapping: A=Kategori, B=Navn, C=URL, D=Beskrivelse, E=Kostnad, F=Språk,
    //                 G=Krever registrering, H=Designkvalitet, I=Vanskelighetsgrad,
    //                 J=Veiledning, K=Endre eller slette
    const tools = data.values.slice(1).map((row): OSINTTool => ({
      kategori: row[0] || '',
      navn: row[1] || '',
      url: row[2] || '',
      beskrivelse: row[3] || '',
      kostnad: row[4] || '',
      språk: row[5] || '',
      kreverRegistrering: row[6] || '',
      designkvalitet: row[7] || '',
      vanskelighetsgrad: row[8] || '',
      veiledning: row[9] || '',
      endreEllerSlette: row[10] || ''
    }));

    return tools.filter(tool => tool.navn && tool.navn.trim() !== '');
  } catch (error) {
    console.error('Error fetching OSINT tools:', error);

    // Provide user-friendly error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        'Nettverksfeil. Vennligst sjekk internettforbindelsen din og prøv igjen.'
      );
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        'Forespørselen tok for lang tid. Vennligst prøv igjen.'
      );
    }

    // Re-throw if already a user-friendly error
    if (error instanceof Error && error.message.includes('Vennligst')) {
      throw error;
    }

    // Generic fallback error
    throw new Error(
      'Kunne ikke laste verktøy. Vennligst prøv igjen senere.'
    );
  }
}

export function getUniqueCategories(tools: OSINTTool[]): string[] {
  const categories = tools.map(tool => tool.kategori).filter(Boolean);
  return [...new Set(categories)].sort();
}