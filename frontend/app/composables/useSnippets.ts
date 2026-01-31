/**
 * Snippets management composable
 * Handles CRUD operations, import/export, and filtering
 */

export interface Snippet {
  id: string;
  label: string;
}

export function useSnippets() {
  const preferences = usePreferences();
  const notifications = useNotifications();
  const snippets = preferences.get('snippets');

  // State
  const search = ref('');
  const editingId = ref<string | null>(null);
  const editBuffer = ref<Snippet>({ id: '', label: '' });
  const selectedIds = ref<Set<string>>(new Set());

  // Filtered & sorted snippets
  const filtered = computed(() => {
    const q = search.value.toLowerCase().trim();
    if (!q) return snippets.value;
    return snippets.value.filter(s => s.id.toLowerCase().includes(q) || s.label.toLowerCase().includes(q));
  });

  // Selection helpers
  const isSelected = (id: string) => selectedIds.value.has(id);
  const toggleSelect = (id: string) => {
    if (selectedIds.value.has(id)) {
      selectedIds.value.delete(id);
    } else {
      selectedIds.value.add(id);
    }
    selectedIds.value = new Set(selectedIds.value); // Trigger reactivity
  };
  const selectAll = () => {
    filtered.value.forEach(s => selectedIds.value.add(s.id));
    selectedIds.value = new Set(selectedIds.value);
  };
  const deselectAll = () => {
    selectedIds.value.clear();
    selectedIds.value = new Set();
  };
  const isAllSelected = computed(() => filtered.value.length > 0 && filtered.value.every(s => selectedIds.value.has(s.id)));

  // Validation
  const isDuplicate = (id: string, excludeOriginal?: string) => {
    return snippets.value.some(s => s.id === id && s.id !== excludeOriginal);
  };

  // CRUD
  const add = (snippet: Snippet): boolean => {
    if (!snippet.id.trim() || isDuplicate(snippet.id)) {
      notifications.add({ title: 'Invalid or duplicate shortcut', type: 'error' });
      return false;
    }
    snippets.value = [snippet, ...snippets.value];
    preferences.set('snippets', snippets.value);
    notifications.add({ title: 'Snippet added', type: 'success' });
    return true;
  };

  const update = (originalId: string, updated: Snippet): boolean => {
    if (!updated.id.trim() || isDuplicate(updated.id, originalId)) {
      notifications.add({ title: 'Invalid or duplicate shortcut', type: 'error' });
      return false;
    }
    const idx = snippets.value.findIndex(s => s.id === originalId);
    if (idx !== -1) {
      snippets.value[idx] = { ...updated };
      snippets.value = [...snippets.value];
      preferences.set('snippets', snippets.value);
    }
    return true;
  };

  const remove = (id: string) => {
    snippets.value = snippets.value.filter(s => s.id !== id);
    preferences.set('snippets', snippets.value);
    selectedIds.value.delete(id);
    selectedIds.value = new Set(selectedIds.value);
  };

  const removeSelected = () => {
    const count = selectedIds.value.size;
    snippets.value = snippets.value.filter(s => !selectedIds.value.has(s.id));
    preferences.set('snippets', snippets.value);
    deselectAll();
    notifications.add({ title: `${count} snippet(s) deleted`, type: 'success' });
  };

  const restoreDefaults = () => {
    snippets.value = [...DEFAULT_PREFERENCES.snippets];
    preferences.set('snippets', snippets.value);
    deselectAll();
    notifications.add({ title: 'Defaults restored', type: 'success' });
  };

  // Edit helpers
  const startEdit = (snippet: Snippet) => {
    editingId.value = snippet.id;
    editBuffer.value = { ...snippet };
  };

  const cancelEdit = () => {
    editingId.value = null;
    editBuffer.value = { id: '', label: '' };
  };

  const saveEdit = (): boolean => {
    if (!editingId.value) return false;
    const success = update(editingId.value, editBuffer.value);
    if (success) cancelEdit();
    return success;
  };

  // Import/Export
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(snippets.value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alexandrie-snippets.json';
    a.click();
    URL.revokeObjectURL(url);
    notifications.add({ title: 'Snippets exported', type: 'success' });
  };

  const importJSON = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (!Array.isArray(data)) throw new Error('Invalid format');

          const existingIds = new Set(snippets.value.map(s => s.id));
          const newSnippets = data.filter((s: unknown) => {
            const snippet = s as Snippet;
            return snippet?.id && snippet?.label && !existingIds.has(snippet.id);
          });

          snippets.value = [...snippets.value, ...newSnippets];
          preferences.set('snippets', snippets.value);
          resolve(newSnippets.length);
        } catch {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  /**
   * Import dictionary from text file (Google Dictionary format)
   * Format: one word/phrase per line, or "shortcut:content" per line
   */
  const importDictionary = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = e.target?.result as string;
          const lines = text.split(/\r?\n/).filter(l => l.trim());

          const existingIds = new Set(snippets.value.map(s => s.id));
          const newSnippets: Snippet[] = [];

          for (const line of lines) {
            // Format: "shortcut:content" or just "word" (word becomes both shortcut and content)
            const colonIdx = line.indexOf(':');
            let id: string;
            let label: string;

            if (colonIdx > 0) {
              id = line.slice(0, colonIdx).trim();
              label = line.slice(colonIdx + 1).trim();
            } else {
              const word = line.trim();
              id = word.toLowerCase().replace(/\s+/g, '_');
              label = word;
            }

            if (id && label && !existingIds.has(id)) {
              newSnippets.push({ id, label });
              existingIds.add(id);
            }
          }

          snippets.value = [...snippets.value, ...newSnippets];
          preferences.set('snippets', snippets.value);
          resolve(newSnippets.length);
        } catch {
          reject(new Error('Failed to parse dictionary'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Clear search when it changes
  watch(search, () => deselectAll());

  return {
    // State
    snippets: filtered,
    allSnippets: snippets,
    search,
    editingId,
    editBuffer,
    selectedIds,
    selectedCount: computed(() => selectedIds.value.size),

    // Selection
    isSelected,
    toggleSelect,
    selectAll,
    deselectAll,
    isAllSelected,

    // CRUD
    add,
    update,
    remove,
    removeSelected,
    restoreDefaults,

    // Edit
    startEdit,
    cancelEdit,
    saveEdit,
    isDuplicate,

    // Import/Export
    exportJSON,
    importJSON,
    importDictionary,
  };
}
