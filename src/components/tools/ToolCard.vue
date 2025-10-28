<script setup lang="ts">
import { computed } from 'vue';
import type { OSINTTool } from '@/types';
import StarRating from '@/components/ui/StarRating.vue';

interface Props {
  tool: OSINTTool;
}

interface Emits {
  (e: 'openGuide', tool: OSINTTool): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

function handleGuideClick(tool: OSINTTool) {
  emit('openGuide', tool);
}

// Display country code (e.g., "NOR", "USA", "RUS")
const countryCode = computed(() => {
  if (!props.tool.språk) return null;
  return props.tool.språk;
});

// Tool type badge display (inspired by OSINT Framework)
const toolTypeBadge = computed(() => {
  const typeMap = {
    web: 'W',
    terminal: 'T',
    dork: 'D',
    'browser-extension': 'E',
    api: 'A',
    mobile: 'M',
  };
  return props.tool.toolType ? typeMap[props.tool.toolType] : null;
});

const toolTypeLabel = computed(() => {
  const labelMap = {
    web: 'web',
    terminal: 'terminal',
    dork: 'dork',
    'browser-extension': 'browser extension',
    api: 'api',
    mobile: 'mobile',
  };
  return props.tool.toolType ? labelMap[props.tool.toolType] : '';
});
</script>

<template>
  <article class="tool-card glow-hover scroll-animate">
    <header class="tool-card__header">
      <h3 class="tool-card__title">{{ tool.navn }}</h3>
      <div class="tool-card__badges">
        <span class="tool-card__category">{{ tool.kategori }}</span>
        <span
          v-if="toolTypeBadge"
          class="tool-card__type-badge"
          :title="toolTypeLabel"
          :aria-label="`Type: ${toolTypeLabel}`"
        >
          ({{ toolTypeBadge }})
        </span>
        <span
          v-if="tool.kreverRegistrering === 'Ja'"
          class="tool-card__type-badge"
          title="Krever registrering"
          aria-label="Krever registrering"
        >
          (R)
        </span>
      </div>
    </header>

    <p class="tool-card__description text-wrap-pretty">{{ tool.beskrivelse }}</p>

    <!-- Category Path (Hierarchy) - Show only if it has subcategories -->
    <div v-if="tool.categoryPath && tool.categoryPath.length > 1" class="tool-card__hierarchy">
      <span class="tool-card__hierarchy-icon material-symbols-outlined">folder_open</span>
      <span class="tool-card__hierarchy-path">{{ tool.categoryPath.join(' › ') }}</span>
    </div>

    <footer class="tool-card__footer">
      <div class="tool-card__meta">
        <div v-if="tool.vanskelighetsgrad" class="tool-card__meta-item">
          <span class="meta-label">VANSKELIGHETSGRAD:</span>
          <StarRating :rating="tool.vanskelighetsgrad" />
        </div>

        <div class="tool-card__meta-row">
          <span class="tool-card__cost">{{ tool.kostnad }}</span>
          <template v-if="countryCode">
            <span class="tool-card__separator">•</span>
            <span class="tool-card__country">{{ countryCode }}</span>
          </template>
          <template v-if="toolTypeLabel">
            <span class="tool-card__separator">•</span>
            <span class="tool-card__tool-type">{{ toolTypeLabel }}</span>
          </template>
          <template v-if="tool.lastVerified">
            <span class="tool-card__separator">•</span>
            <span class="tool-card__verified" :title="`Sist verifisert: ${tool.lastVerified}`">
              ✓ {{ tool.lastVerified }}
            </span>
          </template>
        </div>

        <!-- Alternatives -->
        <div v-if="tool.alternatives && tool.alternatives.length > 0" class="tool-card__alternatives">
          <span class="tool-card__alternatives-label">Alternativer:</span>
          <span class="tool-card__alternatives-list">{{ tool.alternatives.join(', ') }}</span>
        </div>
      </div>

      <div class="tool-card__actions">
        <button
          v-if="tool.veiledning"
          class="tool-card__button tool-card__button--guide"
          aria-label="Åpne veiledning"
          title="Åpne veiledning"
          @click="handleGuideClick(tool)"
        >
          <span class="material-symbols-outlined">book_2</span>
        </button>
        <a
          :href="tool.url"
          target="_blank"
          rel="noopener noreferrer"
          class="tool-card__link tool-card__play"
          aria-label="Åpne verktøy"
          title="Åpne verktøy"
        >
          <span class="material-symbols-outlined">play_arrow</span>
        </a>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.tool-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: box-shadow 0.3s ease;
}

.tool-card__header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.tool-card__title {
  font-size: var(--font-size-xl);
  color: var(--matrix-bright);
}

.tool-card__badges {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tool-card__category {
  font-size: var(--font-size-sm);
  color: var(--matrix-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tool-card__type-badge {
  font-size: var(--font-size-xs);
  color: var(--matrix-dim);
  font-weight: 600;
  cursor: help;
  transition: color 0.2s ease;
}

.tool-card__type-badge:hover {
  color: var(--matrix-medium);
}

.tool-card__description {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  line-height: 1.6;
  /* Ensure long text wraps properly */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.tool-card__meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem; /* 50% of --spacing-xs (0.25rem) */
}

.tool-card__meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  line-height: 1;
}

.tool-card__meta-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
}

.tool-card__cost {
  color: var(--text-dim);
}

.tool-card__separator {
  color: var(--text-dim);
}

.tool-card__country {
  color: var(--text-dim);
}

.tool-card__tool-type {
  color: var(--text-dim);
}

.tool-card__verified {
  color: var(--matrix-dim);
  font-size: var(--font-size-xs);
}

.tool-card__hierarchy {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--text-dim);
}

.tool-card__hierarchy-icon {
  font-size: 14px;
  color: var(--matrix-dim);
}

.tool-card__hierarchy-path {
  color: var(--text-dim);
  font-style: italic;
}

.tool-card__alternatives {
  display: flex;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xs);
}

.tool-card__alternatives-label {
  color: var(--text-dim);
  flex-shrink: 0;
}

.tool-card__alternatives-list {
  color: var(--matrix-medium);
}

.meta-label {
  color: var(--text-dim);
}

.meta-value {
  color: var(--text-primary);
}

.tool-card__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.tool-card__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.tool-card__button {
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.2s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tool-card__button .material-symbols-outlined {
  font-size: var(--font-size-xl);
  font-variation-settings: 'FILL' 0, 'wght' 100, 'GRAD' 0, 'opsz' 20;
}

.tool-card__button:hover {
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
}

.tool-card__button:focus-visible {
  outline: none;
  border-color: var(--matrix-bright);
  color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

.tool-card__link {
  color: var(--matrix-medium);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  text-decoration: none;
}

.tool-card__link .material-symbols-outlined {
  font-size: var(--font-size-3xl);
  font-variation-settings: 'FILL' 0, 'wght' 100, 'GRAD' 0, 'opsz' 48;
}

.tool-card__link:hover {
  color: var(--matrix-green-bright);
  border-color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

.tool-card__link:focus-visible {
  outline: none;
  color: var(--matrix-green-bright);
  border-color: var(--matrix-bright);
  box-shadow: 0 0 10px var(--matrix-green-bright);
}

/* Mobile optimizations - 48px touch targets */
@media (max-width: 767px) {
  .tool-card__button,
  .tool-card__link {
    width: 48px;
    height: 48px;
  }

  .tool-card__button .material-symbols-outlined {
    font-size: calc(var(--font-size-xl) * 1.1);
  }
}
</style>
