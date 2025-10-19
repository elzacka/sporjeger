<script setup lang="ts">
import { ref } from 'vue';
import { useFocusTrap } from '@/composables/useFocusTrap';

interface Props {
  isOpen: boolean;
  title?: string;
}

interface Emits {
  (e: 'close'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const modalRef = ref<HTMLElement | null>(null);

// Use focus trap for accessibility
useFocusTrap(modalRef);
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="base-modal-backdrop" @click="emit('close')">
      <div
        ref="modalRef"
        class="base-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click.stop
      >
        <!-- Header row with optional header slot and close button -->
        <div v-if="$slots.header" class="base-modal__header">
          <div class="base-modal__header-content">
            <slot name="header" />
          </div>
          <button class="base-modal__close" aria-label="Lukk" @click="emit('close')">✕</button>
        </div>
        <button v-else class="base-modal__close base-modal__close--standalone" aria-label="Lukk" @click="emit('close')">✕</button>

        <div class="base-modal__content">
          <slot />
        </div>

        <footer v-if="$slots.footer" class="base-modal__footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.base-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.base-modal {
  background-color: var(--bg-primary);
  border: 2px solid var(--matrix-bright);
  box-shadow: 0 0 30px var(--matrix-green-bright);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg) var(--spacing-lg) 0 var(--spacing-lg);
  gap: var(--spacing-md);
  flex-shrink: 0;
}

.base-modal__header-content {
  flex: 1;
  min-width: 0;
  /* The header inside should have no margins - spacing is controlled by padding */
}

.base-modal__close {
  color: var(--matrix-medium);
  font-size: var(--font-size-2xl);
  line-height: 1;
  transition: color 0.2s ease;
  padding: var(--spacing-xs);
  background: none;
  border: none;
  cursor: pointer;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.base-modal__close--standalone {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 1;
}

.base-modal__close:hover {
  color: var(--matrix-bright);
}

.base-modal__close:focus-visible {
  outline: none;
  color: var(--matrix-bright);
}

.base-modal__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  /* When header slot is used, gap should match h3 margin-bottom (--spacing-md) */
  padding-top: var(--spacing-md);
  /* Ensure long URLs and text wrap properly */
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* When there's no header slot, add extra padding for standalone close button */
.base-modal:has(.base-modal__close--standalone) .base-modal__content {
  padding-top: calc(var(--spacing-lg) + var(--spacing-xl));
}

/* Mobile optimization - reduce padding to prevent content overflow */
@media (max-width: 390px) {
  .base-modal__content {
    padding: var(--spacing-md);
    padding-top: calc(var(--spacing-md) + var(--spacing-xl));
  }
}

/* Custom scrollbar styling for Webkit browsers (Chrome, Safari, Edge) */
.base-modal__content::-webkit-scrollbar {
  width: 8px;
}

.base-modal__content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-left: 1px solid var(--matrix-dim);
}

.base-modal__content::-webkit-scrollbar-thumb {
  background: var(--matrix-dim);
  transition: background 0.2s ease;
}

.base-modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--matrix-medium);
}

/* Custom scrollbar for Firefox */
.base-modal__content {
  scrollbar-width: thin;
  scrollbar-color: var(--matrix-dim) var(--bg-secondary);
}

.base-modal__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

@media (max-width: 767px) {
  .base-modal-backdrop {
    /* Ensure equal padding on all sides for visible borders */
    padding: var(--spacing-lg);
  }

  .base-modal {
    max-width: 100%;
    max-height: calc(100vh - calc(var(--spacing-lg) * 2));
  }

  .base-modal__header {
    padding: var(--spacing-md) var(--spacing-md) 0 var(--spacing-md);
  }

  .base-modal__content {
    padding: var(--spacing-md);
    /* Keep same gap as desktop - h3 margin-bottom */
    padding-top: var(--spacing-md);
  }

  /* When standalone close button on mobile, add padding for it */
  .base-modal:has(.base-modal__close--standalone) .base-modal__content {
    padding-top: calc(var(--spacing-md) + 48px + var(--spacing-sm));
  }

  .base-modal__close {
    min-width: 48px;
    min-height: 48px;
    font-size: calc(var(--font-size-2xl) * 1.2);
  }

  .base-modal__close--standalone {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    /* Add background to prevent overlap with content */
    background-color: var(--bg-primary);
    border: 1px solid var(--matrix-dim);
  }
}

@media (max-width: 390px) {
  .base-modal-backdrop {
    /* Ensure equal padding on all sides */
    padding: var(--spacing-md);
  }

  .base-modal {
    max-width: 100%;
    max-height: calc(100vh - calc(var(--spacing-md) * 2));
  }
}
</style>
