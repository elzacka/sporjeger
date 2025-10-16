/**
 * Minimalistic loading component for better user experience
 *
 * Simple, subtle spinner that doesn't overwhelm the user
 * React 19.2 + iOS 26 optimized
 */
export function SkeletonLoader() {
  return (
    <div className="minimal-loading-container" role="status" aria-live="polite">
      <div className="minimal-spinner">
        <svg
          className="spinner-svg"
          width="48"
          height="48"
          viewBox="0 0 48 48"
          xmlns="https://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            className="spinner-circle"
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="minimal-loading-text">
        Laster verktøy<span className="loading-dots">...</span>
      </p>
    </div>
  );
}
