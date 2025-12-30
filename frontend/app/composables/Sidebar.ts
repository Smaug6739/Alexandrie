/**
 * Sidebar state management
 * Controls sidebar visibility, width, and content filtering
 */

const { isMobile } = useDevice();

const isOpened = ref(false);
const hasSidebar = ref(false);
const paneWidth = ref(isMobile.value ? 350 : 390);
const isResizing = ref(false);
const workspaceId = ref<string | undefined>(undefined);
const active_id = ref<string | null>(null);

const toggleSidebar = () => (isOpened.value = !isOpened.value);

/** Filter tree items based on selected workspace and preferences */
const filtered = computed(() => {
  const { tree } = useSidebarTree();
  const found = tree.value.find(i => i.id === workspaceId.value);

  if (found) return found.childrens || [];
  if (workspaceId.value === 'shared') return tree.value.filter(i => i.data && i.data.shared);
  if (!usePreferences().get('displayUncategorizedResources').value) return tree.value.filter(i => i.data && i.data.role != 4); // hide uncategorized
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
