/**
 * Tool Helper Utilities
 * Business logic for tool card data processing
 * React 19.2 Best Practice: Extract business logic from components
 */

import { DIFFICULTY_LABELS } from '../constants';

export interface CostInfo {
  type: 'free' | 'gratis_med_kjop' | 'paid';
  displayText: string;
}

export interface DifficultyInfo {
  level: number;
  label: string;
}

/**
 * Parse and classify tool cost information
 */
export function parseCostInfo(kostnad: string | undefined): CostInfo {
  const kostnadLower = (kostnad || '').toLowerCase();
  const isGratis = kostnadLower.includes('gratis') ||
                  kostnadLower.includes('free') ||
                  kostnad === '';
  const isGratisMedKjop = kostnadLower.includes('gratis med kjøp');

  if (isGratisMedKjop) {
    return { type: 'gratis_med_kjop', displayText: 'Gratis m. kjøp' };
  }
  if (isGratis) {
    return { type: 'free', displayText: 'Gratis' };
  }
  return { type: 'paid', displayText: 'Betalt' };
}

/**
 * Extract hostname from URL safely
 */
export function extractHostname(url: string | undefined): string {
  if (!url || url.trim() === '') return '';
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Parse difficulty level and return structured info
 */
export function parseDifficultyInfo(vanskelighetsgrad: string | undefined): DifficultyInfo | null {
  if (!vanskelighetsgrad) return null;

  const level = parseInt(vanskelighetsgrad);
  if (isNaN(level) || level < 1 || level > 5) return null;

  return {
    level,
    label: DIFFICULTY_LABELS[level - 1]
  };
}

/**
 * Extract first language from language string
 */
export function extractFirstLanguage(språk: string | undefined): string {
  if (!språk) return '';
  return språk.split(' ')[0];
}
