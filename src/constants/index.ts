// API Configuration
export const API_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3,
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  INSTALL_PROMPT_DISMISS_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  INSTALL_PROMPT_DELAY: 30000, // 30 seconds
  SERVICE_WORKER_UPDATE_INTERVAL: 60 * 60 * 1000, // 1 hour
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  INSTALL_PROMPT_DISMISSED: 'install-prompt-dismissed',
  THEME_PREFERENCE: 'theme-preference',
  USER_PREFERENCES: 'user-preferences',
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  MOBILE: 390, // iPhone 14 Pro
  TABLET: 768, // iPad
  DESKTOP: 1400, // Large desktop
} as const;
