import { useMemo } from 'react';
import type { OSINTTool, FilterState } from '../types';

/**
 * Custom hook for filtering OSINT tools based on multiple criteria
 *
 * Extracts filter logic from App.tsx to improve maintainability.
 * Handles filtering by:
 * - Category
 * - Search query (name, description, category, language, guide)
 *
 * @param tools - Array of all OSINT tools
 * @param filters - Current filter state
 * @returns Filtered array of tools matching all active filters
 *
 * @example
 * ```tsx
 * const filteredTools = useToolFilters(tools, filters);
 * ```
 */
export function useToolFilters(
  tools: OSINTTool[],
  filters: FilterState
): OSINTTool[] {
  return useMemo(() => tools.filter(tool => {
    // Category filter - if categories are selected, tool must match one of them
    if (filters.categories.length > 0 && !filters.categories.includes(tool.kategori)) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        tool.navn.toLowerCase().includes(query) ||
        tool.beskrivelse.toLowerCase().includes(query) ||
        tool.kategori.toLowerCase().includes(query) ||
        (tool.språk && tool.språk.toLowerCase().includes(query)) ||
        (tool.veiledning && tool.veiledning.toLowerCase().includes(query))
      );
    }

    return true;
  }), [tools, filters]);
}
