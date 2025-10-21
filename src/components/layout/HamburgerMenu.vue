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

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node;
  const clickedButton = buttonRef.value && buttonRef.value.contains(target);
  const clickedMenu = menuRef.value && menuRef.value.contains(target);

  if (!clickedButton && !clickedMenu && isMenuOpen.value) {
    closeMenu();
  }
}

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

    <!-- Info Modal uten "Om"-overskrift -->
    <BaseModal :is-open="isInfoModalOpen" title="Om Sporjeger" @close="closeInfoModal">
      <div class="info-content">
        <p class="info-content__paragraph">
          <strong>Sporjeger</strong> er en OSINT-verktøykasse for å finne og jobbe med materiale fra åpne kilder på internett. OSINT står for "open source intelligence".
        </p>

        <h3 class="info-content__heading">Hva kan du bruke Sporjeger til?</h3>
        <p class="info-content__paragraph">
          Tenk på en GPS som viser vei til det du leter etter. Den gamle avisartikkelen, kildene du trenger til skolearbeidet eller svar på hva som faktisk er de vanligste digitale sårbarhetene i Norge. Og mye mer.
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
          De fleste verktøyene hentes fra
          <a
            href="https://bellingcat.gitbook.io/toolkit"
            target="_blank"
            rel="noopener noreferrer"
            class="info-content__link"
          >
            Bellingcat's Online Open Source Investigation Toolkit
          </a>.
          Andre har jeg funnet og brukt selv.
        </p>

        <p class="info-content__paragraph">
          Sporjeger samler ingen brukerdata, har ingen sporingskode og bruker ingen cookies.
        </p>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
/* uendret CSS */
</style>
