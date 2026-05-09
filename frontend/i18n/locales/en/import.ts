export default {
  actions: {
    cancel: 'Cancel',
    importAll: 'Import all',
    importing: 'Importing...',
    optionsTitle: 'Import options',
    extractFrontMatter: 'Extract front matter as metadata',
    normalizeLineEndings: 'Normalize line endings',
    preserveTimestamps: 'Preserve original timestamps',
    skipExisting: 'Skip existing documents (import only new ones)',
  },

  advanced: {
    options: 'Advanced import options',
    defaultDescription: 'Default description for imported documents',
    defaultTags: 'Default tags for imported documents (comma-separated)',
    defaultColor: 'Default color for imported documents',
    defaultThumbnail: 'Default thumbnail for imported documents (svg or unicode emoji)',
    defaultIcon: 'Default icon for imported documents (svg or unicode emoji)',
    defaultTheme: 'Default theme for imported documents',
  },

  files: {
    meta: {
      title: 'Import from markdown files',
      description: 'Quickly import markdown files with options for destination and processing.',
    },
    importable:
      'You can import markdown files or a folder containing markdown files. Folders will be imported recursively, preserving their structure if you choose import all option.',
    toImport: 'Items to import',
  },

  categories: {
    backup: {
      title: 'Import from backup',
      description: 'Restore a complete Alexandrie backup with documents and settings.',
    },
    files: {
      title: 'Import from files',
      description: 'Import documents from markdown files with flexible options.',
    },
    advanced: {
      title: 'Advanced import',
      description: 'Import documents using custom options for maximum control.',
    },
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
    description: "You can import documents from a previous export. If you don't have one, create it from the",
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
