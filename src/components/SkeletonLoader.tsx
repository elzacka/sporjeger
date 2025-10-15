/**
 * Skeleton loading screen for better perceived performance
 *
 * Shows content placeholders while data loads, reducing user anxiety
 * compared to blank spinner. Implements modern UX best practices.
 */
export function SkeletonLoader() {
  return (
    <div className="app loading-state">
      <div className="skeleton-container">
        <div className="skeleton-header">
          <div className="skeleton-title"></div>
          <div className="skeleton-search"></div>
        </div>
        <div className="main-content">
          <div className="skeleton-filters"></div>
          <div className="tools-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton-card-title"></div>
                <div className="skeleton-card-description"></div>
                <div className="skeleton-card-description short"></div>
                <div className="skeleton-card-footer"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
