<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string;
  placeholder?: string;
  showCommandKHint?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'openCommandPalette'): void;
}

withDefaults(defineProps<Props>(), {
  placeholder: 'SØK...',
  showCommandKHint: true,
});

const emit = defineEmits<Emits>();

const inputRef = ref<HTMLInputElement | null>(null);

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function clearSearch() {
  emit('update:modelValue', '');
  inputRef.value?.focus();
}

function openCommandPalette() {
  emit('openCommandPalette');
}
</script>

<template>
  <div class="search-bar">
    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      class="search-bar__input"
      aria-label="Søk etter OSINT-verktøy"
      @input="handleInput"
    />
    <button
      v-if="modelValue"
      class="search-bar__clear"
      aria-label="Tøm søk"
      @click="clearSearch"
    >
      ✕
    </button>
    <button
      v-if="showCommandKHint"
      class="search-bar__cmd-k"
      aria-label="Åpne hurtigsøk (⌘K)"
      title="Åpne hurtigsøk"
      @click="openCommandPalette"
    >
      <kbd>⌘</kbd><kbd>K</kbd>
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: border-color 0.2s ease;
  max-width: 600px;
  width: 100%;
}

.search-bar:focus-within {
  border-color: var(--matrix-bright);
}

.search-bar__input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  outline: none;
  min-width: 0;
}

.search-bar__input::placeholder {
  color: var(--text-dim);
}

.search-bar__clear {
  color: var(--matrix-medium);
  font-size: var(--font-size-lg);
  padding: 0 var(--spacing-xs);
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.search-bar__clear:hover {
  color: var(--matrix-bright);
}

.search-bar__clear:focus-visible {
  outline: none;
  color: var(--matrix-bright);
}

.search-bar__cmd-k {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 var(--spacing-xs);
  background: none;
  border: none;
  color: var(--text-dim);
  font-family: 'JetBrains Mono', monospace;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.search-bar__cmd-k:hover {
  color: var(--matrix-bright);
}

.search-bar__cmd-k:focus-visible {
  outline: none;
  color: var(--matrix-bright);
}

.search-bar__cmd-k kbd {
  display: inline-block;
  padding: 2px 4px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-xs);
  color: var(--matrix-medium);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.search-bar__cmd-k:hover kbd {
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
}

@media (max-width: 767px) {
  .search-bar {
    max-width: 100%;
  }

  .search-bar__cmd-k {
    display: none;
  }
}
</style>
