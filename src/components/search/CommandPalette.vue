<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { OSINTTool } from '@/types';
import { useFocusTrap } from '@/composables/useFocusTrap';

interface Props {
  tools: OSINTTool[];
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'select', tool: OSINTTool): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = ref('');
const selectedIndex = ref(0);
const modalRef = ref<HTMLElement | null>(null);

// Use focus trap for accessibility
useFocusTrap(modalRef);

// Filter tools based on search query
const filteredTools = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.tools;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return props.tools.filter(
    (tool) =>
      tool.navn.toLowerCase().includes(query) ||
      tool.beskrivelse.toLowerCase().includes(query) ||
      tool.kategori.toLowerCase().includes(query)
  );
});

// Reset search and selection when modal opens/closes
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      searchQuery.value = '';
      selectedIndex.value = 0;
    }
  }
);

// Keyboard navigation
function handleArrowUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
}

function handleArrowDown() {
  if (selectedIndex.value < filteredTools.value.length - 1) {
    selectedIndex.value++;
  }
}

function handleEnter() {
  const selectedTool = filteredTools.value[selectedIndex.value];
  if (selectedTool) {
    emit('select', selectedTool);
    emit('close');
  }
}

function handleEscape() {
  emit('close');
}

function selectTool(tool: OSINTTool) {
  emit('select', tool);
  emit('close');
}

// Handle keyboard shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    handleArrowUp();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    handleArrowDown();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    handleEnter();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    handleEscape();
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="command-palette-backdrop" @click="emit('close')">
      <div
        ref="modalRef"
        class="command-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Quick tool search"
        @click.stop
        @keydown="handleKeydown"
      >
        <div class="command-palette__header">
          <span class="command-palette__prompt">&gt;</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Søk etter verktøy..."
            class="command-palette__input"
            aria-label="Søk etter OSINT-verktøy"
            autofocus
          />
        </div>

        <div class="command-palette__results">
          <div v-if="filteredTools.length === 0" class="command-palette__empty">
            Ingen verktøy funnet
          </div>

          <button
            v-for="(tool, index) in filteredTools"
            :key="tool.navn"
            class="command-palette__item"
            :class="{ 'command-palette__item--selected': index === selectedIndex }"
            @click="selectTool(tool)"
            @mouseenter="selectedIndex = index"
          >
            <div class="command-palette__item-header">
              <span class="command-palette__item-title">{{ tool.navn }}</span>
              <span class="command-palette__item-category">{{ tool.kategori }}</span>
            </div>
            <p class="command-palette__item-description">{{ tool.beskrivelse }}</p>
          </button>
        </div>

        <div class="command-palette__footer">
          <span class="command-palette__hint">
            <kbd>↑</kbd> <kbd>↓</kbd> navigere · <kbd>↵</kbd> åpne · <kbd>ESC</kbd> lukke
          </span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.command-palette-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  overflow-y: auto;
}

.command-palette {
  background-color: var(--bg-primary);
  border: 2px solid var(--matrix-bright);
  box-shadow: 0 0 30px var(--matrix-green-bright);
  width: 100%;
  max-width: 640px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  margin-top: 10vh;
}

.command-palette__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.command-palette__prompt {
  color: var(--matrix-medium);
  font-weight: 700;
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.command-palette__input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  outline: none;
}

.command-palette__input::placeholder {
  color: var(--text-dim);
}

.command-palette__results {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-xs);
}

.command-palette__empty {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--text-dim);
}

.command-palette__item {
  display: block;
  width: 100%;
  padding: var(--spacing-md);
  min-height: 48px;
  text-align: left;
  background: none;
  border: 1px solid transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.command-palette__item:hover,
.command-palette__item--selected {
  background-color: rgba(0, 255, 65, 0.1);
  border-color: var(--matrix-dim);
}

.command-palette__item:focus-visible {
  outline: none;
  background-color: rgba(0, 255, 65, 0.1);
  border-color: var(--matrix-dim);
}

.command-palette__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.command-palette__item-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--matrix-bright);
}

.command-palette__item-category {
  font-size: var(--font-size-xs);
  color: var(--matrix-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.command-palette__item-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.4;
}

.command-palette__footer {
  padding: var(--spacing-sm) var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.command-palette__hint {
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.command-palette__hint kbd {
  display: inline-block;
  padding: 2px 6px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-xs);
  color: var(--matrix-medium);
}

@media (max-width: 767px) {
  .command-palette {
    margin-top: 5vh;
    max-height: 90vh;
  }

  .command-palette__hint {
    display: none;
  }
}

@media (max-width: 390px) {
  .command-palette-backdrop {
    padding: var(--spacing-md);
  }

  .command-palette {
    margin-top: max(3vh, env(safe-area-inset-top));
    max-width: 100%;
    max-height: 85vh;
  }

  .command-palette__item {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
