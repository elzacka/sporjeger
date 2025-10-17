/**
 * Application Constants
 * Centralized constants for maintainability
 * React 19.2 Best Practice: Single source of truth for configuration
 */

/**
 * Difficulty level labels in Norwegian
 */
export const DIFFICULTY_LABELS = [
  'Veldig enkel',
  'Enkel',
  'Middels',
  'Avansert',
  'Ekspert'
] as const;

/**
 * Maximum number of search results to display in command palette
 */
export const MAX_SEARCH_RESULTS = 8;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: ['Meta+k', 'Control+k'],
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
} as const;

/**
 * Accessibility
 */
export const A11Y = {
  MIN_TOUCH_TARGET: 44, // WCAG 2.1 Level AA minimum (px)
  RECOMMENDED_TOUCH_TARGET: 48, // Apple/Material Design recommendation (px)
  FOCUS_OUTLINE_WIDTH: 2, // px
} as const;

/**
 * Animation timings (ms)
 */
export const ANIMATIONS = {
  HIGHLIGHT_DURATION: 2000,
  MODAL_TRANSITION: 200,
  TOAST_DURATION: 3000,
} as const;

/**
 * Breakpoints (px) - aligned with CSS media queries
 */
export const BREAKPOINTS = {
  MOBILE_SMALL: 428, // iPhone 6.1-inch and similar
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1400,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3,
} as const;

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  INSTALL_PROMPT_DISMISS_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  INSTALL_PROMPT_DELAY: 30000, // 30 seconds
  SERVICE_WORKER_UPDATE_INTERVAL: 60 * 60 * 1000, // 1 hour
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  INSTALL_PROMPT_DISMISSED: 'install-prompt-dismissed',
  THEME_PREFERENCE: 'theme-preference',
  USER_PREFERENCES: 'user-preferences',
} as const;
