export default {
  actions: {
    cancel: '取消',
    extractFrontMatter: '将 front matter 提取为元数据',
    importAll: '全部导入',
    importing: '导入中...',
    normalizeLineEndings: '规范化换行符',
    optionsTitle: '导入选项',
    preserveTimestamps: '保留原始时间戳',
    skipExisting: '跳过已存在的文档（仅导入新文档）',
  },

  folder: {
    defaultColor: '导入文档的默认颜色',
    defaultDescription: '导入文档的默认描述',
    defaultIcon: '导入文档的默认图标（SVG 或 Unicode emoji）',
    defaultParent: '导入文档的默认上级分类',
    defaultTags: '导入文档的默认标签（以逗号分隔）',
    defaultTheme: '导入文档的默认主题',
    defaultThumbnail: '导入文档的默认缩略图（SVG 或 Unicode emoji）',
  },

  files: {
    meta: {
      title: '从 Markdown 文件导入',
      description: '快速导入 Markdown 文件，并可设置目的地与处理方式。',
    },
    importable: '你可以导入 Markdown 文件，或包含 Markdown 文件的文件夹。文件夹会递归导入；若选择全部导入，将保留原有的结构。',
    toImport: '待导入的项目',
  },

  categories: {
    advanced: {
      description: '导入整个文件夹（包含子文件夹与上传文件），并使用自定义选项获取最大的控制权。',
      title: '高级导入',
    },
    backup: {
      description: '恢复包含文档与设置的完整 Alexandrie 备份。',
      title: '从备份导入',
    },
    files: {
      description: '通过灵活的选项从 Markdown 文件导入文档。',
    },
    advanced: {
      title: '高级导入',
      description: '导入整个文件夹（包含子文件夹与上传文件），并使用自定义选项获取最大的控制权。',
    },
    toImport: '待导入的项目',
  },

  header: {
    changeFile: '修改文件',
    created: '创建时间',
    documents: '文档',
    files: '文件',
    metadata: '元数据',
    settings: '设置',
    title: '备份信息',
    totalDocuments: '文档总数',
    totalSize: '总大小',
    version: '版本',
  },

  meta: {
    breadcrumb: '导入',
    description: '你可以从先前的导出档导入文档。如果你还没有导出档，请前往',
    settingsLink: '设置',
    title: '导入文档',
  },

  notifications: {
    importCompleteMessage: '文档已成功导入。',
    importCompleteTitle: '导入完成',
    importFailedMessage: '导入过程中发生错误，请再试一次。',
    importFailedTitle: '导入失败',
    localImportedMessage: '你的本地设置已被备份内容替换。',
    localImportedTitle: '已导入本地设置',
  },

  progress: {
    title: '导入进度',
  },

  steps: {
    select: {
      analyzing: '分析中...',
      startImport: '开始导入',
    },
  },

  summary: {
    documentsToUpdate: '待更新的文档',
    newDocuments: '新文档',
    title: '导入摘要',
    unchanged: '未修改',
  },

  tabs: {
    backup: '备份',
    current: '当前',
    import: '导入',
    importFromBackup: '从备份导入',
    importLocalSettings: '导入本地设置',
    importSelected: '导入所选项目（{count}）',
    localSettings: '本地设置与偏好设置',
    localSettingsAvailable: '可导入本地设置与偏好设置',
    localSettingsWarning: '这会覆盖你当前的本地设置，包含代码片段',
    newDocuments: '新文档',
    noLocalSettings: '备份中找不到本地设置',
    noNewDocuments: '没有可导入的新文档',
    noUpdates: '没有需要更新的文档',
    replaceLocalSettings: '要以备份内容替换你的本地设置吗？',
    selectAll: '全选',
    updates: '更新',
    updateSelected: '更新所选项目（{count}）',
  },
};
