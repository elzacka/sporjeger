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
export function useEvent<TArgs extends unknown[], TReturn>(
  callback: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // Create a stable function that calls the latest callback
  return useCallback((...args: TArgs) => {
    return callbackRef.current(...args);
  }, []);
}
