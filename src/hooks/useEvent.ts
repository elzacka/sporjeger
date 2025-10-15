import { useCallback, useRef, useLayoutEffect } from 'react';

/**
 * useEvent hook - Polyfill for React 19.2's useEffectEvent
 *
 * This hook creates a stable function reference that always calls the latest version
 * of the callback, without needing to include it in dependency arrays.
 *
 * Once React 19.2's useEffectEvent is stable, replace this with:
 * import { useEffectEvent } from 'react';
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Create a stable function that calls the latest callback
  return useCallback(((...args) => {
    return callbackRef.current(...args);
  }) as T, []);
}
