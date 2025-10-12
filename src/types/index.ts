export interface OSINTTool {
  kategori: string;            // A: Category
  navn: string;                // B: Tool name
  url: string;                 // C: Tool URL
  beskrivelse: string;         // D: Description
  kostnad: string;             // E: Cost (Gratis/Betalt/Gratis med kjøp)
  språk?: string;              // F: Language (manual only - flag emoji + language)
  kreverRegistrering?: string; // G: Registration required (Ja/Delvis/Nei)
  designkvalitet?: string;     // H: Design quality 1-3
  vanskelighetsgrad?: string;  // I: Difficulty 1-5
  veiledning?: string;         // J: Guide URL (Bellingcat GitBook or manual)
  endreEllerSlette?: string;   // K: Protection flag ("Nei" = protected)
}

export interface SheetData {
  values: string[][];
}

export interface FilterState {
  categories: string[];
  costTypes: string[];
  difficulties: number[];           // 1-5 star difficulty filter
  designQualities: number[];        // 1-3 design quality filter
  registrationRequirements: string[]; // Ja/Delvis/Nei filter
  searchQuery: string;
}

export type Theme = 'light' | 'dark';