// Strict union types for compile-time validation
export type Kostnad = 'GRATIS' | 'KOSTNAD' | 'GRATISH';
export type RegistreringKrav = 'Ja' | 'Delvis' | 'Nei';
export type Designkvalitet = '1' | '2' | '3';
export type Vanskelighetsgrad = '1' | '2' | '3' | '4' | '5';

export interface OSINTTool {
  kategori: string;
  navn: string;
  url: string;
  beskrivelse: string;
  kostnad: Kostnad;
  språk?: string;
  kreverRegistrering?: RegistreringKrav;
  designkvalitet?: Designkvalitet;
  vanskelighetsgrad?: Vanskelighetsgrad;
  veiledning?: string;
  enderEllerSlette?: string;
}
