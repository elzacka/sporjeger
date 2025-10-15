import { use } from 'react';
import type { OSINTTool } from '../types';
import { fetchOSINTTools } from '../services/googleSheets';

/**
 * Client-side cache for the tools promise
 * In React Server Components, we'd use React's cache() function
 * For client-side, we create a simple singleton cache
 */
let cachedPromise: Promise<OSINTTool[]> | null = null;

function getOSINTToolsPromise(): Promise<OSINTTool[]> {
  if (!cachedPromise) {
    cachedPromise = fetchOSINTTools();
  }
  return cachedPromise;
}

/**
 * React 19: Modern data fetching with use() hook + Suspense
 *
 * This replaces the old pattern of useEffect + useState + loading state
 * The component will suspend until data is ready, and React handles the loading UI
 *
 * Usage:
 * ```tsx
 * function App() {
 *   const tools = useOSINTToolsSuspense(); // Suspends until data loads
 *   return <div>{tools.map(...)}</div>
 * }
 *
 * // Wrap with Suspense:
 * <Suspense fallback={<LoadingFallback />}>
 *   <App />
 * </Suspense>
 * ```
 */
export function useOSINTToolsSuspense(): OSINTTool[] {
  // React 19: use() hook reads the promise and suspends until resolved
  return use(getOSINTToolsPromise());
}

/**
 * Reset the cache (useful for refresh/reload functionality)
 */
export function resetToolsCache(): void {
  cachedPromise = null;
}
