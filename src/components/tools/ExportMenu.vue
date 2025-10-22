<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { OSINTTool } from '@/types';
import { useExport } from '@/composables/useExport';

interface Props {
  tools: OSINTTool[];
}

const props = defineProps<Props>();

const isOpen = ref(false);
const buttonRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLDivElement | null>(null);

const { exportToJSON, exportToCSV, exportToMarkdown } = useExport();

function toggleMenu() {
  isOpen.value = !isOpen.value;
}

function handleExportJSON() {
  exportToJSON(props.tools);
  isOpen.value = false;
}

function handleExportCSV() {
  exportToCSV(props.tools);
  isOpen.value = false;
}

function handleExportMarkdown() {
  exportToMarkdown(props.tools);
  isOpen.value = false;
}

// Close menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const clickedButton = buttonRef.value && buttonRef.value.contains(target);
  const clickedMenu = menuRef.value && menuRef.value.contains(target);

  if (!clickedButton && !clickedMenu) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="export-menu">
    <button
      ref="buttonRef"
      class="export-menu__button"
      :aria-expanded="isOpen"
      aria-label="Eksporter verktøy"
      title="Eksporter verktøy"
      @click.stop="toggleMenu"
    >
      <span class="material-symbols-outlined">download</span>
      <span class="export-menu__label">Eksporter</span>
    </button>

    <div v-if="isOpen" ref="menuRef" class="export-menu__dropdown slide-down">
      <button class="export-menu__option" @click="handleExportJSON">
        <span class="material-symbols-outlined">code</span>
        <span>JSON</span>
      </button>
      <button class="export-menu__option" @click="handleExportCSV">
        <span class="material-symbols-outlined">table_chart</span>
        <span>CSV</span>
      </button>
      <button class="export-menu__option" @click="handleExportMarkdown">
        <span class="material-symbols-outlined">description</span>
        <span>Markdown</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.export-menu {
  position: relative;
}

.export-menu__button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 40px;
}

.export-menu__button .material-symbols-outlined {
  font-size: var(--font-size-lg);
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 20;
}

.export-menu__button:hover {
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
}

.export-menu__button:focus-visible {
  outline: none;
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
  box-shadow: 0 0 0 1px var(--matrix-bright);
}

.export-menu__label {
  font-weight: 500;
}

.export-menu__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  right: 0;
  min-width: 150px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  z-index: var(--z-dropdown);
  display: flex;
  flex-direction: column;
}

.export-menu__option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
  min-height: 44px;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.export-menu__option .material-symbols-outlined {
  font-size: var(--font-size-lg);
  font-variation-settings: 'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 20;
}

.export-menu__option:hover {
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

.export-menu__option:focus-visible {
  outline: none;
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

.export-menu__option:not(:last-child) {
  border-bottom: 1px solid var(--border-color);
}

@media (max-width: 767px) {
  .export-menu__label {
    display: none;
  }

  .export-menu__button {
    padding: var(--spacing-sm);
    min-width: 44px;
  }

  .export-menu__dropdown {
    right: auto;
    left: 0;
  }
}
</style>
