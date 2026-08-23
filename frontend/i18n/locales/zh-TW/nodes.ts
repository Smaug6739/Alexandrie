export default {
  actions: {
    copyPublicLink: '複製公開連結',
    editMeta: '編輯中繼資料',
    exportAsMarkdown: '匯出為 Markdown',
    managePermissions: '管理權限',
    newDocument: '+ 建立新文件',
    publicLink: '公開連結',
    removeFromShared: '從共用中移除',
    resetBoard: '重設看板',
    share: '分享',
  },
  category: {
    editTitle: '分類與工作區',
    iconHint: '支援 SVG',
    name: '分類',
    new: '新增分類',
    notifications: {
      created: '已成功建立分類',
      creationError: '建立分類時發生錯誤',
      updated: '分類已更新',
    },
    orderHint: '分類在側邊欄中的排序',
    uncategorized: '未分類',
  },

  container: {
    createNewDocument: '+ 建立新文件',
    import: '匯入',
    newCategory: '+ 分類',
    newWorkspace: '+ 工作區',
    noDocuments: '找不到文件',
    noDocumentsDescription: '此分類中沒有任何文件',
    noWorkspaces: '找不到工作區或分類',
    searchPlaceholder: '搜尋工作區...',
    title: '工作區與分類',
  },

  document: {
    childs: '子文件',
    editPage: '編輯頁面',
    lastUpdated: '最後更新',
    nextPage: '下一頁',
    prevPage: '上一頁',
    TOC: '目錄',
  },

  filter: {
    footer: '{count} / {total} 個符合項目',
    title: '篩選節點',
    toClose: '以關閉',
  },

  modals: {
    delete: {
      bulkCount: '此操作將刪除 {count} 個節點。',
      confirm: '你確定要刪除這個{type}嗎？',
      confirmBulk: '你確定要刪除所選的節點嗎？',
      hasChildren: '此{type}有 {count} 個子文件，這些文件也會一併刪除。',
      irreversible: '此操作無法復原',
      title: '刪除{type}',
      titleBulk: '刪除節點',
    },
    join: {
      access: '節點存取權',
      inputPlaceholder: 'ABC123 或 https://.../join-workspace?code=ABC123',
      join: '加入',
      joining: '加入中...',
      label: '邀請碼或連結',
      subtitle: '貼上邀請碼或完整的邀請連結。如果你已用其他權限等級加入過這個工作區，系統只會保留最高的權限。',
      title: '加入團隊或工作區',
    },
    metadata: {
      emojiOrIcon: 'Emoji 或圖示',
      emojiOrIconHint: '支援 SVG 或 emoji',
      labelAppearance: '外觀',
      labelMedia: '媒體',
      labelOrganization: '組織',
      pinDescription: '將此文件釘選至工作區頂端',
      thumbnail: '縮圖',
      thumbnailHint: '支援 SVG',
      title: '中繼資料',
    },
    permissions: {
      addPermission: '新增',
      defaultPermission: '新使用者的預設權限',
      generalAccess: '一般存取權',
      inviteCreate: '建立邀請',
      inviteCreateProgress: '正在建立邀請...',
      inviteEmpty: '尚無邀請',
      inviteLabel: '節點邀請',
      invitePermission: '權限',
      managePermissions: '管理權限',
      noPermissions: '尚未設定權限',
      noResults: '找不到結果',
      publicInfo: '此文件將可透過專屬網址公開存取。',
      removePermission: '移除權限',
      searchPlaceholder: '使用者名稱或電子郵件',
      searchUser: '搜尋使用者',
      shareLink: '分享這個連結，讓任何人不需帳號即可檢視文件：',
      title: '管理權限',
    },
    removeShared: {
      childWarning: '此文件有 {count} 個子文件，這些文件也會一併移除。',
      confirm: '你確定要移除這個文件嗎？',
      noAccess: '執行此操作後，你將無法再存取這個文件。',
      success: '文件已移除',
      title: '移除此文件',
    },
  },

  nodes: '節點',

  notifications: {
    linkCopied: '已複製連結到剪貼簿',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: '你想要做什麼？',
    actionCreateDocument: '建立新文件',
    actionCreateDocumentDesc: '使用分享的內容建立新的 Markdown 文件',
    actionUploadResource: '上傳為資源',
    actionUploadResourceDesc: '將分享的內容上傳為資源（圖片、PDF 等），並取得可插入文件的連結',
    chooseDestination: '選擇要將此內容儲存到哪裡。',
    description: '從其他應用程式接收到的內容。',
    sharedContent: '分享的內容',
    title: '分享內容',
  },

  tags: '標籤',

  types: {
    category: '分類',
    document: '文件',
    resource: '資源',
    workspace: '工作區',
  },

  workspace: {
    all: '所有工作區',
    new: '新增工作區',
    shared: '與我共用',
  },
};
