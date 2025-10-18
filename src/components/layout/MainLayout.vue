<script setup lang="ts">
import AppHeader from './AppHeader.vue';

interface Props {
  categories?: string[];
  selectedCategory?: string;
}

interface Emits {
  (e: 'update:selectedCategory', value: string): void;
  (e: 'openCommandPalette'): void;
}

withDefaults(defineProps<Props>(), {
  categories: () => [],
  selectedCategory: '',
});

const emit = defineEmits<Emits>();

function updateCategory(value: string) {
  emit('update:selectedCategory', value);
}

function openCommandPalette() {
  emit('openCommandPalette');
}
</script>

<template>
  <div class="main-layout">
    <AppHeader
      :categories="categories"
      :selected-category="selectedCategory"
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
