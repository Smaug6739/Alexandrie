import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import CommandCenter from '~/components/CommandCenter/index.vue';

type TabType = 'quick' | 'advanced';

interface CommandCenterState {
  searchQuery: string;
  selectedIndex: number;
  activeTab: TabType;
  isOpen: boolean;
}

const state = reactive<CommandCenterState>({
  searchQuery: '',
  selectedIndex: 0,
  activeTab: 'quick',
  isOpen: false,
});

let isInitialized = false;

// Singleton modal instance
let modal: Modal | null = null;

function reset() {
  state.searchQuery = '';
  state.selectedIndex = 0;
  state.activeTab = 'quick';
  state.isOpen = false;
}

function getModal() {
  if (!modal) {
    modal = new Modal(shallowRef(CommandCenter), { noPadding: true, onClose: reset });
  }
  return modal;
}

export function useCommandCenter() {
  const router = useRouter();
  const modalManager = useModal();

  function open() {
    if (state.isOpen) return;
    reset();
    state.isOpen = true;
    modalManager.add(getModal());
  }

  function close() {
    if (!state.isOpen) return;
    modalManager.close(getModal());
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

  // --- Global keyboard shortcuts ---
  function handleGlobalKeydown(e: KeyboardEvent) {
    const target = e.target as HTMLElement;
    const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if (e.key === '/' && !isTyping) {
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
      return modalManager.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
    }
  }

  function initGlobalListeners() {
    if (isInitialized) return;
    isInitialized = true;

    document.addEventListener('keydown', handleGlobalKeydown);
  }

  function destroyGlobalListeners() {
    if (!isInitialized) return;
    isInitialized = false;

    document.removeEventListener('keydown', handleGlobalKeydown);
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
