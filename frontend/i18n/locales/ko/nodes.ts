export default {
  nodes: '노드',
  actions: {
    editMeta: '메타데이터 편집',
    exportAsMarkdown: '마크다운으로 내보내기',
    managePermissions: '권한 관리',
    newDocument: '+ 새 문서 생성',
    publicLink: '공개 링크',
    removeFromShared: '공유에서 제거',
    resetBoard: '보드 초기화',
  },

  category: {
    editTitle: '카테고리 및 워크스페이스',
    iconHint: 'SVG 지원',
    name: '카테고리 | 카테고리',
    new: '새 카테고리',
    notifications: {
      created: '카테고리가 성공적으로 생성되었습니다',
      creationError: '카테고리 생성 오류',
      updated: '카테고리가 업데이트되었습니다',
    },
    orderHint: '사이드바에서의 카테고리 순서',
    uncategorized: '미분류',
  },

  container: {
    createNewDocument: '+ 새 문서 생성',
    import: '가져오기',
    newCategory: '+ 카테고리',
    newWorkspace: '+ 워크스페이스',
    noDocuments: '문서를 찾을 수 없습니다',
    noDocumentsDescription: '이 카테고리에는 문서가 없습니다',
    noWorkspaces: '워크스페이스 또는 카테고리를 찾을 수 없습니다',
    searchPlaceholder: '워크스페이스 검색...',
    title: '워크스페이스 및 카테고리',
  },

  document: {
    childs: '하위 문서',
    editPage: '페이지 편집',
    lastUpdated: '마지막 업데이트',
    nextPage: '다음 페이지',
    prevPage: '이전 페이지',
    TOC: '목차',
  },

  filter: {
    footer: '{count} / {total}개 일치',
    title: '노드 필터',
    toClose: '닫으려면',
  },

  modals: {
    delete: {
      bulkCount: '이 작업은 {count}개의 노드를 삭제합니다.',
      confirm: '이 {type}을(를) 삭제하시겠습니까?',
      confirmBulk: '선택한 노드를 삭제하시겠습니까?',
      hasChildren: '이 {type}에는 {count}개의 하위 문서가 있습니다. 하위 문서도 함께 삭제됩니다.',
      irreversible: '이 작업은 되돌릴 수 없습니다',
      title: '{type} 삭제',
      titleBulk: '노드 삭제',
    },
    join: {
      access: '노드 접근 권한',
      title: '팀 또는 워크스페이스 참여',
      subtitle: '초대 코드나 전체 초대 링크를 붙여넣으세요. 이미 다른 권한 수준으로 이 워크스페이스에 참여한 경우, 가장 높은 권한만 유지됩니다.',
      label: '초대 코드 또는 링크',
      join: '참여',
      joining: '참여 중...',
      inputPlaceholder: 'ABC123 또는 https://.../join-workspace?code=ABC123',
    },
    metadata: {
      emojiOrIcon: '이모지 또는 아이콘',
      emojiOrIconHint: 'SVG 또는 이모지 지원',
      thumbnail: '썸네일',
      thumbnailHint: 'SVG 지원',
      title: '메타데이터',
    },
    permissions: {
      addPermission: '추가',
      defaultPermission: '신규 사용자의 기본 권한',
      generalAccess: '일반 접근 권한',
      inviteLabel: '노드 초대',
      inviteCreate: '초대 생성',
      inviteCreateProgress: '초대 생성 중...',
      inviteEmpty: '아직 초대가 없습니다',
      invitePermission: '권한',
      managePermissions: '권한 관리',
      noPermissions: '설정된 권한이 없습니다',
      noResults: '결과가 없습니다',
      publicInfo: '이 문서는 고유한 URL을 통해 공개적으로 접근할 수 있습니다.',
      removePermission: '권한 제거',
      searchPlaceholder: '사용자 이름 또는 이메일',
      searchUser: '사용자 검색',
      shareLink: '계정 없이도 문서를 볼 수 있도록 이 링크를 공유하세요:',
      title: '권한 관리',
    },
    removeShared: {
      childWarning: '이 문서에는 {count}개의 하위 문서가 있습니다. 하위 문서도 함께 제거됩니다.',
      confirm: '이 문서를 제거하시겠습니까?',
      noAccess: '이 작업 후에는 더 이상 이 문서에 접근할 수 없습니다.',
      success: '문서가 제거되었습니다',
      title: '이 문서 제거',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: '무엇을 하시겠습니까?',
    actionCreateDocument: '새 문서 생성',
    actionCreateDocumentDesc: '공유된 내용으로 새 마크다운 문서를 생성합니다',
    actionUploadResource: '리소스로 업로드',
    actionUploadResourceDesc: '공유된 내용을 리소스(이미지, PDF 등)로 업로드하고 문서에 삽입할 수 있는 링크를 받습니다',
    chooseDestination: '이 콘텐츠를 저장할 위치를 선택하세요.',
    description: '다른 앱에서 받은 콘텐츠입니다.',
    sharedContent: '공유된 콘텐츠',
    title: '콘텐츠 공유',
  },

  tags: '태그',

  types: {
    category: '카테고리 | 카테고리',
    document: '문서 | 문서',
    resource: '리소스',
    workspace: '워크스페이스',
  },

  workspace: {
    all: '모든 워크스페이스',
    new: '새 워크스페이스',
    shared: '공유받은 항목',
  },
};
