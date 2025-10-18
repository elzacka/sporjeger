<script setup lang="ts">
import type { Vanskelighetsgrad } from '@/types';

interface Props {
  rating?: Vanskelighetsgrad;
}

const props = defineProps<Props>();

const numericRating = props.rating ? parseInt(props.rating) : 0;
</script>

<template>
  <div class="star-rating" :aria-label="`Vanskelighetsgrad: ${rating || 'Ikke angitt'} av 5`">
    <span
      v-for="star in 5"
      :key="star"
      class="star"
      :class="{ 'star--filled': star <= numericRating }"
    >
      ★
    </span>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  gap: 0.125rem;
  align-items: center;
  line-height: 1;
  transform: translateY(-2px);
}

.star {
  color: var(--matrix-dim);
  font-size: var(--font-size-lg);
  line-height: 1;
}

.star--filled {
  color: var(--matrix-bright);
  text-shadow: 0 0 10px var(--matrix-green-bright);
}
</style>
