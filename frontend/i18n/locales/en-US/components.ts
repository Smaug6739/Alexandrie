export default {
  commandCenter: {
    advanced: {
      allCategories: 'All categories',
      category: 'Category',
      clear: 'Clear',
      created: 'Created',
      dateRange: 'Date range',
      from: 'From',
      modified: 'Modified',
      searchInContent: 'Search in content',
      searchInContentHint: 'Search within document body (full-word search required)',
      tags: 'Tags',
      title: 'Advanced filters',
      to: 'To',
    },
    beta: 'Beta',
    close: 'Close',
    navigate: 'Navigate',
    noResults: 'No results for "{query}"',
    searchPlaceholder: 'Search for a page, action or document...',
    sections: {
      documents: 'Documents',
      pagesAndActions: 'Pages & actions',
    },
    select: 'Select',
    switchTabs: 'Switch tabs',
    tabs: {
      advanced: 'Advanced',
      quick: 'Quick',
    },
  },

  dataTable: {
    rowsPerPage: 'Rows per page',
    searchPlaceholder: 'Search...',
    showing: 'Showing {start} to {end} of {total} entries',
  },

  kanban: {
    addColumn: 'Add column',
    addDocument: 'Add document',
    changeColor: 'Change color',
    deleteColumn: 'Delete column',
    deleteColumnModal: {
      confirm: 'Are you sure you want to delete the "{title}" column?',
      emptyColumn: 'This column is empty.',
      hasDocuments: 'This column contains {count} document(s). They will be moved to the first column.',
      title: 'Delete column',
    },
    dragHere: 'Drag documents here',
    editName: 'Edit name',
    noDocuments: 'No documents',
    resetBoard: {
      confirm: 'Are you sure you want to reset the Kanban board?',
      reset: 'Reset',
      title: 'Reset Kanban board',
      warning: 'This action is irreversible. All columns will be removed and cards moved to the first column.',
    },
  },

  navbar: {
    commandCenter: 'Command Center (Ctrl+K)',
    searchHint: 'Press {key} to navigate',
  },

  noContent: {
    nothingHere: 'Nothing to display here',
  },

  sessionCard: {
    current: 'Current',
    inactive: 'Inactive',
    lastActivity: 'Last activity',
    loggedOut: 'Logged out',
    login: 'Login',
    unknownIP: 'Unknown IP',
    unknownLocation: 'Unknown location',
    userAgent: 'User agent',
  },

  sidebar: {
    allWorkspaces: 'All workspaces',
    closeAll: 'Close all',
    editWorkspace: 'Edit workspace',
    nav: {
      cdn: 'CDN',
      documents: 'Documents',
      home: 'Home',
      imports: 'Imports',
      manageCategories: 'Manage categories',
      newPage: 'New page',
      settings: 'Settings',
    },
    newCategory: 'New category',
    newDoc: 'New doc',
    newWorkspace: 'New workspace',
    noWorkspaces: 'No workspaces found',
    openAll: 'Open all',
    searchPlaceholder: 'Search or ctrl + q',
    sharedWithMe: 'Shared with me',
    toggleDock: 'Toggle dock',
    workspaces: 'Workspaces',
  },

  tagInput: {
    placeholder: 'Press Enter to add a tag',
  },

  viewSelection: {
    kanban: 'Kanban',
    list: 'List',
    table: 'Table',
  },
} as const;
