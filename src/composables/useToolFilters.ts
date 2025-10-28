import { computed, ref, type Ref } from 'vue';
import type { OSINTTool } from '@/types';

export function useToolFilters(tools: Ref<OSINTTool[]>) {
  const searchQuery = ref('');
  const selectedCategory = ref<string[]>([]);

  /**
   * Parse search query for operators
   * Supports: category:value, tag:value, platform:value, type:value
   */
  function parseSearchOperators(query: string): {
    text: string[];
    category?: string;
    tag?: string;
    platform?: string;
    type?: string;
  } {
    const parts = query.split(/\s+/);
    const operators: Record<string, string> = {};
    const textParts: string[] = [];

    parts.forEach((part) => {
      const colonIndex = part.indexOf(':');
      if (colonIndex > 0) {
        const operator = part.slice(0, colonIndex).toLowerCase();
        const value = part.slice(colonIndex + 1).toLowerCase();

        if (['category', 'tag', 'platform', 'type'].includes(operator)) {
          operators[operator] = value;
        } else {
          textParts.push(part);
        }
      } else {
        textParts.push(part);
      }
    });

    return {
      text: textParts,
      category: operators.category,
      tag: operators.tag,
      platform: operators.platform,
      type: operators.type,
    };
  }

  /**
   * Calculate fuzzy match score (0-1, higher is better)
   * Simple implementation: checks if all query characters appear in order
   */
  function fuzzyMatch(text: string, query: string): number {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    // Exact match gets highest score
    if (textLower === queryLower) return 1;

    // Contains match gets high score
    if (textLower.includes(queryLower)) return 0.8;

    // Fuzzy match: all characters in order
    let queryIndex = 0;
    for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
      if (textLower[i] === queryLower[queryIndex]) {
        queryIndex++;
      }
    }

    if (queryIndex === queryLower.length) {
      // Calculate score based on how close characters are
      return 0.5;
    }

    return 0;
  }

  // Check if any filters are active
  const hasActiveFilters = computed(() => {
    return (
      searchQuery.value.trim().length > 0 ||
      (selectedCategory.value && selectedCategory.value.length > 0)
    );
  });

  // Filter tools based on search query and category
  const filteredTools = computed(() => {
    // Show all tools if no filters active
    if (!hasActiveFilters.value) {
      return tools.value;
    }

    let result = tools.value;

    // Filter by categories (multiselect)
    // Check both kategori field and categoryPath array to support hierarchical filtering
    if (selectedCategory.value && selectedCategory.value.length > 0) {
      result = result.filter((tool) => {
        // Check if the tool's main category matches
        if (selectedCategory.value.includes(tool.kategori)) {
          return true;
        }
        // Check if any selected category is in the tool's category path (parent categories)
        if (tool.categoryPath) {
          return tool.categoryPath.some((cat) => selectedCategory.value.includes(cat));
        }
        return false;
      });
    }

    // Filter by search query with operators and fuzzy matching
    if (searchQuery.value.trim()) {
      const queryLower = searchQuery.value.toLowerCase().trim();
      const parsed = parseSearchOperators(queryLower);

      result = result.filter((tool) => {
        // Apply operator filters
        if (parsed.category && !tool.kategori.toLowerCase().includes(parsed.category)) {
          return false;
        }

        if (parsed.platform && tool.platform && !tool.platform.toLowerCase().includes(parsed.platform)) {
          return false;
        }

        if (parsed.type && tool.toolType && !tool.toolType.toLowerCase().includes(parsed.type)) {
          return false;
        }

        if (parsed.tag && tool.tags) {
          const hasTag = tool.tags.some((tag) => tag.toLowerCase().includes(parsed.tag!));
          if (!hasTag) return false;
        }

        // Text search with fuzzy matching
        if (parsed.text.length > 0) {
          const textQuery = parsed.text.join(' ');
          const nameScore = fuzzyMatch(tool.navn, textQuery);
          const descScore = fuzzyMatch(tool.beskrivelse, textQuery);
          const tagScore = tool.tags
            ? Math.max(...tool.tags.map((tag) => fuzzyMatch(tag, textQuery)))
            : 0;

          // Must match in at least one field
          return nameScore > 0 || descScore > 0 || tagScore > 0;
        }

        return true;
      });
    }

    return result;
  });

  function clearFilters() {
    searchQuery.value = '';
    selectedCategory.value = [];
  }

  return {
    searchQuery,
    selectedCategory,
    filteredTools,
    hasActiveFilters,
    clearFilters,
  };
}
