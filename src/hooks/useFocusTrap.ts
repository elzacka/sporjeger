import { useEffect, useRef } from 'react';

/**
 * Custom hook for trapping focus within a container (e.g., modal dialogs)
 *
 * Implements WCAG 2.1 Level A compliance for keyboard accessibility:
 * - 2.4.3 Focus Order - Maintains logical focus order within modal
 * - 2.1.2 No Keyboard Trap - Allows ESC key to exit (handled by useModalEscapeKey)
 *
 * This hook prevents keyboard users from tabbing to background elements
 * while a modal is open, ensuring focus stays within the modal content.
 *
 * @param isActive - Whether the focus trap should be active
 * @returns Ref to attach to the container element that should trap focus
 *
 * @example
 * ```tsx
 * const containerRef = useFocusTrap(isOpen);
 *
 * return (
 *   <div ref={containerRef} className="modal">
 *     <button>First focusable</button>
 *     <input />
 *     <button>Last focusable</button>
 *   </div>
 * );
 * ```
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store previously focused element to restore later
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus first element when trap activates
    if (firstElement) {
      firstElement.focus();
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab: Moving backwards
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab: Moving forwards
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Cleanup: restore focus to previously focused element
    return () => {
      container.removeEventListener('keydown', handleTabKey);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
