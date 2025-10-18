<script setup lang="ts">
import type { OSINTTool } from '@/types';
import ToolCard from './ToolCard.vue';

interface Props {
  tools: OSINTTool[];
}

interface Emits {
  (e: 'openGuide', tool: OSINTTool): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

function handleOpenGuide(tool: OSINTTool) {
  emit('openGuide', tool);
}
</script>

<template>
  <div class="tool-grid">
    <ToolCard
      v-for="tool in tools"
      :key="tool.navn"
      :tool="tool"
      @open-guide="handleOpenGuide"
    />
  </div>
</template>

<style scoped>
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

@media (max-width: 767px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
