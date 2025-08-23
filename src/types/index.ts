export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: string;
  detaljer: string;
}

export interface SheetData {
  values: string[][];
}

export interface FilterState {
  category: string;
  costType: 'all' | 'gratis' | 'betalt';
  searchQuery: string;
}

export type Theme = 'light' | 'dark';