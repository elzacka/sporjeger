<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

interface Props {
  categories: string[];
  modelValue: string[];
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isOpen = ref(false);
const buttonRef = ref<HTMLButtonElement | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);

const displayText = computed(() => {
  if (!props.modelValue || props.modelValue.length === 0) {
    return 'Alle kategorier';
  }
  if (props.modelValue.length === 1) {
    return props.modelValue[0];
  }
  return `${props.modelValue.length} kategorier valgt`;
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function toggleCategory(category: string) {
  const currentValues = [...props.modelValue];
  const index = currentValues.indexOf(category);

  if (index > -1) {
    // Remove category if already selected
    currentValues.splice(index, 1);
  } else {
    // Add category if not selected
    currentValues.push(category);
  }

  emit('update:modelValue', currentValues);
  // Keep dropdown open after selecting
}

function clearFilter() {
  emit('update:modelValue', []);
  // Keep dropdown open after clearing
}

function isCategorySelected(category: string): boolean {
  return props.modelValue.includes(category);
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const clickedButton = buttonRef.value && buttonRef.value.contains(target);
  const clickedDropdown = dropdownRef.value && dropdownRef.value.contains(target);

  if (!clickedButton && !clickedDropdown) {
    isOpen.value = false;
  }
}

// Add event listener on mount, clean up on unmount
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
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

    <div v-if="isOpen" ref="dropdownRef" class="category-filter__dropdown slide-down" role="listbox">
      <!-- Mobile close button -->
      <div class="category-filter__dropdown-header">
        <span class="category-filter__dropdown-title">Velg kategorier</span>
        <button
          class="category-filter__close"
          aria-label="Lukk"
          @click="isOpen = false"
        >
          ✕
        </button>
      </div>

      <div class="category-filter__options">
        <button
          v-for="category in categories"
          :key="category"
          class="category-filter__option"
          :class="{ 'category-filter__option--active': isCategorySelected(category) }"
          role="option"
          :aria-selected="isCategorySelected(category)"
          @click="toggleCategory(category)"
        >
          <span class="category-filter__checkbox">
            <span v-if="isCategorySelected(category)" class="category-filter__checkmark">✓</span>
          </span>
          <span class="category-filter__option-text">{{ category }}</span>
        </button>
      </div>

      <!-- Reset filter button - always visible at bottom -->
      <button
        v-if="modelValue && modelValue.length > 0"
        class="category-filter__reset"
        @click="clearFilter"
      >
        Tilbakestill filter ({{ modelValue.length }})
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
  display: flex;
  flex-direction: column;
  z-index: var(--z-dropdown);
}

.category-filter__dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-primary);
  /* Hidden on desktop, shown on mobile */
  display: none;
}

.category-filter__dropdown-title {
  color: var(--matrix-bright);
  font-size: var(--font-size-base);
  font-weight: 700;
}

.category-filter__close {
  color: var(--matrix-medium);
  font-size: var(--font-size-2xl);
  line-height: 1;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.category-filter__close:hover {
  color: var(--matrix-bright);
}

.category-filter__options {
  flex: 1;
  overflow-y: auto;
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
  gap: var(--spacing-sm);
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

.category-filter__checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--matrix-dim);
  background-color: var(--bg-primary);
  flex-shrink: 0;
}

.category-filter__checkmark {
  color: var(--matrix-bright);
  font-size: var(--font-size-base);
  font-weight: 700;
  line-height: 1;
}

.category-filter__option-text {
  flex: 1;
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

.category-filter__reset {
  display: block;
  width: 100%;
  padding: var(--spacing-md);
  min-height: 48px;
  text-align: center;
  background-color: var(--matrix-dim);
  border: none;
  border-top: 2px solid var(--border-color);
  color: var(--bg-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  font-weight: 700;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
  flex-shrink: 0;
}

.category-filter__reset:hover {
  background-color: var(--matrix-medium);
  color: var(--bg-primary);
}

.category-filter__reset:focus-visible {
  outline: none;
  background-color: var(--matrix-bright);
  color: var(--bg-primary);
}

@media (max-width: 767px) {
  .category-filter__button {
    min-width: 150px;
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 767px) {
  .category-filter__dropdown-header {
    display: flex;
  }

  .category-filter__dropdown {
    /* On mobile, make dropdown more prominent */
    position: fixed;
    top: auto;
    left: var(--spacing-md);
    right: var(--spacing-md);
    bottom: var(--spacing-md);
    max-height: 70vh;
    border: 2px solid var(--matrix-bright);
    box-shadow: 0 0 20px var(--matrix-green-bright);
  }

  .category-filter__close {
    min-width: 48px;
    min-height: 48px;
    font-size: calc(var(--font-size-2xl) * 1.2);
  }
}

@media (max-width: 390px) {
  .category-filter__dropdown {
    left: var(--spacing-sm);
    right: var(--spacing-sm);
    bottom: var(--spacing-sm);
  }

  .category-filter__option {
    padding: var(--spacing-md);
  }
}
</style>
