export default {
  dashboard: {
    cards: {
      totalNodes: '节点总数',
      totalStorage: '总存储空间',
      totalUsers: '用户总数',
    },
    charts: {
      nodesGrowth: '节点成长（12 个月）',
      usersGrowth: '用户成长（12 个月）',
    },
    description: '你可以在此仪表板管理网站用户与设置。',
    error: '无法加载统计数据',
    loading: '正在加载统计数据...',
    manageUsers: '管理用户',
    title: '管理员仪表板',
    top: {
      byNodes: '节点数最多的用户',
      byStorage: '存储空间用量最多的用户',
      nodes: '节点',
      storage: '存储空间',
      user: '用户',
    },
  },

  users: {
    actions: {
      accountActivated: '账号已激活',
      accountSuspended: '账号已停用',
      error: '错误',
      errorFetchingSessions: '获取会话时出错',
      errorRevokingSession: '撤销会话时出错',
      passwordUpdated: '密码更新成功',
      sessionRevoked: '会话已成功撤销',
      userUpdated: '用户更新成功',
    },
    headers: {
      action: '操作',
      createdAt: '创建于',
      email: '电子邮件',
      firstname: '名字',
      lastname: '姓氏',
      name: '名称',
      role: '角色',
    },
    noUsers: '找不到用户。',
    roles: {
      admin: '管理员',
      user: '用户',
    },
    title: '用户管理',
  },
};
