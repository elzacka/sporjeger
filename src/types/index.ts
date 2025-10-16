// Cost types for better type safety
export type Kostnad = 'Gratis' | 'Betalt' | 'Gratis med kjøp';

// Registration requirement types
export type RegistreringKrav = 'Ja' | 'Delvis' | 'Nei';

// Design quality levels (1-3)
export type Designkvalitet = '1' | '2' | '3';

// Difficulty levels (1-5)
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

export interface OSINTTool {
  kategori: string;                     // A: Category
  navn: string;                         // B: Tool name
  url: string;                          // C: Tool URL
  beskrivelse: string;                  // D: Description
  kostnad: Kostnad;                     // E: Cost
  språk?: string;                       // F: Language (flag emoji + language)
  kreverRegistrering?: RegistreringKrav; // G: Registration required
  designkvalitet?: Designkvalitet;      // H: Design quality 1-3
  vanskelighetsgrad?: Vanskelighetsgrad; // I: Difficulty 1-5
  veiledning?: string;                  // J: Guide URL (Bellingcat GitBook or manual)
  endreEllerSlette?: string;            // K: Protection flag ("Nei" = protected)
}

export interface SheetData {
  values: string[][];
}

export interface FilterState {
  categories: string[];
  searchQuery: string;
}

export type Theme = 'light' | 'dark';