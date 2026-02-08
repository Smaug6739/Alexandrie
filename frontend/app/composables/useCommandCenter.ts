import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import CommandCenter from '~/components/CommandCenter/index.vue';

type TabType = 'quick' | 'advanced';

interface CommandCenterState {
  searchQuery: string;
  selectedIndex: number;
  activeTab: TabType;
}

// Singleton state shared across all component instances
const state = reactive<CommandCenterState>({
  searchQuery: '',
  selectedIndex: 0,
  activeTab: 'quick',
});

let isInitialized = false;

export function useCommandCenter() {
  const router = useRouter();
  const modalManager = useModal();
  const modal = new Modal(shallowRef(CommandCenter), { noPadding: true, onClose: afterClose });

  // --- Methods ---
  function open() {
    state.selectedIndex = 0;
    state.searchQuery = '';
    state.activeTab = 'quick';
    modalManager.add(modal);
  }

  function close() {
    modalManager.close(modal);
  }

  function afterClose() {
    state.searchQuery = '';
    state.selectedIndex = 0;
  }

  function changeTab(tabId: TabType) {
    state.activeTab = tabId;
    state.selectedIndex = 0;
  }

  function setSearchQuery(query: string) {
    state.searchQuery = query;
    state.selectedIndex = 0;
  }

  function setSelectedIndex(index: number) {
    state.selectedIndex = index;
  }

  // --- Global keyboard shortcuts handler ---
  function handleGlobalKeydown(e: KeyboardEvent) {
    if (e.key === '/') {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isTyping) return;
      e.preventDefault();
      return open();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      return open();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      return router.push('/dashboard/cdn');
    }
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      return router.push('/dashboard/docs/new');
    }
    if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      return useModal().add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
    }
  }

  // --- Initialize global listeners (called once) ---
  function initGlobalListeners() {
    if (isInitialized) return;
    isInitialized = true;

    document.addEventListener('keydown', handleGlobalKeydown);
    window.addEventListener('command-center-open', open as EventListener);
  }

  // --- Cleanup global listeners ---
  function destroyGlobalListeners() {
    isInitialized = false;
    document.removeEventListener('keydown', handleGlobalKeydown);
    window.removeEventListener('command-center-open', open as EventListener);
  }

  return {
    // State (readonly for external access)
    searchQuery: computed(() => state.searchQuery),
    selectedIndex: computed(() => state.selectedIndex),
    activeTab: computed(() => state.activeTab),

    // Methods
    open,
    close,
    changeTab,
    setSearchQuery,
    setSelectedIndex,

    // Lifecycle
    initGlobalListeners,
    destroyGlobalListeners,
  };
}
