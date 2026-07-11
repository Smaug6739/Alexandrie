export default {
  actions: {
    cancel: '취소',
    importAll: '모두 가져오기',
    importing: '가져오는 중...',
    optionsTitle: '가져오기 옵션',
    extractFrontMatter: '프론트매터를 메타데이터로 추출',
    normalizeLineEndings: '줄바꿈 정규화',
    preserveTimestamps: '원본 타임스탬프 유지',
    skipExisting: '기존 문서 건너뛰기 (새 문서만 가져오기)',
  },

  advanced: {
    options: '고급 가져오기 옵션',
    defaultParent: '가져온 문서의 기본 상위 카테고리',
    defaultDescription: '가져온 문서의 기본 설명',
    defaultTags: '가져온 문서의 기본 태그 (쉼표로 구분)',
    defaultColor: '가져온 문서의 기본 색상',
    defaultThumbnail: '가져온 문서의 기본 썸네일 (svg 또는 유니코드 이모지)',
    defaultIcon: '가져온 문서의 기본 아이콘 (svg 또는 유니코드 이모지)',
    defaultTheme: '가져온 문서의 기본 테마',
  },

  files: {
    meta: {
      title: '마크다운 파일에서 가져오기',
      description: '대상 및 처리 옵션과 함께 마크다운 파일을 빠르게 가져옵니다.',
    },
    importable: '마크다운 파일 또는 마크다운 파일이 포함된 폴더를 가져올 수 있습니다. "모두 가져오기" 옵션을 선택하면 폴더는 구조를 유지한 채 재귀적으로 가져와집니다.',
    toImport: '가져올 항목',
  },

  categories: {
    backup: {
      title: '백업에서 가져오기',
      description: '문서와 설정이 포함된 전체 Alexandrie 백업을 복원합니다.',
    },
    files: {
      title: '파일에서 가져오기',
      description: '유연한 옵션으로 마크다운 파일에서 문서를 가져옵니다.',
    },
    advanced: {
      title: '고급 가져오기',
      description: '최대한의 제어를 위해 사용자 지정 옵션을 사용하여 전체 폴더(하위 폴더 및 업로드 포함)를 가져옵니다.',
    },
  },

  header: {
    changeFile: '파일 변경',
    created: '생성일',
    documents: '문서',
    files: '파일',
    metadata: '메타데이터',
    settings: '설정',
    title: '백업 정보',
    totalDocuments: '전체 문서 수',
    totalSize: '전체 크기',
    version: '버전',
  },

  meta: {
    breadcrumb: '가져오기',
    description: '이전에 내보낸 항목에서 문서를 가져올 수 있습니다. 아직 없다면 다음에서 생성하세요',
    settingsLink: '설정',
    title: '문서 가져오기',
  },

  notifications: {
    importCompleteMessage: '문서를 성공적으로 가져왔습니다.',
    importCompleteTitle: '가져오기 완료',
    importFailedMessage: '가져오기 중 오류가 발생했습니다. 다시 시도해 주세요.',
    importFailedTitle: '가져오기 실패',
    localImportedMessage: '로컬 설정이 백업 내용으로 교체되었습니다.',
    localImportedTitle: '로컬 설정을 가져왔습니다',
  },

  progress: {
    title: '가져오기 진행 상황',
  },

  steps: {
    select: {
      analyzing: '분석 중...',
      startImport: '가져오기 시작',
    },
  },

  summary: {
    documentsToUpdate: '업데이트할 문서',
    newDocuments: '새 문서',
    title: '가져오기 요약',
    unchanged: '변경 없음',
  },

  tabs: {
    backup: '백업',
    current: '현재',
    import: '가져오기',
    importFromBackup: '백업에서 가져오기',
    importLocalSettings: '로컬 설정 가져오기',
    importSelected: '선택 항목 가져오기 ({count})',
    localSettings: '로컬 설정 및 환경설정',
    localSettingsAvailable: '로컬 설정 및 환경설정을 가져올 수 있습니다',
    localSettingsWarning: '스니펫을 포함한 현재 로컬 설정을 덮어씁니다',
    newDocuments: '새 문서',
    noLocalSettings: '백업에 로컬 설정이 없습니다',
    noNewDocuments: '가져올 새 문서가 없습니다',
    noUpdates: '업데이트할 문서가 없습니다',
    replaceLocalSettings: '로컬 설정을 백업 내용으로 교체하시겠습니까?',
    selectAll: '모두 선택',
    updates: '업데이트',
    updateSelected: '선택 항목 업데이트 ({count})',
  },
};
