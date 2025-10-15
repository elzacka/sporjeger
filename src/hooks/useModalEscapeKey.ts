import { useEffect } from 'react';
import { useEvent } from './useEvent';

/**
 * React 19: Modal escape key handler with body scroll lock
 *
 * Handles ESC key to close modal and locks body scroll when open.
 * Uses useEvent for stable callback reference without dependencies.
 *
 * @param isOpen - Whether the modal is currently open
 * @param onClose - Callback to close the modal
 *
 * @example
 * ```tsx
 * function MyModal({ isOpen, onClose }) {
 *   useModalEscapeKey(isOpen, onClose);
 *
 *   return (
 *     <div className={isOpen ? 'visible' : 'hidden'}>
 *       {/* Modal content *\/}
 *     </div>
 *   );
 * }
 * ```
 */
export function useModalEscapeKey(isOpen: boolean, onClose: () => void) {
  // React 19: useEvent ensures stable reference
  const handleEscape = useEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  });

  useEffect(() => {
    if (isOpen) {
      // Add escape key listener
      document.addEventListener('keydown', handleEscape);

      // Lock body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Cleanup: remove listener and restore scroll
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);
}
