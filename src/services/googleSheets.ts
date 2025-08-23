import type { OSINTTool, SheetData } from '../types';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const RANGE = 'A:F'; // Columns A-F for all data

export async function fetchOSINTTools(): Promise<OSINTTool[]> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: SheetData = await response.json();
    
    if (!data.values || data.values.length <= 1) {
      return [];
    }
    
    // Skip header row and map to OSINTTool objects
    const tools = data.values.slice(1).map((row): OSINTTool => ({
      kategori: row[0] || '',
      navn: row[1] || '',
      url: row[2] || '',
      beskrivelse: row[3] || '',
      kostnad: row[4] || '',
      detaljer: row[5] || ''
    }));
    
    return tools.filter(tool => tool.navn.trim() !== '');
  } catch (error) {
    console.error('Error fetching OSINT tools:', error);
    throw error;
  }
}

export function getUniqueCategories(tools: OSINTTool[]): string[] {
  const categories = tools.map(tool => tool.kategori).filter(Boolean);
  return [...new Set(categories)].sort();
}