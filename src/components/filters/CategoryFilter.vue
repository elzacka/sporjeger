<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { CategoryNode } from '@/types/category';

interface Props {
  categories: string[];
  modelValue: string[];
  categoryCounts?: Record<string, number>;
  categoryTree?: Map<string, CategoryNode>; // Hierarchical structure
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Track expanded categories
const expandedCategories = ref<Set<string>>(new Set());

// Get count for a category, default to 0
function getCategoryCount(category: string): number {
  return props.categoryCounts?.[category] || 0;
}

function toggleExpanded(categoryName: string) {
  if (expandedCategories.value.has(categoryName)) {
    expandedCategories.value.delete(categoryName);
  } else {
    expandedCategories.value.add(categoryName);
  }
}

function isExpanded(categoryName: string): boolean {
  return expandedCategories.value.has(categoryName);
}

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

// Sort category tree alphabetically (parent and children)
const sortedCategoryTree = computed(() => {
  if (!props.categoryTree) return null;

  // Convert Map to array, sort, and return as array of entries
  const sortedEntries = Array.from(props.categoryTree.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], 'nb-NO')
  );

  // Also sort children within each category
  return sortedEntries.map(([name, node]) => {
    const sortedChildren = node.children.size > 0
      ? Array.from(node.children.entries()).sort((a, b) =>
          a[0].localeCompare(b[0], 'nb-NO')
        )
      : [];

    return [name, { ...node, sortedChildren }] as const;
  });
});

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
        <!-- Use hierarchical tree if available, otherwise fall back to flat list -->
        <template v-if="sortedCategoryTree && sortedCategoryTree.length > 0">
          <template v-for="[categoryName, node] in sortedCategoryTree" :key="categoryName">
            <!-- Main category -->
            <button
              class="category-filter__option"
              :class="{ 'category-filter__option--active': isCategorySelected(categoryName) }"
              @click="toggleCategory(categoryName)"
            >
              <div class="category-filter__option-content">
                <span
                  v-if="node.children.size > 0"
                  class="category-filter__expand-icon"
                  @click.stop="toggleExpanded(categoryName)"
                >
                  {{ isExpanded(categoryName) ? '▼' : '▶' }}
                </span>
                <span class="category-filter__option-text">{{ categoryName }}</span>
              </div>
              <!-- Count only shown for parent categories without children (leaf categories at root level) -->
              <span v-if="node.children.size === 0" class="category-filter__count">
                {{ getCategoryCount(categoryName) }}
              </span>
            </button>

            <!-- Subcategories (shown when expanded) -->
            <template v-if="isExpanded(categoryName) && node.sortedChildren && node.sortedChildren.length > 0">
              <button
                v-for="[subName, subNode] in node.sortedChildren"
                :key="`${categoryName}-${subName}`"
                class="category-filter__option category-filter__option--sub"
                :class="{ 'category-filter__option--active': isCategorySelected(subName) }"
                @click="toggleCategory(subName)"
              >
                <span class="category-filter__option-text category-filter__option-text--sub">
                  {{ subName }}
                </span>
                <span class="category-filter__count">
                  {{ subNode.count }}
                </span>
              </button>
            </template>
          </template>
        </template>

        <!-- Fallback to flat list -->
        <template v-else>
          <button
            v-for="category in categories"
            :key="category"
            class="category-filter__option"
            :class="{ 'category-filter__option--active': isCategorySelected(category) }"
            @click="toggleCategory(category)"
          >
            <span class="category-filter__option-text">{{ category }}</span>
            <span class="category-filter__count">
              {{ getCategoryCount(category) }}
            </span>
          </button>
        </template>
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
  min-width: 250px;
  max-width: 400px;
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
  right: 0;
  min-width: 350px;
  max-width: min(500px, 90vw);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  max-height: min(500px, 70vh);
  display: flex;
  flex-direction: column;
  z-index: var(--z-dropdown);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
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
  justify-content: space-between;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  min-height: 44px;
  text-align: left;
  background: none;
  border: none;
  border-left: 3px solid transparent;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.category-filter__option--sub {
  padding-left: calc(var(--spacing-md) + var(--spacing-lg));
  background-color: rgba(0, 0, 0, 0.2);
  font-size: calc(var(--font-size-sm) * 0.95);
}

.category-filter__option-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  overflow: hidden;
}

.category-filter__expand-icon {
  font-size: 10px;
  color: var(--matrix-dim);
  width: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.category-filter__expand-icon:hover {
  color: var(--matrix-bright);
}

.category-filter__option-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.category-filter__option-text--sub {
  font-style: italic;
}

.category-filter__count {
  color: var(--text-dim);
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  min-width: 24px;
  text-align: center;
  font-weight: 500;
  flex-shrink: 0;
}

.category-filter__option:hover .category-filter__count,
.category-filter__option--active .category-filter__count {
  color: var(--matrix-bright);
}

.category-filter__option:hover {
  background-color: rgba(0, 255, 65, 0.05);
  color: var(--matrix-bright);
  border-left-color: var(--matrix-dim);
}

.category-filter__option:focus-visible {
  outline: none;
  background-color: rgba(0, 255, 65, 0.05);
  color: var(--matrix-bright);
  border-left-color: var(--matrix-dim);
}

.category-filter__option--active {
  color: var(--matrix-bright);
  background-color: rgba(0, 255, 65, 0.1);
  border-left-color: var(--matrix-bright);
  font-weight: 600;
}

.category-filter__option--active .category-filter__count {
  font-weight: 700;
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
