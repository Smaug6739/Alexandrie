/**
 * Sidebar UI State
 * Controls visibility, width, and active selection
 */
import type { TreeItem } from '../helpers/TreeBuilder';
import type { Node } from '~/stores';

export function useSidebar() {
  const { isMobile } = useDevice();
  const nodesTree = useNodesTree();
  const preferences = usePreferences();

  // UI State - using useState for SSR safety
  const isOpen = useState('sidebar-open', () => false);
  const hasSidebar = useState('sidebar-has', () => false);
  const isResizing = useState('sidebar-resizing', () => false);
  const paneWidth = useState('sidebar-width', () => (isMobile.value ? 340 : 390));
  const activeNodeId = useState<string | null>('sidebar-active', () => null);
  const workspaceId = useState<string | undefined>('sidebar-workspace', () => undefined);

  // Filtered tree based on current workspace and preferences
  const filtered = computed((): TreeItem<Node>[] => {
    const items = nodesTree.workspaceTree(workspaceId.value);
    if (!preferences.get('displayUncategorizedResources').value) {
      return items.filter(item => item.data.role !== 4);
    }
    return items;
  });

  const toggle = () => (isOpen.value = !isOpen.value);

  return {
    // UI State
    isOpened: isOpen,
    hasSidebar,
    paneWidth,
    isResizing,
    toggleSidebar: toggle,

    // Selection
    active_id: activeNodeId,
    workspaceId,

    // Filtered content
    filtered,
  };
}
