<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isVisible = ref(false);
const DISMISS_KEY = 'sporjeger-ios-prompt-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function isIOSDevice(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode(): boolean {
  return (window.navigator as any).standalone === true;
}

function isDismissed(): boolean {
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (!dismissed) return false;

  const dismissedTime = parseInt(dismissed, 10);
  const now = Date.now();

  return now - dismissedTime < DISMISS_DURATION;
}

function dismissPrompt() {
  localStorage.setItem(DISMISS_KEY, Date.now().toString());
  isVisible.value = false;
}

onMounted(() => {
  // Only show on iOS devices that are not already in standalone mode
  if (isIOSDevice() && !isInStandaloneMode() && !isDismissed()) {
    // Show after 30 seconds
    setTimeout(() => {
      isVisible.value = true;
    }, 30000);
  }
});
</script>

<template>
  <div v-if="isVisible" class="ios-install-prompt slide-down">
    <div class="ios-install-prompt__content">
      <button
        class="ios-install-prompt__close"
        aria-label="Lukk"
        @click="dismissPrompt"
      >
        ✕
      </button>

      <h3 class="ios-install-prompt__title">Installer Sporjeger</h3>

      <p class="ios-install-prompt__text">
        Legg til Sporjeger på hjem-skjerm for rask tilgang og offline bruk.
      </p>

      <ol class="ios-install-prompt__steps">
        <li>Trykk på Del-knappen nederst</li>
        <li>Rull ned og velg "Legg til på Hjem-skjerm"</li>
	<li>Sjekk at "Åpne som nettapp" er skrudd på</li>
        <li>Trykk "Legg til" øverst til høyre</li>
      </ol>

      <button
        class="ios-install-prompt__dismiss"
        @click="dismissPrompt"
      >
        OK
      </button>
    </div>
  </div>
</template>

<style scoped>
.ios-install-prompt {
  position: fixed;
  bottom: var(--spacing-md);
  left: var(--spacing-md);
  right: var(--spacing-md);
  background-color: var(--bg-secondary);
  border: 2px solid var(--matrix-bright);
  box-shadow: 0 0 20px var(--matrix-green-bright);
  z-index: var(--z-modal);
  padding: var(--spacing-lg);
}

.ios-install-prompt__content {
  position: relative;
}

.ios-install-prompt__close {
  position: absolute;
  top: -8px;
  right: -8px;
  color: var(--matrix-medium);
  font-size: var(--font-size-xl);
  line-height: 1;
  padding: var(--spacing-xs);
  transition: color 0.2s ease;
}

.ios-install-prompt__close:hover {
  color: var(--matrix-bright);
}

.ios-install-prompt__title {
  color: var(--matrix-bright);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.ios-install-prompt__text {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.5;
}

.ios-install-prompt__steps {
  color: var(--text-secondary);
  padding-left: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.ios-install-prompt__steps li {
  margin-bottom: var(--spacing-sm);
}

.ios-install-prompt__icon {
  display: inline-block;
  color: var(--matrix-bright);
  font-weight: bold;
  font-size: var(--font-size-lg);
}

.ios-install-prompt__dismiss {
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--bg-primary);
  border: 1px solid var(--matrix-bright);
  color: var(--matrix-bright);
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
}

.ios-install-prompt__dismiss:hover {
  background-color: rgba(0, 255, 65, 0.1);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

@media (min-width: 768px) {
  .ios-install-prompt {
    left: auto;
    right: var(--spacing-lg);
    max-width: 400px;
  }
}
</style>
