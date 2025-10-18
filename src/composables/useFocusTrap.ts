import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Focus trap for modal accessibility
 * Keeps focus within a container element and returns focus when unmounted
 */
export function useFocusTrap(containerRef: Ref<HTMLElement | null>) {
  const previousActiveElement = ref<HTMLElement | null>(null);

  function getFocusableElements(): HTMLElement[] {
    if (!containerRef.value) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(containerRef.value.querySelectorAll(focusableSelectors));
  }

  function handleTabKey(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !containerRef.value) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab: Focus previous element
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: Focus next element
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  function trapFocus() {
    // Store currently focused element to return to later
    previousActiveElement.value = document.activeElement as HTMLElement;

    // Focus first focusable element in container
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0]?.focus();
    }
  }

  function restoreFocus() {
    // Return focus to previously focused element
    previousActiveElement.value?.focus();
  }

  onMounted(() => {
    trapFocus();
    document.addEventListener('keydown', handleTabKey);
  });

  onUnmounted(() => {
    restoreFocus();
    document.removeEventListener('keydown', handleTabKey);
  });

  return {
    trapFocus,
    restoreFocus,
  };
}
