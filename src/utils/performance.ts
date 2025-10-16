/**
 * Performance Monitoring Utility
 * Tracks Web Vitals and custom metrics for iOS 26 + modern browsers
 *
 * NOTE: No user tracking or analytics - metrics are logged to console only
 * for developer debugging and performance optimization purposes.
 */

/**
 * Track Web Vitals using Performance Observer API
 * Measures: LCP, FID, CLS, FCP, TTFB
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Track page load time
  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        logMetric('page_load_time', pageLoadTime);
        logMetric('connect_time', connectTime);
        logMetric('render_time', renderTime);

        console.log('[Performance] Page metrics:', {
          pageLoadTime: `${pageLoadTime}ms`,
          connectTime: `${connectTime}ms`,
          renderTime: `${renderTime}ms`,
        });
      }, 0);
    });
  }

  // Track Core Web Vitals with PerformanceObserver
  trackLCP(); // Largest Contentful Paint
  trackFID(); // First Input Delay
  trackCLS(); // Cumulative Layout Shift
  trackFCP(); // First Contentful Paint
  trackINP(); // Interaction to Next Paint (new in 2024)

  // Track custom app metrics
  trackDataFetchTime();
  trackIOSMetrics();
}

/**
 * Largest Contentful Paint (LCP)
 * Target: < 2.5s (good), < 4s (needs improvement), > 4s (poor)
 */
function trackLCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      const value = lastEntry.startTime;
      const rating = value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';

      logMetric('lcp', value, rating);
      console.log(`[Performance] LCP: ${value.toFixed(0)}ms (${rating})`);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('[Performance] LCP not supported:', error);
  }
}

/**
 * First Input Delay (FID)
 * Target: < 100ms (good), < 300ms (needs improvement), > 300ms (poor)
 */
function trackFID() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[];
      entries.forEach((entry) => {
        const value = entry.processingStart - entry.startTime;
        const rating = value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';

        logMetric('fid', value, rating);
        console.log(`[Performance] FID: ${value.toFixed(0)}ms (${rating})`);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('[Performance] FID not supported:', error);
  }
}

/**
 * Cumulative Layout Shift (CLS)
 * Target: < 0.1 (good), < 0.25 (needs improvement), > 0.25 (poor)
 */
function trackCLS() {
  try {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShift[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      const rating = clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor';
      logMetric('cls', clsValue, rating);
      console.log(`[Performance] CLS: ${clsValue.toFixed(3)} (${rating})`);
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('[Performance] CLS not supported:', error);
  }
}

/**
 * First Contentful Paint (FCP)
 * Target: < 1.8s (good), < 3s (needs improvement), > 3s (poor)
 */
function trackFCP() {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const value = entry.startTime;
        const rating = value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';

        logMetric('fcp', value, rating);
        console.log(`[Performance] FCP: ${value.toFixed(0)}ms (${rating})`);
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('[Performance] FCP not supported:', error);
  }
}

/**
 * Interaction to Next Paint (INP)
 * New metric replacing FID (2024+)
 * Target: < 200ms (good), < 500ms (needs improvement), > 500ms (poor)
 */
function trackINP() {
  try {
    const observer = new PerformanceObserver((list) => {
      let maxDuration = 0;
      for (const entry of list.getEntries() as PerformanceEventTiming[]) {
        const duration = entry.duration;
        maxDuration = Math.max(maxDuration, duration);
      }

      const rating = maxDuration < 200 ? 'good' : maxDuration < 500 ? 'needs-improvement' : 'poor';
      logMetric('inp', maxDuration, rating);
      console.log(`[Performance] INP: ${maxDuration.toFixed(0)}ms (${rating})`);
    });

    observer.observe({ type: 'event', buffered: true });
  } catch (error) {
    console.warn('[Performance] INP not supported:', error);
  }
}

/**
 * Track Google Sheets API fetch time
 */
function trackDataFetchTime() {
  if (!window.performance) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const sheetsRequests = resources.filter((r) =>
        r.name.includes('sheets.googleapis.com')
      );

      sheetsRequests.forEach((request) => {
        const duration = request.duration;
        logMetric('api_fetch_time', duration);
        console.log(`[Performance] API Fetch: ${duration.toFixed(0)}ms`);
      });
    }, 1000);
  });
}

/**
 * Track iOS-specific metrics
 */
function trackIOSMetrics() {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  if (!isIOS) return;

  const isIOS26 = /iPhone OS 26_0/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  logMetric('ios_device', 1);
  if (isIOS26) logMetric('ios_26', 1);
  if (isStandalone) logMetric('pwa_installed', 1);

  console.log('[Performance] iOS metrics:', {
    isIOS26,
    isStandalone,
    userAgent: navigator.userAgent,
  });
}

/**
 * Log metric to console only - NO user tracking or analytics
 * Metrics are for developer debugging purposes only
 */
function logMetric(
  name: string,
  value: number,
  rating?: 'good' | 'needs-improvement' | 'poor'
) {
  // Console logging only - no external tracking
  console.debug(`[Metric] ${name}: ${value}${rating ? ` (${rating})` : ''}`);
}

/**
 * Performance marker for custom events
 */
export function markPerformance(name: string) {
  if (!window.performance || !performance.mark) return;

  try {
    performance.mark(name);
    console.debug(`[Performance] Mark: ${name}`);
  } catch (error) {
    console.warn(`[Performance] Failed to mark ${name}:`, error);
  }
}

/**
 * Measure performance between two marks
 */
export function measurePerformance(name: string, startMark: string, endMark: string) {
  if (!window.performance || !performance.measure) return;

  try {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      logMetric(name, measure.duration);
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(0)}ms`);
    }
  } catch (error) {
    console.warn(`[Performance] Failed to measure ${name}:`, error);
  }
}

// Type definitions for Performance APIs
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  duration: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}
