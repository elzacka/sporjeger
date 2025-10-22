<script setup lang="ts">
import BaseModal from './BaseModal.vue';

interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function close() {
  emit('close');
}

const shortcuts = [
  {
    category: 'Navigasjon',
    items: [
      { keys: ['Cmd', 'K'], description: 'Åpne kommandopalett (Mac)' },
      { keys: ['Ctrl', 'K'], description: 'Åpne kommandopalett (Windows/Linux)' },
      { keys: ['Esc'], description: 'Lukk modaler og menyer' },
      { keys: ['?'], description: 'Vis denne listen' },
    ],
  },
  {
    category: 'Kommandopalett',
    items: [
      { keys: ['↑'], description: 'Gå opp i listen' },
      { keys: ['↓'], description: 'Gå ned i listen' },
      { keys: ['Enter'], description: 'Velg markert verktøy' },
      { keys: ['Esc'], description: 'Lukk kommandopalett' },
    ],
  },
  {
    category: 'Generelt',
    items: [
      { keys: ['Tab'], description: 'Naviger mellom elementer' },
      { keys: ['Shift', 'Tab'], description: 'Naviger bakover' },
    ],
  },
];
</script>

<template>
  <BaseModal :is-open="isOpen" title="Tastatursnarveier" @close="close">
    <div class="shortcuts">
      <div v-for="section in shortcuts" :key="section.category" class="shortcuts__section">
        <h3 class="shortcuts__category">{{ section.category }}</h3>
        <div class="shortcuts__list">
          <div v-for="shortcut in section.items" :key="shortcut.description" class="shortcut">
            <div class="shortcut__keys">
              <kbd v-for="key in shortcut.keys" :key="key" class="shortcut__key">
                {{ key }}
              </kbd>
            </div>
            <span class="shortcut__description">{{ shortcut.description }}</span>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.shortcuts {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.shortcuts__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.shortcuts__category {
  font-size: var(--font-size-lg);
  color: var(--matrix-bright);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-xs);
}

.shortcuts__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.shortcut {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
}

.shortcut__keys {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
}

.shortcut__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-bottom: 2px solid var(--matrix-dim);
  color: var(--matrix-medium);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-align: center;
  line-height: 1;
}

.shortcut__description {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  flex: 1;
  text-align: right;
}

@media (max-width: 767px) {
  .shortcut {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .shortcut__description {
    text-align: left;
  }
}
</style>
