export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: string;
  detaljer: string;
  språk: string;
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