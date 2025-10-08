export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: string;
  detaljer: string;
  språk: string;
  vanskelighetsgrad?: string;  // 1-5 difficulty rating
  veiledning?: string;          // Tutorial/guide URL or custom text
  sistOppdatert?: string;       // Last updated date
}

export interface SheetData {
  values: string[][];
}

export interface FilterState {
  categories: string[];
  costTypes: string[];
  searchQuery: string;
}

export type Theme = 'light' | 'dark';