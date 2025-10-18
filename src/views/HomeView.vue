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
import type { OSINTTool } from '@/types';

const toolsStore = useToolsStore();
const { tools, isLoading, categories } = storeToRefs(toolsStore);

// Use filter composable
const { selectedCategory, filteredTools } = useToolFilters(tools);

// Command palette state
const isCommandPaletteOpen = ref(false);

// Guide modal state
const isGuideModalOpen = ref(false);
const selectedTool = ref<OSINTTool | null>(null);

// Keyboard shortcuts
useKeyboardShortcuts({
  onCmdK: () => {
    isCommandPaletteOpen.value = true;
  },
  onEscape: () => {
    isCommandPaletteOpen.value = false;
    isGuideModalOpen.value = false;
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
    :categories="categories"
    :selected-category="selectedCategory"
    @update:selected-category="selectedCategory = $event"
    @open-command-palette="isCommandPaletteOpen = true"
  >
    <div class="home-view">
      <LoadingSpinner v-if="isLoading" size="large" />
      <div v-else-if="filteredTools.length === 0" class="home-empty">
        <p>Ingen verktøy funnet for gjeldende filter.</p>
        <button class="home-empty__button" @click="selectedCategory = ''">
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
      @close="closeGuide"
    />
  </MainLayout>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.home-empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--text-dim);
}

.home-empty p {
  margin-bottom: var(--spacing-lg);
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
