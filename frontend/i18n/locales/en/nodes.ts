export default {
  actions: {
    editMeta: 'Edit metadata',
    exportAsMarkdown: 'Export as Markdown',
    managePermissions: 'Manage permissions',
    newDocument: '+ Create new document',
    publicLink: 'Public link',
    removeFromShared: 'Remove from shared',
    resetBoard: 'Reset board',
  },

  category: {
    editTitle: 'Category & workspace',
    iconHint: 'SVG supported',
    name: 'Category | Categories',
    new: 'New category',
    notifications: {
      created: 'Category created successfully',
      creationError: 'Error creating category',
      updated: 'Category updated',
    },
    orderHint: 'Category order in the sidebar',
    uncategorized: 'Uncategorized',
  },

  container: {
    createNewDocument: '+ Create new document',
    import: 'Import',
    newCategory: '+ Category',
    newWorkspace: '+ Workspace',
    noDocuments: 'No documents found',
    noDocumentsDescription: 'There are no documents in this category',
    noWorkspaces: 'No workspace or category found',
    searchPlaceholder: 'Search a workspace...',
    title: 'Workspaces & Categories',
  },

  document: {
    childs: 'Child documents',
    editPage: 'Edit page',
    lastUpdated: 'Last updated',
    nextPage: 'Next page',
    prevPage: 'Previous page',
    TOC: 'Table of contents',
  },

  filter: {
    footer: '{count} / {total} matches',
    title: 'Filter nodes',
    toClose: 'to close',
  },

  modals: {
    delete: {
      bulkCount: 'This action will delete {count} nodes.',
      confirm: 'Are you sure you want to delete this {type}?',
      confirmBulk: 'Are you sure you want to delete the selected nodes?',
      hasChildren: 'This {type} has {count} child documents. They will also be deleted.',
      irreversible: 'This action is irreversible',
      title: 'Delete {type}',
      titleBulk: 'Delete nodes',
    },
    metadata: {
      emojiOrIcon: 'Emoji or icon',
      emojiOrIconHint: 'SVG or emojis supported',
      thumbnail: 'Thumbnail',
      thumbnailHint: 'SVG supported',
      title: 'Metadata',
    },
    permissions: {
      addPermission: 'Add',
      defaultPermission: 'Default permission for new users',
      generalAccess: 'General access',
      managePermissions: 'Manage permissions',
      noPermissions: 'No permission set',
      noResults: 'No results found',
      publicInfo: 'This document will be publicly accessible via a unique URL.',
      removePermission: 'Remove permission',
      searchPlaceholder: 'Username or email',
      searchUser: 'Search a user',
      shareLink: 'Share this link to let anyone view the document without an account:',
      title: 'Manage permissions',
    },
    removeShared: {
      childWarning: 'This document has {count} child document(s). They will also be removed.',
      confirm: 'Are you sure you want to remove this document?',
      noAccess: 'After this action you will no longer have access to this document.',
      success: 'Document removed',
      title: 'Remove this document',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'What do you want to do?',
    actionCreateDocument: 'Create new document',
    actionCreateDocumentDesc: 'Create a new Markdown document with the shared content',
    actionUploadResource: 'Upload as a resource',
    actionUploadResourceDesc: 'Upload the shared content as a resource (image, PDF, etc.) and get a link to insert into your documents',
    chooseDestination: 'Choose where you want to save this content.',
    description: 'Content received from another app.',
    sharedContent: 'Shared content',
    title: 'Share content',
  },

  tags: 'Tags',

  types: {
    category: 'Category | Categories',
    document: 'Document | Documents',
    resource: 'Resource',
    workspace: 'Workspace',
  },

  workspace: {
    all: 'All workspaces',
    new: 'New workspace',
    shared: 'Shared with me',
  },
};
