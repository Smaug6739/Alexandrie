import { ref } from 'vue';

export const isOpened = ref(false);
export const hasSidebar = ref(false);
export const paneWidth = ref(360); // initial width of pane 1

export function useSidebar() {
  const toggleSidebar = () => {
    isOpened.value = !isOpened.value;
  };

  return {
    toggleSidebar,
    isOpened,
    hasSidebar,
    paneWidth,
  };
}
