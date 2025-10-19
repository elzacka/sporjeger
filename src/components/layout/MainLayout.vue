<script setup lang="ts">
import AppHeader from './AppHeader.vue';

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
  searchQuery: '',
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
  <div class="main-layout">
    <AppHeader
      :search-query="searchQuery"
      :categories="categories"
      :selected-category="selectedCategory"
      @update:search-query="updateSearch"
      @update:selected-category="updateCategory"
      @open-command-palette="openCommandPalette"
    />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 767px) {
  .main-content {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
