<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  categories: string[];
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);
const buttonRef = ref<HTMLButtonElement | null>(null);

const displayText = computed(() => {
  return props.modelValue || 'Alle kategorier';
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectCategory(category: string) {
  emit('update:modelValue', category);
  isOpen.value = false;
}

function clearFilter() {
  emit('update:modelValue', '');
  isOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  if (buttonRef.value && !buttonRef.value.contains(target)) {
    isOpen.value = false;
  }
}

// Listen for outside clicks
if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside);
}
</script>

<template>
  <div class="category-filter">
    <button
      ref="buttonRef"
      class="category-filter__button anchor-element"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click.stop="toggleDropdown"
    >
      <span class="category-filter__label">{{ displayText }}</span>
      <span class="category-filter__icon" :class="{ 'category-filter__icon--open': isOpen }">
        ▼
      </span>
    </button>

    <div v-if="isOpen" class="category-filter__dropdown slide-down" role="listbox">
      <button
        class="category-filter__option"
        :class="{ 'category-filter__option--active': !modelValue }"
        role="option"
        :aria-selected="!modelValue"
        @click="clearFilter"
      >
        Alle kategorier
      </button>

      <button
        v-for="category in categories"
        :key="category"
        class="category-filter__option"
        :class="{ 'category-filter__option--active': modelValue === category }"
        role="option"
        :aria-selected="modelValue === category"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  position: relative;
}

.category-filter__button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
  min-width: 200px;
}

.category-filter__button:hover {
  border-color: var(--matrix-bright);
}

.category-filter__button:focus-visible {
  outline: none;
  border-color: var(--matrix-bright);
  box-shadow: 0 0 0 1px var(--matrix-bright);
}

.category-filter__label {
  flex: 1;
  text-align: left;
}

.category-filter__icon {
  transition: transform 0.2s ease;
  font-size: var(--font-size-sm);
  color: var(--matrix-medium);
}

.category-filter__icon--open {
  transform: rotate(180deg);
}

.category-filter__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  left: 0;
  right: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  max-height: min(400px, 60vh);
  overflow-y: auto;
  z-index: var(--z-dropdown);
}

/* WebKit 26.0: Use anchor positioning if supported */
@supports (anchor-name: --anchor) {
  .category-filter__button {
    anchor-name: --category-anchor;
  }

  .category-filter__dropdown {
    position: absolute;
    position-anchor: --category-anchor;
    position-area: bottom;
    margin-top: var(--spacing-xs);
  }
}

.category-filter__option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md) var(--spacing-md);
  min-height: 48px;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.category-filter__option:hover {
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

.category-filter__option:focus-visible {
  outline: none;
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

.category-filter__option--active {
  color: var(--matrix-bright);
  background-color: rgba(0, 255, 65, 0.15);
}

@media (max-width: 767px) {
  .category-filter__button {
    min-width: 150px;
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 390px) {
  .category-filter__dropdown {
    max-height: 50vh;
    left: -8px;
    right: -8px;
  }

  .category-filter__option {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
