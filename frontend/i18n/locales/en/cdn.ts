export default {
  actions: {
    download: 'Download file',
    upload: {
      idle: 'Upload',
      multiple: 'Upload {n} file | Upload {n} files',
      progress: 'Uploading {n} / {total}',
    },
  },

  appdrop: {
    addMore: 'Add more files',
    link: 'click here',
    max: 'Maximum {n} files',
    prompt: 'Drag and drop your file here or {link} to select',
    promptPlural: 'Drag and drop your files here or {link} to select',
    removeFile: 'Remove file',
  },

  edit: {
    description: 'Manage resources and files on the server. You can edit metadata and delete files.',
    title: 'Update file',
  },

  labels: {
    originalPath: 'Original path',
    path: 'Path',
  },

  meta: {
    shortTitle: 'CDN',
    title: 'File manager',
  },

  notifications: {
    error: 'Upload failed for {file}: {error}',
    successMsg: '{n} file uploaded successfully | {n} files uploaded successfully',
    successTitle: 'Upload complete',
  },

  page: {
    empty: 'No files uploaded yet.',
  },

	preview: {
    title: 'Preview',
    unavailable: 'Preview not available for this file type',
  },

  storageUsed: 'Storage used',
};
