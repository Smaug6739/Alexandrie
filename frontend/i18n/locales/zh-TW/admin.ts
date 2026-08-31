export default {
  dashboard: {
    cards: {
      totalNodes: '節點總數',
      totalStorage: '總儲存空間',
      totalUsers: '使用者總數',
    },
    charts: {
      nodesGrowth: '節點成長（12 個月）',
      usersGrowth: '使用者成長（12 個月）',
    },
    description: '你可以在此儀表板管理網站使用者與設定。',
    error: '無法載入統計資料',
    loading: '正在載入統計資料...',
    manageUsers: '管理使用者',
    title: '管理員儀表板',
    top: {
      byNodes: '節點數最多的使用者',
      byStorage: '儲存空間用量最多的使用者',
      nodes: '節點',
      storage: '儲存空間',
      user: '使用者',
    },
  },

  users: {
    headers: {
      action: '操作',
      createdAt: '建立於',
      email: '電子郵件',
      firstname: '名字',
      lastname: '姓氏',
      name: '名稱',
      role: '角色',
    },
    noUsers: '找不到使用者。',
    roles: {
      admin: '管理員',
      user: '使用者',
    },
    title: '使用者管理',
    actions: {
      accountSuspended: '帳號已停用',
      accountActivated: '帳號已啟用',
      passwordUpdated: '密碼更新成功',
      sessionRevoked: '會話已成功撤銷',
      userUpdated: '使用者更新成功',
      error: '錯誤',
      errorFetchingSessions: '取得會話時發生錯誤',
      errorRevokingSession: '撤銷會話時發生錯誤',
    },
  },
};
