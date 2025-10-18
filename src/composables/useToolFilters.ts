import { computed, ref, type Ref } from 'vue';
import type { OSINTTool } from '@/types';

export function useToolFilters(tools: Ref<OSINTTool[]>) {
  const searchQuery = ref('');
  const selectedCategory = ref<string>('');

  // Filter tools based on search query and category
  const filteredTools = computed(() => {
    let result = tools.value;

    // Filter by category
    if (selectedCategory.value) {
      result = result.filter((tool) => tool.kategori === selectedCategory.value);
    }

    // Filter by search query (searches name and description)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (tool) =>
          tool.navn.toLowerCase().includes(query) ||
          tool.beskrivelse.toLowerCase().includes(query)
      );
    }

    return result;
  });

  function clearFilters() {
    searchQuery.value = '';
    selectedCategory.value = '';
  }

  return {
    searchQuery,
    selectedCategory,
    filteredTools,
    clearFilters,
  };
}
