export default {
  actions: {
    copyPublicLink: 'å¤åˆ¶å…¬å¼€é“¾æŽ¥',
    editMeta: 'ç¼–è¾‘å…ƒæ•°æ®',
    exportAsMarkdown: 'å¯¼å‡ºä¸º Markdown',
    managePermissions: 'ç®¡ç†æƒé™',
    newDocument: '+ åˆ›å»ºæ–°æ–‡æ¡£',
    publicLink: 'å…¬å¼€é“¾æŽ¥',
    removeFromShared: 'ä»Žå…±äº«ä¸­ç§»é™¤',
    resetBoard: 'é‡ç½®çœ‹æ¿',
    share: 'åˆ†äº«',
  },
  category: {
    editTitle: 'åˆ†ç±»ä¸Žå·¥ä½œåŒº',
    iconHint: 'æ”¯æŒ SVG',
    name: 'åˆ†ç±»',
    new: 'æ–°å¢žåˆ†ç±»',
    notifications: {
      created: 'å·²æˆåŠŸåˆ›å»ºåˆ†ç±»',
      creationError: 'åˆ›å»ºåˆ†ç±»æ—¶å‘ç”Ÿé”™è¯¯',
      updated: 'åˆ†ç±»å·²æ›´æ–°',
    },
    orderHint: 'åˆ†ç±»åœ¨ä¾§è¾¹æ ä¸­çš„æŽ’åº',
    uncategorized: 'æœªåˆ†ç±»',
  },

  container: {
    createNewDocument: '+ åˆ›å»ºæ–°æ–‡æ¡£',
    import: 'å¯¼å…¥',
    newCategory: '+ åˆ†ç±»',
    newWorkspace: '+ å·¥ä½œåŒº',
    noDocuments: 'æ‰¾ä¸åˆ°æ–‡æ¡£',
    noDocumentsDescription: 'æ­¤åˆ†ç±»ä¸­æ²¡æœ‰ä»»ä½•æ–‡æ¡£',
    noWorkspaces: 'æ‰¾ä¸åˆ°å·¥ä½œåŒºæˆ–åˆ†ç±»',
    searchPlaceholder: 'æœç´¢å·¥ä½œåŒº...',
    title: 'å·¥ä½œåŒºä¸Žåˆ†ç±»',
  },

  document: {
    childs: 'å­æ–‡æ¡£',
    editPage: 'ç¼–è¾‘é¡µé¢',
    lastUpdated: 'æœ€åŽæ›´æ–°',
    nextPage: 'ä¸‹ä¸€é¡µ',
    prevPage: 'ä¸Šä¸€é¡µ',
    TOC: 'ç›®å½•',
  },

  filter: {
    footer: '{count} / {total} ä¸ªåŒ¹é…é¡¹',
    title: 'ç­›é€‰èŠ‚ç‚¹',
    toClose: 'ä»¥å…³é—­',
  },

  modals: {
    delete: {
      bulkCount: 'æ­¤æ“ä½œå°†åˆ é™¤ {count} ä¸ªèŠ‚ç‚¹ã€‚',
      confirm: 'ä½ ç¡®å®šè¦åˆ é™¤è¿™ä¸ª{type}å—ï¼Ÿ',
      confirmBulk: 'ä½ ç¡®å®šè¦åˆ é™¤æ‰€é€‰çš„èŠ‚ç‚¹å—ï¼Ÿ',
      hasChildren: 'æ­¤{type}æœ‰ {count} ä¸ªå­æ–‡æ¡£ï¼Œè¿™äº›æ–‡æ¡£ä¹Ÿä¼šä¸€å¹¶åˆ é™¤ã€‚',
      irreversible: 'æ­¤æ“ä½œæ— æ³•æ’¤é”€',
      title: 'åˆ é™¤{type}',
      titleBulk: 'åˆ é™¤èŠ‚ç‚¹',
    },
    join: {
      access: 'èŠ‚ç‚¹è®¿é—®æƒé™',
      helperText: 'An invitation code or link is required before proceeding.',
      inputPlaceholder: 'ABC123 æˆ– https://.../join-workspace?code=ABC123',
      join: 'åŠ å…¥',
      joining: 'åŠ å…¥ä¸­...',
      label: 'é‚€è¯·ç æˆ–é“¾æŽ¥',
      subtitle: 'ç²˜è´´é‚€è¯·ç æˆ–å®Œæ•´çš„é‚€è¯·é“¾æŽ¥ã€‚å¦‚æžœä½ å·²ç”¨å…¶ä»–æƒé™ç­‰çº§åŠ å…¥è¿‡è¿™ä¸ªå·¥ä½œåŒºï¼Œç³»ç»Ÿåªä¼šä¿ç•™æœ€é«˜çš„æƒé™ã€‚',
      title: 'åŠ å…¥å›¢é˜Ÿæˆ–å·¥ä½œåŒº',
    },
    metadata: {
      emojiOrIcon: 'Emoji æˆ–å›¾æ ‡',
      emojiOrIconHint: 'æ”¯æŒ SVG æˆ– emoji',
      labelAppearance: 'å¤–è§‚',
      labelMedia: 'åª’ä½“',
      labelOrganization: 'ç»„ç»‡',
      pinDescription: 'å°†æ­¤æ–‡æ¡£ç½®é¡¶è‡³å·¥ä½œåŒºé¡¶éƒ¨',
      thumbnail: 'ç¼©ç•¥å›¾',
      thumbnailHint: 'æ”¯æŒ SVG',
      title: 'å…ƒæ•°æ®',
    },
    permissions: {
      addPermission: 'æ–°å¢ž',
      defaultPermission: 'æ–°ç”¨æˆ·çš„é»˜è®¤æƒé™',
      generalAccess: 'å¸¸è§„è®¿é—®æƒé™',
      inviteCreate: 'åˆ›å»ºé‚€è¯·',
      inviteCreateProgress: 'æ­£åœ¨åˆ›å»ºé‚€è¯·...',
      inviteEmpty: 'å°šæ— é‚€è¯·',
      inviteLabel: 'èŠ‚ç‚¹é‚€è¯·',
      invitePermission: 'æƒé™',
      managePermissions: 'ç®¡ç†æƒé™',
      noPermissions: 'å°šæœªè®¾ç½®æƒé™',
      noResults: 'æ‰¾ä¸åˆ°ç»“æžœ',
      publicInfo: 'æ­¤æ–‡æ¡£å°†å¯é€šè¿‡ä¸“å±žç½‘å€å…¬å¼€è®¿é—®ã€‚',
      removePermission: 'ç§»é™¤æƒé™',
      searchPlaceholder: 'ç”¨æˆ·åæˆ–ç”µå­é‚®ä»¶',
      searchUser: 'æœç´¢ç”¨æˆ·',
      shareLink: 'åˆ†äº«è¿™ä¸ªé“¾æŽ¥ï¼Œè®©ä»»ä½•äººä¸éœ€è´¦å·å³å¯æŸ¥çœ‹æ–‡æ¡£ï¼š',
      title: 'ç®¡ç†æƒé™',
    },
    removeShared: {
      childWarning: 'æ­¤æ–‡æ¡£æœ‰ {count} ä¸ªå­æ–‡æ¡£ï¼Œè¿™äº›æ–‡æ¡£ä¹Ÿä¼šä¸€å¹¶ç§»é™¤ã€‚',
      confirm: 'ä½ ç¡®å®šè¦ç§»é™¤è¿™ä¸ªæ–‡æ¡£å—ï¼Ÿ',
      noAccess: 'æ‰§è¡Œæ­¤æ“ä½œåŽï¼Œä½ å°†æ— æ³•å†è®¿é—®è¿™ä¸ªæ–‡æ¡£ã€‚',
      success: 'æ–‡æ¡£å·²ç§»é™¤',
      title: 'ç§»é™¤æ­¤æ–‡æ¡£',
    },
  },

  nodes: 'èŠ‚ç‚¹',

  notifications: {
    linkCopied: 'å·²å¤åˆ¶é“¾æŽ¥åˆ°å‰ªè´´æ¿',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'ä½ æƒ³è¦åšä»€ä¹ˆï¼Ÿ',
    actionCreateDocument: 'åˆ›å»ºæ–°æ–‡æ¡£',
    actionCreateDocumentDesc: 'ä½¿ç”¨åˆ†äº«çš„å†…å®¹åˆ›å»ºæ–°çš„ Markdown æ–‡æ¡£',
    actionUploadResource: 'ä¸Šä¼ ä¸ºèµ„æº',
    actionUploadResourceDesc: 'å°†åˆ†äº«çš„å†…å®¹ä¸Šä¼ ä¸ºèµ„æºï¼ˆå›¾ç‰‡ã€PDF ç­‰ï¼‰ï¼Œå¹¶èŽ·å–å¯æ’å…¥æ–‡æ¡£çš„é“¾æŽ¥',
    chooseDestination: 'é€‰æ‹©è¦å°†æ­¤å†…å®¹ä¿å­˜åˆ°å“ªé‡Œã€‚',
    description: 'ä»Žå…¶ä»–åº”ç”¨ç¨‹åºæŽ¥æ”¶åˆ°çš„å†…å®¹ã€‚',
    sharedContent: 'åˆ†äº«çš„å†…å®¹',
    title: 'åˆ†äº«å†…å®¹',
  },

  tags: 'æ ‡ç­¾',

  types: {
    category: 'åˆ†ç±»',
    document: 'æ–‡æ¡£',
    resource: 'èµ„æº',
    workspace: 'å·¥ä½œåŒº',
  },

  workspace: {
    all: 'æ‰€æœ‰å·¥ä½œåŒº',
    new: 'æ–°å¢žå·¥ä½œåŒº',
    shared: 'ä¸Žæˆ‘å…±äº«',
  },
};
