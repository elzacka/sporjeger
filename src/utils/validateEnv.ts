/**
 * Environment variable validation
 * Ensures required environment variables are set
 */

export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  warningMessage?: string;
}

/**
 * Validates that required environment variables are set
 * For Milestone 3, Google Sheets credentials are optional (falls back to dummy data)
 */
export function validateEnvironment(): EnvValidationResult {
  const missingVars: string[] = [];

  // Check Google Sheets configuration (optional for now)
  const sheetId = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!sheetId) {
    missingVars.push('VITE_GOOGLE_SHEET_ID');
  }

  if (!apiKey) {
    missingVars.push('VITE_GOOGLE_API_KEY');
  }

  const isValid = missingVars.length === 0;

  return {
    isValid,
    missingVars,
    warningMessage: isValid
      ? undefined
      : `Manglende miljøvariabler: ${missingVars.join(', ')}. Bruker dummy data.`,
  };
}

/**
 * Logs environment validation results to console
 */
export function logEnvironmentValidation(): void {
  const result = validateEnvironment();

  if (result.isValid) {
    console.log('✅ Miljøvariabler validert - Google Sheets konfigurert');
  } else {
    console.warn('⚠️', result.warningMessage);
    console.info('💡 For å bruke live data, opprett .env.local med:');
    console.info('   VITE_GOOGLE_SHEET_ID=your_sheet_id');
    console.info('   VITE_GOOGLE_API_KEY=your_api_key');
  }
}
