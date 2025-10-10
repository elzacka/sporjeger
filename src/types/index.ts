export interface OSINTTool {
  kategori: string;            // A: Category
  navn: string;                // B: Tool name
  url: string;                 // C: Tool URL
  beskrivelse: string;         // D: Description
  kostnad: string;             // E: Cost (Gratis/Betalt/Gratis med kjøp)
  språk?: string;              // F: Language (manual only - flag emoji + language)
  vanskelighetsgrad?: string;  // G: Difficulty 1-5
  veiledning?: string;         // H: Guide URL (Bellingcat GitBook or manual)
  endreEllerSlette?: string;   // I: Protection flag ("Nei" = protected)
}

export interface SheetData {
  values: string[][];
}

export interface FilterState {
  categories: string[];
  costTypes: string[];
  difficulties: number[];      // NEW: 1-5 star difficulty filter
  searchQuery: string;
}

export type Theme = 'light' | 'dark';