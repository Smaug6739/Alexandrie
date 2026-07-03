import { toRaw } from 'vue';
import localForage from 'localforage';

const COLLAPSE_STORAGE_KEY = 'collapse-states';

// ─── LE SINGLETON VIT ICI DE MANIÈRE UNIQUE ───
let isInitializing = false;
let resolveReady: () => void;

const untilReady = new Promise<void>(resolve => {
  resolveReady = resolve;
});

let states: Ref<Record<string, boolean>> | null = null;

function getStatesRef() {
  if (!states) {
    states = useState<Record<string, boolean>>(COLLAPSE_STORAGE_KEY, () => ({}));
  }
  return states;
}

async function init() {
  if (isInitializing) return;
  isInitializing = true;

  console.log('🌳 [CollapseStore] Initializing store...');

  if (import.meta.server) {
    resolveReady();
    return;
  }

  try {
    const savedStates = await localForage.getItem<Record<string, boolean>>(COLLAPSE_STORAGE_KEY);
    if (savedStates) {
      getStatesRef().value = savedStates;
    }
  } catch (e) {
    console.warn('[CollapseStore] Failed to load collapse states', e);
  } finally {
    resolveReady();
    console.log('🌳 [CollapseStore] Store is ready !');
  }
}

if (import.meta.client) {
  init();
} else {
  if (typeof resolveReady! === 'function') resolveReady();
}

export function useCollapseStore() {
  const sharedStates = getStatesRef();

  function save() {
    if (import.meta.server) return;
    localForage.setItem(COLLAPSE_STORAGE_KEY, toRaw(sharedStates.value)).catch(e => {
      console.error('[CollapseStore] Failed to save states', e);
    });
  }

  return {
    untilReady, // Partagé par tous les appels
    isExpanded: (id: string) => {
      const state = sharedStates.value[id];
      if (state === undefined) {
        sharedStates.value[id] = true;
        return true;
      }
      return state;
    },
    setExpanded: (id: string, value: boolean) => {
      sharedStates.value[id] = value;
      save();
    },
    toggle: (id: string) => {
      const currentState = sharedStates.value[id] ?? true;
      sharedStates.value[id] = !currentState;
      save();
    },
    setAll: (expanded: boolean) => {
      Object.keys(sharedStates.value).forEach(key => {
        sharedStates.value[key] = expanded;
      });
      save();
    },
    isAllCollapsed: () => {
      return Object.values(sharedStates.value).every(v => v === false);
    },
  };
}
