/**
 * Optimized Image Component
 *
 * Features:
 * - Lazy loading with native browser API
 * - WebP support with PNG fallback
 * - Responsive images with srcset
 * - Loading placeholder
 * - Error handling
 *
 * React 19.2 + iOS 26 Safari compatible
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Memoize WebP support check - only run once per session
let webpSupport: boolean | null = null;

const supportsWebP = (): boolean => {
  if (webpSupport !== null) return webpSupport;
  if (typeof document === 'undefined') {
    webpSupport = false;
    return false;
  }
  const elem = document.createElement('canvas');
  webpSupport = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  return webpSupport;
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Memoize image sources to avoid recalculation
  const imageSources = useMemo(() => {
    const isWebP = supportsWebP();
    const basePath = src.replace(/\.(png|jpg|jpeg)$/, '');

    return {
      webp: `${basePath}.webp`,
      fallback: src,
      useWebP: isWebP,
    };
  }, [src]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  useEffect(() => {
    // Preload image for eager loading
    if (loading === 'eager') {
      const img = new Image();
      img.src = imageSources.useWebP ? imageSources.webp : imageSources.fallback;
      img.onload = handleLoad;
      img.onerror = handleError;

      // Cleanup
      return () => {
        img.onload = null;
        img.onerror = null;
      };
    }
  }, [loading, imageSources, handleLoad, handleError]);

  if (hasError) {
    return (
      <div
        className={`optimized-image-error ${className}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
        }}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="material-symbols-outlined" style={{ opacity: 0.3 }}>
          broken_image
        </span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      <source type="image/webp" srcSet={imageSources.webp} sizes={sizes} />

      {/* Fallback to PNG/JPG for older browsers */}
      <img
        src={imageSources.fallback}
        alt={alt}
        width={width}
        height={height}
        className={`optimized-image ${className} ${isLoaded ? 'loaded' : 'loading'}`}
        loading={loading}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
    </picture>
  );
}
