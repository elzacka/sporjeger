import { useEffect } from 'react';
import { useEvent } from './useEvent';

/**
 * Custom hook for handling keyboard shortcuts
 *
 * Extracts keyboard shortcut logic from App.tsx to improve maintainability.
 * Currently handles:
 * - Cmd/Ctrl + K: Open command palette
 *
 * @param onCommandPaletteOpen - Callback to open the command palette
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts(() => setIsCommandPaletteOpen(true));
 * ```
 */
export function useKeyboardShortcuts(onCommandPaletteOpen: () => void) {
  // React 19.2 pattern: useEvent for stable event handler without dependencies
  const handleKeyDown = useEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      onCommandPaletteOpen();
    }
  });

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
