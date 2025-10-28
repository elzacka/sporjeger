<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useToolsStore } from '@/stores/toolsStore';
import { useToolFilters } from '@/composables/useToolFilters';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import MainLayout from '@/components/layout/MainLayout.vue';
import ToolGrid from '@/components/tools/ToolGrid.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import CommandPalette from '@/components/search/CommandPalette.vue';
import GuideModal from '@/components/guide/GuideModal.vue';
import ExportMenu from '@/components/tools/ExportMenu.vue';
import KeyboardShortcutsModal from '@/components/ui/KeyboardShortcutsModal.vue';
import type { OSINTTool } from '@/types';

const toolsStore = useToolsStore();
const { tools, isLoading, categories, categoryCounts, categoryTree } = storeToRefs(toolsStore);

// Use filter composable (now includes searchQuery)
const { searchQuery, selectedCategory, filteredTools } = useToolFilters(tools);

// Command palette state
const isCommandPaletteOpen = ref(false);

// Guide modal state
const isGuideModalOpen = ref(false);
const selectedTool = ref<OSINTTool | null>(null);

// Keyboard shortcuts modal state
const isShortcutsModalOpen = ref(false);

// Keyboard shortcuts
useKeyboardShortcuts({
  onCmdK: () => {
    isCommandPaletteOpen.value = true;
  },
  onEscape: () => {
    isCommandPaletteOpen.value = false;
    isGuideModalOpen.value = false;
    isShortcutsModalOpen.value = false;
  },
  onQuestionMark: () => {
    isShortcutsModalOpen.value = true;
  },
});

onMounted(() => {
  toolsStore.fetchTools();
});

function openToolInNewTab(tool: OSINTTool) {
  window.open(tool.url, '_blank', 'noopener,noreferrer');
}

function openGuide(tool: OSINTTool) {
  selectedTool.value = tool;
  isGuideModalOpen.value = true;
}

function closeGuide() {
  isGuideModalOpen.value = false;
  selectedTool.value = null;
}
</script>

<template>
  <MainLayout
    :search-query="searchQuery"
    :categories="categories"
    :category-counts="categoryCounts"
    :category-tree="categoryTree"
    :selected-category="selectedCategory"
    @update:search-query="searchQuery = $event"
    @update:selected-category="selectedCategory = $event"
    @open-command-palette="isCommandPaletteOpen = true"
  >
    <div class="home-view">
      <!-- Export Menu - shown when tools are available -->
      <div v-if="!isLoading && filteredTools.length > 0" class="home-view__header">
        <ExportMenu :tools="filteredTools" />
      </div>

      <LoadingSpinner v-if="isLoading" size="large" />
      <div v-else-if="filteredTools.length === 0" class="home-empty">
        <span class="material-symbols-outlined home-empty__icon">search_off</span>
        <p class="home-empty__message">Ingen verktøy funnet for gjeldende filter.</p>
        <button class="home-empty__button" @click="selectedCategory = []; searchQuery = ''">
          Tilbakestill filter
        </button>
      </div>
      <ToolGrid v-else :tools="filteredTools" @open-guide="openGuide" />
    </div>

    <!-- Command Palette -->
    <CommandPalette
      :tools="tools"
      :is-open="isCommandPaletteOpen"
      @close="isCommandPaletteOpen = false"
      @select="openToolInNewTab"
    />

    <!-- Guide Modal -->
    <GuideModal
      v-if="selectedTool"
      :is-open="isGuideModalOpen"
      :tool-name="selectedTool.navn"
      :guide-content="selectedTool.veiledning"
      :tool-url="selectedTool.url"
      @close="closeGuide"
    />

    <!-- Keyboard Shortcuts Modal -->
    <KeyboardShortcutsModal :is-open="isShortcutsModalOpen" @close="isShortcutsModalOpen = false" />
  </MainLayout>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.home-view__header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.home-empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  min-height: 300px;
  justify-content: center;
}

.home-empty__icon {
  font-size: 64px;
  color: var(--matrix-medium);
  opacity: 0.5;
  /* Hide fallback text while icon font loads */
  text-indent: -9999px;
  overflow: hidden;
  width: 64px;
  height: 64px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Show icon after font loads */
.home-empty__icon::before {
  text-indent: 0;
  float: left;
}

.home-empty__title {
  font-size: var(--font-size-xl);
  color: var(--matrix-bright);
  margin: 0;
  font-weight: 600;
}

.home-empty__message {
  margin: 0;
  font-size: var(--font-size-base);
}

.home-empty__shortcuts {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.home-empty__shortcuts kbd {
  padding: 4px 8px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  color: var(--matrix-medium);
}

.home-empty__divider {
  color: var(--text-dim);
}

.home-empty__button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--matrix-medium);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
}

.home-empty__button:hover {
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

.home-empty__button:focus-visible {
  outline: none;
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}
</style>
