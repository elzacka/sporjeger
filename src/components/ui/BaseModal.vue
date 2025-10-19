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
        <!-- Close button (always at top right) -->
        <button class="base-modal__close" aria-label="Lukk" @click="emit('close')">✕</button>

        <div class="base-modal__content">
          <!-- Optional header inside content area -->
          <div v-if="$slots.header" class="base-modal__content-header">
            <slot name="header" />
          </div>

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

.base-modal__close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  z-index: 2;
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

.base-modal__content-header {
  margin-bottom: var(--spacing-md);
  padding-top: 0;
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
  overflow-x: hidden;
  padding: var(--spacing-lg);
  /* Add padding-top for close button */
  padding-top: calc(var(--spacing-md) + 40px + var(--spacing-xs));
  /* Ensure long URLs and text wrap properly */
  word-wrap: break-word;
  overflow-wrap: break-word;
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
  width: 10px;
}

.base-modal__content::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-left: 1px solid var(--matrix-dim);
}

.base-modal__content::-webkit-scrollbar-thumb {
  background: var(--matrix-medium);
  border-radius: 0;
  transition: background 0.2s ease;
}

.base-modal__content::-webkit-scrollbar-thumb:hover {
  background: var(--matrix-bright);
}

/* Custom scrollbar for Firefox */
.base-modal__content {
  scrollbar-width: auto;
  scrollbar-color: var(--matrix-medium) var(--bg-secondary);
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

  .base-modal__content {
    padding: var(--spacing-md);
    padding-top: calc(var(--spacing-sm) + 48px + var(--spacing-xs));
  }

  .base-modal__close {
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    min-width: 48px;
    min-height: 48px;
    font-size: calc(var(--font-size-2xl) * 1.2);
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
