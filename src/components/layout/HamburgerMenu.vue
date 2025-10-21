<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BaseModal from '@/components/ui/BaseModal.vue';

const isMenuOpen = ref(false);
const isInfoModalOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);

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

// Close menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const clickedButton = buttonRef.value && buttonRef.value.contains(target);
  const clickedMenu = menuRef.value && menuRef.value.contains(target);

  if (!clickedButton && !clickedMenu && isMenuOpen.value) {
    closeMenu();
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
  <div class="hamburger-menu">
    <button
      ref="buttonRef"
      class="hamburger-menu__button anchor-element"
      aria-label="Meny"
      :aria-expanded="isMenuOpen"
      @click.stop="toggleMenu"
    >
      <span class="hamburger-menu__icon">☰</span>
    </button>

    <div v-if="isMenuOpen" ref="menuRef" class="hamburger-menu__dropdown slide-down">
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
        <p class="info-content__paragraph">Du trenger informasjon. Den ligger der ute, spredt. Den gamle avisartikkelen. Kildene til skolearbeidet. Svar på hva som faktisk er de vanligste digitale sårbarhetene i Norge.
Sporjeger er verktøykassa. Ikke en snarvei til å bryte loven, men et verktøy for å lære og finne det som faktisk er åpent og tilgjengelig.
</p>
<p class="info-content__paragraph">
Bruk hodet. Bruk det etisk. Bruk det innenfor lovens grenser.
</p>

        <ul class="info-content__list">
          <li>Én stjerne: Enklest å bruke</li>
          <li>Gratish: Du må betale for noe av innholdet</li>
          <li>NOR, USA, RUS osv: Landet verktøyet kommer fra</li>
          <li>Bok-knapp: Se hvordan du bruker verktøyet</li>
	  	  <li>Play-knapp: Åpne verktøyet</li>
        </ul>

        <h3 class="info-content__heading">Datakilder og personvern</h3>
        <p class="info-content__paragraph">
          Mesteparten kommer fra <a href="https://bellingcat.gitbook.io/toolkit" target="_blank" rel="noopener noreferrer" class="info-content__link">Bellingcat's Online Open Source Investigation Toolkit</a>. Resten har jeg funnet selv.
        </p>

        <p class="info-content__paragraph">
          Sporjeger samler null brukerdata. Ingen sporingskode. Ingen cookies. Ingenting.
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

/* Info Modal Header Styling - matches h3 headings exactly */
.info-header {
  color: var(--matrix-bright);
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

/* Info Modal Content Styling */
.info-content {
  padding-top: 0;
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
  font-weight: 700;
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
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

.info-content__link {
  color: var(--matrix-bright);
  text-decoration: underline;
  text-decoration-color: var(--matrix-medium);
  text-underline-offset: 2px;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  cursor: pointer;
}

.info-content__link:hover {
  color: var(--matrix-green-bright);
  text-decoration-color: var(--matrix-green-bright);
}

.info-content__link:focus-visible {
  outline: 2px solid var(--matrix-bright);
  outline-offset: 2px;
  color: var(--matrix-green-bright);
}
</style>
