export default {
  actions: {
    copyPublicLink: '复制公开链接',
    editMeta: '编辑元数据',
    exportAsMarkdown: '导出为 Markdown',
    managePermissions: '管理权限',
    newDocument: '+ 创建新文档',
    publicLink: '公开链接',
    removeFromShared: '从共享中移除',
    resetBoard: '重置看板',
    share: '分享',
  },
  category: {
    editTitle: '分类与工作区',
    iconHint: '支持 SVG',
    name: '分类',
    new: '新增分类',
    notifications: {
      created: '已成功创建分类',
      creationError: '创建分类时发生错误',
      updated: '分类已更新',
    },
    orderHint: '分类在侧边栏中的排序',
    uncategorized: '未分类',
  },

  container: {
    createNewDocument: '+ 创建新文档',
    import: '导入',
    newCategory: '+ 分类',
    newWorkspace: '+ 工作区',
    noDocuments: '找不到文档',
    noDocumentsDescription: '此分类中没有任何文档',
    noWorkspaces: '找不到工作区或分类',
    searchPlaceholder: '搜索工作区...',
    title: '工作区与分类',
  },

  document: {
    childs: '子文档',
    editPage: '编辑页面',
    lastUpdated: '最后更新',
    nextPage: '下一页',
    prevPage: '上一页',
    TOC: '目录',
  },

  filter: {
    footer: '{count} / {total} 个匹配项',
    title: '筛选节点',
    toClose: '以关闭',
  },

  modals: {
    delete: {
      bulkCount: '此操作将删除 {count} 个节点。',
      confirm: '你确定要删除这个{type}吗？',
      confirmBulk: '你确定要删除所选的节点吗？',
      hasChildren: '此{type}有 {count} 个子文档，这些文档也会一并删除。',
      irreversible: '此操作无法撤销',
      title: '删除{type}',
      titleBulk: '删除节点',
    },
    join: {
      access: '节点访问权限',
      helperText: '在继续之前需要邀请码或链接。',
      inputPlaceholder: 'ABC123 或 https://.../join-workspace?code=ABC123',
      join: '加入',
      joining: '加入中...',
      label: '邀请码或链接',
      subtitle: '粘贴邀请码或完整的邀请链接。如果你已用其他权限等级加入过这个工作区，系统只会保留最高的权限。',
      title: '加入团队或工作区',
    },
    metadata: {
      emojiOrIcon: 'Emoji 或图标',
      emojiOrIconHint: '支持 SVG 或 emoji',
      labelAppearance: '外观',
      labelMedia: '媒体',
      labelOrganization: '组织',
      pinDescription: '将此文档置顶至工作区顶部',
      thumbnail: '缩略图',
      thumbnailHint: '支持 SVG',
      title: '元数据',
    },
    permissions: {
      addPermission: '新增',
      defaultPermission: '新用户的默认权限',
      generalAccess: '常规访问权限',
      inviteCreate: '创建邀请',
      inviteCreateProgress: '正在创建邀请...',
      inviteEmpty: '尚无邀请',
      inviteLabel: '节点邀请',
      invitePermission: '权限',
      managePermissions: '管理权限',
      noPermissions: '尚未设置权限',
      noResults: '找不到结果',
      publicInfo: '此文档将可通过专属网址公开访问。',
      removePermission: '移除权限',
      searchPlaceholder: '用户名或电子邮件',
      searchUser: '搜索用户',
      shareLink: '分享这个链接，让任何人不需账号即可查看文档：',
      title: '管理权限',
    },
    removeShared: {
      childWarning: '此文档有 {count} 个子文档，这些文档也会一并移除。',
      confirm: '你确定要移除这个文档吗？',
      noAccess: '执行此操作后，你将无法再访问这个文档。',
      success: '文档已移除',
      title: '移除此文档',
    },
  },

  nodes: '节点',

  notifications: {
    linkCopied: '已复制链接到剪贴板',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: '你想要做什么？',
    actionCreateDocument: '创建新文档',
    actionCreateDocumentDesc: '使用分享的内容创建新的 Markdown 文档',
    actionUploadResource: '上传为资源',
    actionUploadResourceDesc: '将分享的内容上传为资源（图片、PDF 等），并获取可插入文档的链接',
    chooseDestination: '选择要将此内容保存到哪里。',
    description: '从其他应用程序接收到的内容。',
    sharedContent: '分享的内容',
    title: '分享内容',
  },

  tags: '标签',

  types: {
    category: '分类',
    document: '文档',
    resource: '资源',
    workspace: '工作区',
  },

  workspace: {
    all: '所有工作区',
    new: '新增工作区',
    shared: '与我共享',
  },
};
