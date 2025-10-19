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
        href="https://www.bellingcat.com"
        target="_blank"
        rel="noopener noreferrer"
        class="hamburger-menu__item"
        @click="closeMenu"
      >
        <span class="hamburger-menu__item-text">Bellingcat</span>
      </a>
    </div>

    <!-- Info Modal -->
    <BaseModal :is-open="isInfoModalOpen" title="Om Sporjeger" @close="closeInfoModal">
      <div class="info-content">
        <p class="info-content__paragraph">
          <strong>Sporjeger</strong> er en OSINT-verktøykasse for å finne og jobbe med materiale fra åpne kilder på internett. OSINT står for "open source intelligence".
        </p>

        <h3 class="info-content__heading">Hva kan du bruke Sporjeger til?</h3>
        <p class="info-content__paragraph">Tenk på en GPS som viser vei til det du leter etter. Den gamle avisartikkelen, kildene du trenger til skolearbeidet eller svar på hva som faktisk er de vanligste digitale sårbarhetene i Norge. Og mye mer.
</p>
<p class="info-content__paragraph">
Men husk: Bruk for å lære og finne, innenfor hva som er lov og etisk forsvarlig.
</p>

        <ul class="info-content__list">
          <li>Én stjerne: Enklest å bruke</li>
          <li>Gratish: Du må betale for noe av innholdet</li>
          <li>NOR, USA, RUS osv: Hvilket land verktøyet kommer fra</li>
          <li>Trykk på boka: Se hvordan du kan bruke verktøyet</li>
	  <li>Trykk play: Åpne verktøyet</li>
        </ul>

        <h3 class="info-content__heading">Datakilder og personvern</h3>
        <p class="info-content__paragraph">
          De fleste verktøyene hentes fra "Bellingcat’s Online Open Source Investigation Toolkit". Andre har jeg funnet og brukt selv.
        </p>

        <p class="info-content__paragraph">
          Sporjeger samler ingen brukerdata, har ingen sporingskode og bruker ingen cookies.
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
.info-content {
  padding-top: var(--spacing-md);
}

.info-content__paragraph {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
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
  font-size: var(--font-size-base);
  padding-left: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.info-content__list li {
  margin-bottom: var(--spacing-xs);
}
</style>
