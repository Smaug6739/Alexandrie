export default {
  actions: {
    cancel: '取消',
    extractFrontMatter: '將 front matter 擷取為中繼資料',
    importAll: '全部匯入',
    importing: '匯入中...',
    normalizeLineEndings: '正規化換行字元',
    optionsTitle: '匯入選項',
    preserveTimestamps: '保留原始時間戳記',
    skipExisting: '略過已存在的文件（僅匯入新文件）',
  },

  categories: {
    backup: {
      description: '還原包含文件與設定的完整 Alexandrie 備份。',
      title: '從備份匯入',
    },
    files: {
      description: '透過彈性的選項從 Markdown 檔案匯入文件。',
      title: '從檔案匯入',
    },
    folder: {
      description: '匯入整個資料夾（包含子資料夾與上傳檔案），並使用自訂選項取得最大的控制權。',
      title: '匯入資料夾',
    },
  },

  files: {
    importable: '你可以匯入 Markdown 檔案，或包含 Markdown 檔案的資料夾。資料夾會遞迴匯入；若選擇全部匯入，將保留原有的結構。',
    meta: {
      description: '快速匯入 Markdown 檔案，並可設定目的地與處理方式。',
      title: '從 Markdown 檔案匯入',
    },
    toImport: '待匯入的項目',
  },

  folder: {
    defaultColor: '匯入文件的預設顏色',
    defaultDescription: '匯入文件的預設描述',
    defaultIcon: '匯入文件的預設圖示（SVG 或 Unicode emoji）',
    defaultParent: '匯入文件的預設上層分類',
    defaultTags: '匯入文件的預設標籤（以逗號分隔）',
    defaultTheme: '匯入文件的預設主題',
    defaultThumbnail: '匯入文件的預設縮圖（SVG 或 Unicode emoji）',
    options: '進階匯入選項',
  },

  header: {
    changeFile: '變更檔案',
    created: '建立時間',
    documents: '文件',
    files: '檔案',
    metadata: '中繼資料',
    settings: '設定',
    title: '備份資訊',
    totalDocuments: '文件總數',
    totalSize: '總大小',
    version: '版本',
  },

  meta: {
    breadcrumb: '匯入',
    description: '你可以從先前的匯出檔匯入文件。如果你還沒有匯出檔，請前往',
    settingsLink: '設定',
    title: '匯入文件',
  },

  notifications: {
    importCompleteMessage: '文件已成功匯入。',
    importCompleteTitle: '匯入完成',
    importFailedMessage: '匯入過程中發生錯誤，請再試一次。',
    importFailedTitle: '匯入失敗',
    localImportedMessage: '你的本機設定已被備份內容取代。',
    localImportedTitle: '已匯入本機設定',
  },

  progress: {
    title: '匯入進度',
  },

  report: {
    empty: '沒有可顯示的已匯入項目。',
    startNew: '開始新的匯入',
    title: '匯入報告',
  },

  steps: {
    select: {
      analyzing: '分析中...',
      startImport: '開始匯入',
    },
  },

  summary: {
    documentsToUpdate: '待更新的文件',
    newDocuments: '新文件',
    title: '匯入摘要',
    unchanged: '未變更',
  },

  tabs: {
    backup: '備份',
    current: '目前',
    import: '匯入',
    importFromBackup: '從備份匯入',
    importLocalSettings: '匯入本機設定',
    importSelected: '匯入所選項目（{count}）',
    localSettings: '本機設定與偏好設定',
    localSettingsAvailable: '可匯入本機設定與偏好設定',
    localSettingsWarning: '這會覆蓋你目前的本機設定，包含程式碼片段',
    newDocuments: '新文件',
    noLocalSettings: '備份中找不到本機設定',
    noNewDocuments: '沒有可匯入的新文件',
    noUpdates: '沒有需要更新的文件',
    replaceLocalSettings: '要以備份內容取代你的本機設定嗎？',
    selectAll: '全選',
    updates: '更新',
    updateSelected: '更新所選項目（{count}）',
  },
};
