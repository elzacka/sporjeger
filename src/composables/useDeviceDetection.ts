import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Composable for detecting device type and capabilities
 * Useful for showing/hiding desktop-only features on mobile
 */
export function useDeviceDetection() {
  const isMobile = ref(false);
  const isTouch = ref(false);
  const isMac = ref(false);

  function detectDevice() {
    // Detect mobile based on user agent and screen width
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUA = mobileRegex.test(userAgent);
    const isSmallScreen = window.innerWidth < 768; // Tablet breakpoint

    isMobile.value = isMobileUA || (isSmallScreen && isTouchDevice());
    isTouch.value = isTouchDevice();
    isMac.value = /mac/i.test(userAgent);
  }

  function isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - IE specific
      (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0)
    );
  }

  function handleResize() {
    detectDevice();
  }

  onMounted(() => {
    detectDevice();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    isMobile,
    isTouch,
    isMac,
  };
}
