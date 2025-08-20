import { reactive } from 'vue';

const STORAGE_KEY = 'collapse-states';

// Chargement initial
function loadCollapseStates(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// État réactif global
const states = reactive<Record<string, boolean>>(loadCollapseStates());

function saveStates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

// --- API publique ---

export function getCollapseState(id: string): boolean {
  if (!(id in states)) states[id] = true; // par défaut: open
  return states[id] ?? true;
}

export function setCollapseState(id: string, value: boolean) {
  states[id] = value;
  saveStates();
}

export function toggleCollapseState(id: string) {
  states[id] = !getCollapseState(id);
  saveStates();
}

export function collapseAllStates() {
  Object.keys(states).forEach(key => (states[key] = false));
  saveStates();
}

export function useCollapseStates() {
  return states;
}
