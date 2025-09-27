const isOpened = ref(false);
const hasSidebar = ref(false);
const paneWidth = ref(isMobile() ? 350 : 390); // initial width of pane 1
const isResizing = ref(false);
const workspaceId = ref<string | undefined>(undefined);
const active_id = ref<string | null>(null);

const toggleSidebar = () => (isOpened.value = !isOpened.value);

const filtered = computed(() => {
  const { tree } = useSidebarTree();
  const found = tree.value.find(i => i.id === workspaceId.value);
  if (found) return found.childrens || [];
  if (workspaceId.value === 'shared') return tree.value.filter(i => i.data && i.data.shared);
  if (!usePreferences().get('displayUncategorizedRessources').value) return tree.value.filter(i => i.data && i.data.role != 4); // hide uncategorized
  return tree.value;
});

export function useSidebar() {
  return {
    filtered,
    toggleSidebar,
    isOpened,
    hasSidebar,
    paneWidth,
    isResizing,
    workspaceId,
    active_id,
  };
}
