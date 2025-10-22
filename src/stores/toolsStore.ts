import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { OSINTTool } from '@/types';
import type { CategoryNode } from '@/types/category';
import { dummyTools } from '@/data/dummyTools';
import staticTools from '@/data/tools.json';
import {
  fetchToolsFromGoogleSheets,
  isGoogleSheetsConfigured,
} from '@/services/googleSheetsService';

export const useToolsStore = defineStore('tools', () => {
  // State
  const tools = ref<OSINTTool[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isUsingDummyData = ref(true);
  const lastFetchTime = ref<Date | null>(null);

  // Getters
  const toolCount = computed(() => tools.value.length);
  const categories = computed(() => {
    return [...new Set(tools.value.map((t) => t.kategori))].sort();
  });

  // Category counts for showing tool count per category
  const categoryCounts = computed(() => {
    const counts: Record<string, number> = {};
    tools.value.forEach((tool) => {
      counts[tool.kategori] = (counts[tool.kategori] || 0) + 1;
    });
    return counts;
  });

  // Hierarchical category structure based on categoryPath

  const categoryTree = computed(() => {
    const root = new Map<string, CategoryNode>();

    tools.value.forEach((tool) => {
      if (!tool.categoryPath || tool.categoryPath.length === 0) {
        // No hierarchy, add to main category
        const mainCat = tool.kategori;
        if (!root.has(mainCat)) {
          root.set(mainCat, { name: mainCat, count: 0, children: new Map() });
        }
        root.get(mainCat)!.count++;
      } else {
        // Build hierarchy from categoryPath
        const path = tool.categoryPath;
        let current = root;

        path.forEach((categoryName, index) => {
          if (!current.has(categoryName)) {
            current.set(categoryName, {
              name: categoryName,
              count: 0,
              children: new Map(),
            });
          }

          const node = current.get(categoryName)!;

          // Increment count at leaf level only
          if (index === path.length - 1) {
            node.count++;
          }

          current = node.children;
        });
      }
    });

    return root;
  });

  // Actions

  /**
   * Loads dummy data (for development/fallback)
   */
  function loadDummyData() {
    tools.value = dummyTools;
    isUsingDummyData.value = true;
    error.value = null;
  }

  /**
   * Loads static tools from pre-built JSON
   */
  function loadStaticTools() {
    if (staticTools && staticTools.length > 0) {
      tools.value = staticTools as OSINTTool[];
      isUsingDummyData.value = false;
      console.log(`📦 Lastet ${staticTools.length} verktøy fra statisk JSON`);
      return true;
    }
    return false;
  }

  /**
   * Fetches tools with priority: static JSON → Google Sheets API → dummy data
   * Static JSON is loaded immediately for fast initial render
   * Google Sheets API is called in background to get latest data
   */
  async function fetchTools() {
    // 1. Try loading from static JSON first (instant)
    const hasStaticTools = loadStaticTools();

    // 2. If no static tools and Google Sheets is not configured, use dummy data
    if (!hasStaticTools && !isGoogleSheetsConfigured()) {
      console.info('ℹ️ Google Sheets ikke konfigurert, bruker dummy data');
      loadDummyData();
      return;
    }

    // 3. Try fetching from Google Sheets API (in background if static tools exist)
    if (isGoogleSheetsConfigured()) {
      isLoading.value = !hasStaticTools; // Don't show loading if we have static tools

      error.value = null;

      try {
        const fetchedTools = await fetchToolsFromGoogleSheets();
        tools.value = fetchedTools;
        isUsingDummyData.value = false;
        lastFetchTime.value = new Date();
        console.log(`✅ Lastet ${fetchedTools.length} verktøy fra Google Sheets (fresh data)`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
        error.value = errorMessage;
        console.error('❌ Feil ved henting av data fra Google Sheets:', errorMessage);

        // Fallback to dummy data only if no static tools
        if (!hasStaticTools) {
          console.info('ℹ️ Faller tilbake til dummy data');
          loadDummyData();
        } else {
          console.info('ℹ️ Fortsetter med statisk data');
        }
      } finally {
        isLoading.value = false;
      }
    }
  }

  /**
   * Retries fetching data from Google Sheets
   */
  async function retryFetch() {
    error.value = null;
    await fetchTools();
  }

  /**
   * Clears error state
   */
  function clearError() {
    error.value = null;
  }

  return {
    tools,
    isLoading,
    error,
    isUsingDummyData,
    lastFetchTime,
    toolCount,
    categories,
    categoryCounts,
    categoryTree,
    loadDummyData,
    fetchTools,
    retryFetch,
    clearError,
  };
});
