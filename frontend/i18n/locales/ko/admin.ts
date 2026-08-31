export default {
  dashboard: {
    cards: {
      totalNodes: '전체 노드 수',
      totalStorage: '전체 저장 용량',
      totalUsers: '전체 사용자 수',
    },
    charts: {
      nodesGrowth: '노드 증가 추이 (12개월)',
      usersGrowth: '사용자 증가 추이 (12개월)',
    },
    description: '이 대시보드에서 사이트 사용자와 설정을 관리할 수 있습니다.',
    error: '통계를 불러올 수 없습니다',
    loading: '통계를 불러오는 중...',
    manageUsers: '사용자 관리',
    title: '관리자 대시보드',
    top: {
      byNodes: '노드 수 기준 상위 사용자',
      byStorage: '저장 용량 기준 상위 사용자',
      nodes: '노드',
      storage: '저장 용량',
      user: '사용자',
    },
  },

  users: {
    headers: {
      action: '작업',
      createdAt: '생성일',
      email: '이메일',
      firstname: '이름',
      lastname: '성',
      name: '이름',
      role: '역할',
    },
    noUsers: '사용자가 없습니다.',
    roles: {
      admin: '관리자',
      user: '사용자',
    },
    title: '사용자 관리',
    actions: {
      accountSuspended: '계정이 정지되었습니다',
      accountActivated: '계정이 활성화되었습니다',
      passwordUpdated: '비밀번호가 성공적으로 업데이트되었습니다',
      sessionRevoked: '세션이 성공적으로 취소되었습니다',
      userUpdated: '사용자가 성공적으로 업데이트되었습니다',
      error: '오류',
      errorFetchingSessions: '세션을 가져오는 중 오류 발생',
      errorRevokingSession: '세션을 취소하는 중 오류 발생',
    },
  },
};
