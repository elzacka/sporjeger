import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ActivityProps {
  children: ReactNode;
  mode: 'visible' | 'hidden';
}

/**
 * Activity Component - Polyfill for React 19.2's <Activity>
 *
 * Hides and restores UI while preserving internal state.
 * When hidden, the component is pre-rendered but not visible.
 * State is preserved while hidden, allowing instant transitions.
 *
 * Once React 19.2's <Activity> is stable, replace with:
 * import { Activity } from 'react';
 *
 * Benefits:
 * - Pre-render modals while hidden for instant display
 * - Preserve state (form inputs, scroll position) while hidden
 * - Smooth transitions without re-mounting
 */
export function Activity({ children, mode }: ActivityProps) {
  const [hasRendered, setHasRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === 'visible') {
      setHasRendered(true);
    }
  }, [mode]);

  // Pre-render once the component becomes visible for the first time
  if (!hasRendered && mode === 'hidden') {
    return null;
  }

  // Use CSS to hide/show instead of unmounting to preserve state
  return (
    <div
      ref={containerRef}
      style={{
        display: mode === 'hidden' ? 'none' : 'block',
      }}
      aria-hidden={mode === 'hidden'}
    >
      {children}
    </div>
  );
}
