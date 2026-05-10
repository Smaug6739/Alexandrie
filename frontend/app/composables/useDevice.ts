/**
 * Device detection composable
 * SSR-compatible with client-side hydration
 */

const width = ref(1024); // Default value for SSR
const isInitialized = ref(false);

function updateWidth() {
  if (import.meta.client) {
    width.value = window.innerWidth;
  }
}

export function useDevice() {
  // Initialize on client-side only, once
  if (import.meta.client && !isInitialized.value) {
    width.value = window.innerWidth;
    window.addEventListener('resize', updateWidth);
    isInitialized.value = true;
  }

  const isMobile = computed(() => width.value < 768);
  const isTablet = computed(() => width.value >= 768 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);

  return { width, isMobile, isTablet, isDesktop };
}
