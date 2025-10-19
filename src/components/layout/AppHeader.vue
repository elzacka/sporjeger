<script setup lang="ts">
import MatrixLogo from '@/components/ui/MatrixLogo.vue';
import SearchBar from '@/components/search/SearchBar.vue';
import CategoryFilter from '@/components/filters/CategoryFilter.vue';
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue';

interface Props {
  searchQuery?: string;
  categories?: string[];
  selectedCategory?: string[];
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:selectedCategory', value: string[]): void;
  (e: 'openCommandPalette'): void;
}

withDefaults(defineProps<Props>(), {
  categories: () => [],
  selectedCategory: () => [],
});

const emit = defineEmits<Emits>();

function updateSearch(value: string) {
  emit('update:searchQuery', value);
}

function updateCategory(value: string[]) {
  emit('update:selectedCategory', value);
}

function openCommandPalette() {
  emit('openCommandPalette');
}
</script>

<template>
  <header class="app-header scanline-effect">
    <div class="header-container">
      <div class="header-left">
        <MatrixLogo />
      </div>
      <div class="header-center">
        <SearchBar
          :model-value="searchQuery || ''"
          @update:model-value="updateSearch"
          @open-command-palette="openCommandPalette"
        />
      </div>
      <div class="header-right">
        <CategoryFilter
          v-if="categories && categories.length > 0"
          :model-value="selectedCategory || []"
          :categories="categories"
          @update:model-value="updateCategory"
          class="category-filter-desktop"
        />
        <HamburgerMenu />
      </div>
      <!-- Category filter for mobile - below search bar -->
      <div v-if="categories && categories.length > 0" class="header-filter-mobile">
        <CategoryFilter
          :model-value="selectedCategory || []"
          :categories="categories"
          @update:model-value="updateCategory"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--bg-primary);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  border-bottom: 1px solid var(--border-color);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
}

.header-left {
  justify-self: start;
}

.header-center {
  justify-self: center;
}

.header-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Hide mobile filter on desktop */
.header-filter-mobile {
  display: none;
}

@media (max-width: 767px) {
  .header-container {
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto;
    gap: var(--spacing-sm);
  }

  .header-left {
    grid-column: 1;
    grid-row: 1;
  }

  .header-right {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    gap: 0;
  }

  .header-center {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
  }

  /* Make search bar full width on mobile */
  .header-center :deep(.search-bar) {
    max-width: 100%;
  }

  /* Hide desktop category filter on mobile */
  .category-filter-desktop {
    display: none;
  }

  /* Show mobile category filter below search */
  .header-filter-mobile {
    display: block;
    grid-column: 1 / -1;
    grid-row: 3;
    width: 100%;
  }

  .header-filter-mobile :deep(.category-filter__button) {
    width: 100%;
  }
}
</style>
