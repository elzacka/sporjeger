// Strict union types for compile-time validation
export type Kostnad = 'GRATIS' | 'KOSTNAD' | 'GRATISH';
export type RegistreringKrav = 'Ja' | 'Delvis' | 'Nei';
export type Designkvalitet = '1' | '2' | '3';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

// Tool type indicators (inspired by OSINT Framework)
export type ToolType = 'web' | 'terminal' | 'dork' | 'browser-extension' | 'api' | 'mobile';

// Platform support
export type Platform = 'web' | 'windows' | 'mac' | 'linux' | 'mobile' | 'all';

export interface OSINTTool {
  // Core fields (required)
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: Kostnad;

  // Optional fields (existing)
  språk?: string;
  kreverRegistrering?: RegistreringKrav;
  designkvalitet?: Designkvalitet;
  vanskelighetsgrad?: Vanskelighetsgrad;
  veiledning?: string;
  enderEllerSlette?: string;

  // New fields for enhanced features
  toolType?: ToolType; // Tool type indicator (T, D, R, etc.)
  tags?: string[]; // Additional searchable keywords
  categoryPath?: string[]; // Hierarchical category path ['Parent', 'Child']
  platform?: Platform; // Platform compatibility
  lastVerified?: string; // ISO date string for last URL verification
  alternatives?: string[]; // Similar/alternative tools
}
