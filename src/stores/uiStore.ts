import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const isCommandPaletteOpen = ref(false);
  const isMenuOpen = ref(false);
  const isFilterModalOpen = ref(false);

  function openCommandPalette() {
    isCommandPaletteOpen.value = true;
  }

  function closeCommandPalette() {
    isCommandPaletteOpen.value = false;
  }

  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
  }

  function closeMenu() {
    isMenuOpen.value = false;
  }

  return {
    isCommandPaletteOpen,
    isMenuOpen,
    isFilterModalOpen,
    openCommandPalette,
    closeCommandPalette,
    toggleMenu,
    closeMenu,
  };
});
