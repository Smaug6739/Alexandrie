/**
 * Sidebar state management
 * Controls sidebar visibility, width, and content filtering
 */

const { isMobile } = useDevice();

const isOpened = ref(false);
const hasSidebar = ref(false);
const paneWidth = computed(() => (isMobile.value ? 340 : 390));
const isResizing = ref(false);
const workspaceId = ref<string | undefined>(undefined);
const active_id = ref<string | null>(null);

const toggleSidebar = () => (isOpened.value = !isOpened.value);

// Cache sidebar tree reference outside of computed to avoid recreating on each evaluation
const sidebarTreeRef = useSidebarTree();
const preferencesRef = usePreferences();

/** Filter tree items based on selected workspace and preferences */
const filtered = computed(() => {
  const tree = sidebarTreeRef.tree;
  const found = tree.value.find(i => i.id === workspaceId.value);

  if (found) return found.childrens || [];
  if (workspaceId.value === 'shared') return tree.value.filter(i => i.data && i.data.shared);
  if (!preferencesRef.get('displayUncategorizedResources').value) return tree.value.filter(i => i.data && i.data.role != 4); // hide uncategorized
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
