import type { User, Node, OverviewStats, UserStats, NodeStats } from './db_strustures';

interface UserData extends User {
  nodes?: Node[];
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: ref<UserData[]>(),
    loadingStats: false,
    statsError: '',
    stats: {
      overview: {
        total_users: 0,
        total_nodes: 0,
        total_size: 0,
      } as OverviewStats,
      users: {
        total_users: 0,
        growth_last_12_months: [],
      } as UserStats,
      nodes: {
        total_nodes: 0,
        total_size: 0,
        growth_last_12_months: [],
        top_users_by_nodes: [],
        top_users_by_size: [],
      } as NodeStats,
    },
  }),
  actions: {
    async fetchAll(): Promise<UserData[] | undefined> {
      if (this.users) return this.users;
      const responce = await makeRequest<User[]>(`users`, 'GET', {});
      if (responce.status === 'success') {
        if (responce.result) this.users = responce.result as User[];
        return this.users;
      } else throw responce.message;
    },
    async fetchById(id: string): Promise<User | undefined> {
      const cachedUser = this.users?.find(user => user.id === id);
      if (cachedUser) return cachedUser;
      const responce = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
      if (responce.status === 'success') return responce.result?.user as User;
      else throw responce.message;
    },
    async update(user: User) {
      const request = await makeRequest(`users/${user.id}`, 'PATCH', user);
      if (request.status === 'success') {
        const index = this.users?.findIndex(u => u.id === user.id);
        if (index !== undefined && index >= 0) this.users![index] = request.result as User;
        return request.result;
      } else throw request.message;
    },
    async fetchUserDocuments(userId: string): Promise<Node[] | undefined> {
      const cachedUser = this.users?.find(user => user.id === userId);
      if (cachedUser && cachedUser.nodes) return cachedUser.nodes;
      const responce = await makeRequest<Node[]>(`nodes/user/${userId}`, 'GET', {});
      if (responce.status === 'success') {
        if (cachedUser) cachedUser.nodes = responce.result;
        return responce.result;
      } else throw responce.message;
    },
    async fetchUserDocument(userId: string, docId: string): Promise<Node | undefined> {
      const responce = await makeRequest<{ node: Node; permissions: [] }>(`nodes/${docId}`, 'GET', {});
      if (responce.status === 'success') {
        return responce.result?.node;
      } else throw responce.message;
    },
    async fetchOverviewStats() {
      const response = await makeRequest<OverviewStats>('stats/overview', 'GET', {});
      if (response.status === 'success' && response.result) {
        this.stats.overview = response.result;
        return response.result;
      }
      throw response.message;
    },
    async fetchUsersStats() {
      const response = await makeRequest<UserStats>('stats/users', 'GET', {});
      if (response.status === 'success' && response.result) {
        this.stats.users = response.result;
        return response.result;
      }
      throw response.message;
    },
    async fetchNodesStats(top = 5) {
      const response = await makeRequest<NodeStats>(`stats/nodes?top=${top}`, 'GET', {});
      if (response.status === 'success' && response.result) {
        this.stats.nodes = response.result;
        return response.result;
      }
      throw response.message;
    },
    async fetchStats(top = 5) {
      this.loadingStats = true;
      this.statsError = '';
      try {
        await Promise.all([this.fetchOverviewStats(), this.fetchUsersStats(), this.fetchNodesStats(top)]);
      } catch (error) {
        this.statsError = String(error);
        throw error;
      } finally {
        this.loadingStats = false;
      }
    },
  },
});
