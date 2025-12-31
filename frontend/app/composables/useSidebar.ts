/**
 * Sidebar state management
 * Controls sidebar visibility, width, and content filtering
 */

// Module-level state (safe - these don't depend on Pinia)
const isOpened = ref(false);
const hasSidebar = ref(false);
const isResizing = ref(false);
const workspaceId = ref<string | undefined>(undefined);
const active_id = ref<string | null>(null);

const toggleSidebar = () => (isOpened.value = !isOpened.value);

// Lazy-initialized references (only set once when useSidebar is first called)
let _sidebarTreeRef: ReturnType<typeof useSidebarTree> | null = null;
let _preferencesRef: ReturnType<typeof usePreferences> | null = null;
let _filtered: ComputedRef<Item[]> | null = null;
let _paneWidth: ComputedRef<number> | null = null;

export function useSidebar() {
  const { isMobile } = useDevice();

  // Lazy init: only create these once
  if (!_sidebarTreeRef) {
    _sidebarTreeRef = useSidebarTree();
  }
  if (!_preferencesRef) {
    _preferencesRef = usePreferences();
  }
  if (!_paneWidth) {
    _paneWidth = computed(() => (isMobile.value ? 340 : 390));
  }
  if (!_filtered) {
    /** Filter tree items based on selected workspace and preferences */
    _filtered = computed(() => {
      const tree = _sidebarTreeRef!.tree;
      const found = tree.value.find(i => i.id === workspaceId.value);

      if (found) return found.childrens || [];
      if (workspaceId.value === 'shared') return tree.value.filter(i => i.data && i.data.shared);
      if (!_preferencesRef!.get('displayUncategorizedResources').value) return tree.value.filter(i => i.data && i.data.role != 4); // hide uncategorized
      return tree.value;
    });
  }

  return {
    filtered: _filtered,
    toggleSidebar,
    isOpened,
    hasSidebar,
    paneWidth: _paneWidth,
    isResizing,
    workspaceId,
    active_id,
  };
}
