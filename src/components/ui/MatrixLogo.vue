<script setup lang="ts">
// Terminal-style logo: >_ SPORJEGER_
</script>

<template>
  <div class="matrix-logo">
    <span class="prompt">&gt;_</span>
    <span class="app-name">SPORJEGER</span>
    <span class="blinking-cursor">_</span>
  </div>
</template>

<style scoped>
.matrix-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--matrix-bright);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.prompt {
  color: var(--matrix-medium);
}

.app-name {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

@media (max-width: 767px) {
  .matrix-logo {
    font-size: var(--font-size-lg);
  }
}
</style>
