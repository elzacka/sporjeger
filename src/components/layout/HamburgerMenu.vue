<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';

const isMenuOpen = ref(false);
const isInfoModalOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

function openInfoModal() {
  isInfoModalOpen.value = true;
  closeMenu();
}

function closeInfoModal() {
  isInfoModalOpen.value = false;
}
</script>

<template>
  <div class="hamburger-menu">
    <button
      class="hamburger-menu__button anchor-element"
      aria-label="Meny"
      :aria-expanded="isMenuOpen"
      @click="toggleMenu"
    >
      <span class="hamburger-menu__icon">☰</span>
    </button>

    <div v-if="isMenuOpen" class="hamburger-menu__dropdown slide-down">
      <button class="hamburger-menu__item" @click="openInfoModal">
        <span class="hamburger-menu__item-text">Om Sporjeger</span>
      </button>

      <a
        href="https://github.com/bellingcat/toolkit"
        target="_blank"
        rel="noopener noreferrer"
        class="hamburger-menu__item"
        @click="closeMenu"
      >
        <span class="hamburger-menu__item-text">Bellingcat OSINT Toolkit</span>
      </a>
    </div>

    <!-- Info Modal -->
    <BaseModal :is-open="isInfoModalOpen" title="Om Sporjeger" @close="closeInfoModal">
      <div class="info-content">
        <p class="info-content__paragraph">
          <strong>Sporjeger</strong> (Tracker) er en kuratert katalog over OSINT-verktøy designet
          for digitale etterforskere, forskere og journalister.
        </p>

        <h3 class="info-content__heading">Versjon</h3>
        <p class="info-content__paragraph">2.0 (Vue 3 Rebuild)</p>

        <h3 class="info-content__heading">Teknologi</h3>
        <ul class="info-content__list">
          <li>Vue 3.5 + TypeScript 5.9</li>
          <li>Vite 7.1 Build Tool</li>
          <li>Pinia State Management</li>
          <li>WebKit 26.0 CSS Features</li>
        </ul>

        <h3 class="info-content__heading">Datakilde</h3>
        <p class="info-content__paragraph">
          Verktøydata kommer fra Google Sheets API. Milestone 1 bruker dummy data for testing.
        </p>

        <h3 class="info-content__heading">Personvern</h3>
        <p class="info-content__paragraph">
          Sporjeger samler ingen brukerdata, har ingen sporingskode, og bruker ingen cookies. Alt
          lagres lokalt på enheten din.
        </p>

        <h3 class="info-content__heading">Tilgjengelighet</h3>
        <p class="info-content__paragraph">
          Appen er bygget med WCAG 2.1 AA standarder og støtter full tastaturnavigasjon.
        </p>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.hamburger-menu {
  position: relative;
}

.hamburger-menu__button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 40px;
  height: 40px;
}

.hamburger-menu__button:hover {
  border-color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

.hamburger-menu__button:focus-visible {
  outline: none;
  border-color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

.hamburger-menu__icon {
  font-size: var(--font-size-xl);
  line-height: 1;
}

.hamburger-menu__dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-xs));
  right: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  width: max-content;
  min-width: 220px;
  max-width: 90vw;
  z-index: var(--z-dropdown);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* On smaller screens, prevent overflow */
@media (max-width: 480px) {
  .hamburger-menu__dropdown {
    left: auto;
    right: calc(var(--spacing-md) * -1);
  }
}

.hamburger-menu__item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--spacing-md);
  text-align: left;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-base);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  cursor: pointer;
}

.hamburger-menu__item:hover {
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

.hamburger-menu__item:focus-visible {
  outline: none;
  background-color: rgba(0, 255, 65, 0.1);
  color: var(--matrix-bright);
}

/* Info Modal Content Styling */
.info-content__paragraph {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.info-content__heading {
  color: var(--matrix-bright);
  font-size: var(--font-size-lg);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
}

.info-content__list {
  color: var(--text-secondary);
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.info-content__list li {
  margin-bottom: var(--spacing-xs);
}
</style>
