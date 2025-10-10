/**
 * Environment validation utility
 * Ensures required environment variables are present
 */

interface EnvVars {
  VITE_GOOGLE_SHEETS_API_KEY?: string;
  VITE_GOOGLE_SHEET_ID?: string;
  VITE_ENV?: string;
}

export function validateEnvironment(): void {
  const env = import.meta.env as EnvVars;
  const errors: string[] = [];

  // Required variables
  if (!env.VITE_GOOGLE_SHEETS_API_KEY) {
    errors.push('VITE_GOOGLE_SHEETS_API_KEY is missing');
  }

  if (!env.VITE_GOOGLE_SHEET_ID) {
    errors.push('VITE_GOOGLE_SHEET_ID is missing');
  }

  // Validate Sheet ID format (should be alphanumeric and dashes)
  if (env.VITE_GOOGLE_SHEET_ID) {
    const sheetIdPattern = /^[a-zA-Z0-9_-]+$/;
    if (!sheetIdPattern.test(env.VITE_GOOGLE_SHEET_ID)) {
      errors.push('VITE_GOOGLE_SHEET_ID has invalid format');
    }

    // Warn if using placeholder
    if (env.VITE_GOOGLE_SHEET_ID === 'YOUR_TEST_SHEET_ID_HERE') {
      errors.push(
        'Please replace YOUR_TEST_SHEET_ID_HERE with your actual test sheet ID in .env.local'
      );
    }
  }

  // Production check
  const productionSheetId = '1HOxZklC4NPdyDV7GSaRBWdY_MXCDvVN6Qw5DpnVohmI';

  if (import.meta.env.DEV && env.VITE_GOOGLE_SHEET_ID === productionSheetId) {
    console.warn(
      '⚠️  WARNING: You are using the PRODUCTION Google Sheet in development!\n' +
      '   Please create a test copy and update .env.local with your test sheet ID.'
    );
  }

  if (errors.length > 0) {
    const errorMessage =
      '❌ Environment Configuration Error:\n\n' +
      errors.map(err => `   • ${err}`).join('\n') +
      '\n\nPlease check your .env.local file and ensure all required variables are set.\n' +
      'See .env.development for an example configuration.';

    throw new Error(errorMessage);
  }

  // Success message in development
  if (import.meta.env.DEV) {
    const envType = env.VITE_GOOGLE_SHEET_ID === productionSheetId
      ? 'PRODUCTION (⚠️  not recommended)'
      : 'TEST';

    console.log(
      `✅ Environment validated successfully\n` +
      `   Mode: ${import.meta.env.MODE}\n` +
      `   Sheet: ${envType}\n` +
      `   Sheet ID: ${env.VITE_GOOGLE_SHEET_ID}`
    );
  }
}

/**
 * Get the current environment name
 */
export function getEnvironment(): 'development' | 'staging' | 'production' {
  const env = import.meta.env as EnvVars;

  if (env.VITE_ENV === 'production') return 'production';
  if (env.VITE_ENV === 'staging') return 'staging';
  return 'development';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production';
}
