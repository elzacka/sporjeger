import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { OSINTTool } from '@/types';
import { dummyTools } from '@/data/dummyTools';
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
   * Fetches tools from Google Sheets API
   * Falls back to dummy data if API is not configured or fails
   */
  async function fetchTools() {
    // Check if Google Sheets is configured
    if (!isGoogleSheetsConfigured()) {
      console.info('ℹ️ Google Sheets ikke konfigurert, bruker dummy data');
      loadDummyData();
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const fetchedTools = await fetchToolsFromGoogleSheets();
      tools.value = fetchedTools;
      isUsingDummyData.value = false;
      lastFetchTime.value = new Date();
      console.log(`✅ Lastet ${fetchedTools.length} verktøy fra Google Sheets`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ukjent feil';
      error.value = errorMessage;
      console.error('❌ Feil ved henting av data fra Google Sheets:', errorMessage);

      // Fallback to dummy data
      console.info('ℹ️ Faller tilbake til dummy data');
      loadDummyData();
    } finally {
      isLoading.value = false;
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
    loadDummyData,
    fetchTools,
    retryFetch,
    clearError,
  };
});
