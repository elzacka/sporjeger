/**
 * Star Icon Component
 * Reusable SVG star for difficulty ratings
 * React 19.2: Small, focused component for reusability
 */

interface StarIconProps {
  filled: boolean;
  size?: number;
  className?: string;
}

export function StarIcon({ filled, size = 16, className = '' }: StarIconProps) {
  return (
    <svg
      className={`star ${filled ? 'filled' : 'empty'} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 1.5l1.545 4.757h5.005l-4.045 2.986 1.545 4.757L8 11.014 3.95 14l1.545-4.757L1.45 6.257h5.005z"
        fill="currentColor"
      />
    </svg>
  );
}
