export interface Tab {
  path: string;
  name: string;
  id?: string;
}

const STORAGE_KEY = 'app-tabs';

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<Tab[]>([]);

  // Chargement initial depuis le localStorage (côté client uniquement)
  if (import.meta.client) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        tabs.value = JSON.parse(saved);
      } catch {
        tabs.value = [];
      }
    }
  }

  // Sauvegarde automatique à chaque modification de la liste
  watch(
    tabs,
    newTabs => {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTabs));
      }
    },
    { deep: true },
  );

  // Ajouter ou activer un onglet
  function syncTab(tab: Tab) {
    const exists = tabs.value.some(t => t.path === tab.path);
    if (!exists) {
      tabs.value.push(tab);
    }
  }

  // Fermer un onglet et retourner le prochain chemin à ouvrir si nécessaire
  function closeTab(path: string, currentPath: string): string | null {
    const index = tabs.value.findIndex(t => t.path === path);
    if (index === -1) return null;

    tabs.value.splice(index, 1);

    // Si on ferme l'onglet sur lequel on se trouve actuellement
    if (currentPath === path) {
      if (tabs.value.length > 0) {
        // On redirige vers l'onglet précédent, ou le premier disponible
        const nextTab = tabs.value[index - 1] || tabs.value[0];
        return nextTab!.path;
      }
      return '/dashboard/home'; // Route de secours par défaut
    }

    return null;
  }

  return {
    tabs,
    syncTab,
    closeTab,
  };
});
