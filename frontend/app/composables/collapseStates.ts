/**
 * Collapse state management
 * Persists sidebar item expand/collapse states to localStorage
 */

const STORAGE_KEY = 'collapse-states';

function loadCollapseStates(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Global reactive state (shared across components)
const states = reactive<Record<string, boolean>>(loadCollapseStates());

function saveStates() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
}

/** Get collapse state for an item (defaults to expanded) */
export function getCollapseState(id: string): boolean {
  if (!(id in states)) states[id] = true;
  return states[id] ?? true;
}

/** Set collapse state for an item */
export function setCollapseState(id: string, value: boolean) {
  states[id] = value;
  saveStates();
}

/** Toggle collapse state for an item */
export function toggleCollapseState(id: string) {
  states[id] = !getCollapseState(id);
  saveStates();
}

/** Collapse all items */
export function collapseAllStates() {
  Object.keys(states).forEach(key => (states[key] = false));
  saveStates();
}

/** Access the raw reactive states object */
export function useCollapseStates() {
  return states;
}
