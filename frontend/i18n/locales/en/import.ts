export default {
  actions: {
    cancel: 'Cancel',
    importAll: 'Import all',
    importing: 'Importing...',
    optionsTitle: 'Import options',
    preserveTimestamps: 'Preserve original timestamps',
    skipExisting: 'Skip existing documents (import only new ones)',
  },

  header: {
    changeFile: 'Change file',
    created: 'Created',
    documents: 'Documents',
    files: 'Files',
    metadata: 'Metadata',
    settings: 'Settings',
    title: 'Backup info',
    totalDocuments: 'Total documents',
    totalSize: 'Total size',
    version: 'Version',
  },

  meta: {
    breadcrumb: 'Imports',
    description:
      "You can import documents from a previous export. If you don't have one, create it from the",
    settingsLink: 'settings',
    title: 'Import documents',
  },

  notifications: {
    importCompleteMessage: 'Documents were imported successfully.',
    importCompleteTitle: 'Import complete',
    importFailedMessage: 'An error occurred during import. Please try again.',
    importFailedTitle: 'Import failed',
    localImportedMessage: 'Your local settings were replaced with the backup.',
    localImportedTitle: 'Local settings imported',
  },

  steps: {
    select: {
      analyzing: 'Analyzing...',
      startImport: 'Start import',
    },
  },

  summary: {
    documentsToUpdate: 'Documents to update',
    newDocuments: 'New documents',
    title: 'Import summary',
    unchanged: 'Unchanged',
  },

  tabs: {
    backup: 'Backup',
    current: 'Current',
    import: 'Import',
    importFromBackup: 'Import from backup',
    importLocalSettings: 'Import local settings',
    importSelected: 'Import selection ({count})',
    localSettings: 'Local settings and preferences',
    localSettingsAvailable: 'Local settings and preferences can be imported',
    localSettingsWarning: 'This will overwrite your current local settings, including snippets',
    newDocuments: 'New documents',
    noLocalSettings: 'No local settings found in the backup',
    noNewDocuments: 'No new documents to import',
    noUpdates: 'No documents to update',
    replaceLocalSettings: 'Replace your local settings with the backup?',
    selectAll: 'Select all',
    updates: 'Updates',
    updateSelected: 'Update selection ({count})',
  },
};
