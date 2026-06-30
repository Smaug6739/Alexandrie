const ACTIVE_MARK_IDS = ['security-2fa', 'new-imports', 'teams', 'v8.10.0', 'workspace-sharing'] as const;

export type MarkId = (typeof ACTIVE_MARK_IDS)[number];

let isGcExecuted = false;
async function runGarbageCollector(preferencesStore: ReturnType<typeof usePreferencesStore>) {
  if (isGcExecuted) return;
  isGcExecuted = true;

  await preferencesStore.untilReady;

  const currentSaved = preferencesStore.preferences.readAnnouncements || [];

  const cleaned = currentSaved.filter(id => ACTIVE_MARK_IDS.includes(id as MarkId));

  if (cleaned.length !== currentSaved.length) {
    preferencesStore.set('readAnnouncements', cleaned);
  }
}

export function useMark() {
  const preferencesStore = usePreferencesStore();

  // Lancement du GC uniquement côté client au montage
  if (import.meta.client) {
    onMounted(() => {
      runGarbageCollector(preferencesStore);
    });
  }

  return {
    hasMark: (id?: MarkId): boolean => {
      if (!id || !ACTIVE_MARK_IDS.includes(id)) return false;

      const list = preferencesStore.preferences.readAnnouncements || [];
      return !list.includes(id);
    },

    dismissMark: (id: MarkId) => {
      if (!ACTIVE_MARK_IDS.includes(id)) return;

      const currentList = preferencesStore.preferences.readAnnouncements || [];

      if (currentList.includes(id)) return;

      // Ajout et sauvegarde via le store de préférences
      const newList = [...currentList, id];
      preferencesStore.set('readAnnouncements', newList);
    },
  };
}
