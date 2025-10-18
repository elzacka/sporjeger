<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large';
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
});
</script>

<template>
  <div class="loading-spinner" :class="`loading-spinner--${size}`">
    <span class="spinner-text">LOADING</span>
    <span class="blinking-cursor">_</span>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--matrix-medium);
  font-family: 'JetBrains Mono', monospace;
}

.loading-spinner--small {
  font-size: var(--font-size-sm);
}

.loading-spinner--medium {
  font-size: var(--font-size-base);
}

.loading-spinner--large {
  font-size: var(--font-size-xl);
}
</style>
