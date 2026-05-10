import type { User, Node, OverviewStats, UserStats, NodeStats } from './db_structures';

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
      const response = await makeRequest<User[]>(`users`, 'GET', {});
      if (response.status === 'success') {
        if (response.result) this.users = response.result as User[];
        return this.users;
      } else throw response.message;
    },
    async fetchById(id: string): Promise<User | undefined> {
      const cachedUser = this.users?.find(user => user.id === id);
      if (cachedUser) return cachedUser;
      const response = await makeRequest<{ user: User }>(`users/${id}`, 'GET', {});
      if (response.status === 'success') return response.result?.user as User;
      else throw response.message;
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
      const response = await makeRequest<Node[]>(`nodes/user/${userId}`, 'GET', {});
      if (response.status === 'success') {
        if (cachedUser) cachedUser.nodes = response.result;
        return response.result;
      } else throw response.message;
    },
    async fetchUserDocument(userId: string, docId: string): Promise<Node | undefined> {
      const response = await makeRequest<{ node: Node; permissions: [] }>(`nodes/${docId}`, 'GET', {});
      if (response.status === 'success') {
        return response.result?.node;
      } else throw response.message;
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
