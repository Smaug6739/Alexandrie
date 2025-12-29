const width = ref(window.innerWidth);

const updateWidth = () => {
  width.value = window.innerWidth;
};

let isListening = false;

export function useDevice() {
  if (!isListening) {
    window.addEventListener('resize', updateWidth);
    isListening = true;
  }

  const isMobile = computed(() => width.value < 768);
  const isTablet = computed(() => width.value >= 768 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);

  return { width, isMobile, isTablet, isDesktop };
}
