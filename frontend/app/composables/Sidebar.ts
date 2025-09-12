const isOpened = ref(false);
const hasSidebar = ref(false);
const paneWidth = ref(isMobile() ? 350 : 390); // initial width of pane 1
const isResizing = ref(false);
const workspaceId = ref<string | undefined>(undefined);
const active_id = ref<string | null>(null);
export function useSidebar() {
  const toggleSidebar = () => (isOpened.value = !isOpened.value);

  return {
    toggleSidebar,
    isOpened,
    hasSidebar,
    paneWidth,
    isResizing,
    workspaceId,
    active_id,
  };
}
