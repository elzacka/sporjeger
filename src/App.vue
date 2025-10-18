<script setup lang="ts">
import IOSInstallPrompt from '@/components/pwa/IOSInstallPrompt.vue';

// Root application component
// Router view handles all routing
</script>

<template>
  <div id="app">
    <RouterView />
    <IOSInstallPrompt />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
}
</style>
