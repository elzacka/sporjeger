/**
 * Loading fallback for Suspense boundaries
 */
export function LoadingFallback() {
  return (
    <div className="app loading-state">
      <div className="loading-spinner">
        <span className="material-symbols-outlined">sync</span>
        <p>Laster Sporjeger...</p>
      </div>
    </div>
  );
}
