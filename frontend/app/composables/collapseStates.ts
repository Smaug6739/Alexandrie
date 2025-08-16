const STORAGE_KEY = 'collapse-states';

let collapseStateCache: Record<string, boolean> | null = null;

// Chargement depuis localStorage (une seule fois)
function loadCollapseStates(): Record<string, boolean> {
  if (!collapseStateCache) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      collapseStateCache = raw ? JSON.parse(raw) : {};
    } catch {
      collapseStateCache = {};
    }
  }
  return collapseStateCache!;
}

// Sauvegarde dans localStorage (entière map en une fois)
function saveCollapseStates() {
  if (collapseStateCache) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapseStateCache));
  }
}

export function collapseAllStates() {
  const states = loadCollapseStates();
  for (const key in states) {
    states[key] = false;
  }
  saveCollapseStates();
}

// Getter réactif
export function getCollapseState(id: string): Ref<boolean> {
  const states = loadCollapseStates();
  if (!(id in states)) states[id] = true; // défaut : ouvert
  return ref(states[id] ?? true);
}

// Setter (lié à la ref)
export function setCollapseState(id: string, value: boolean) {
  const states = loadCollapseStates();
  states[id] = value;
  saveCollapseStates();
}
