export default {
  dashboard: {
    description: 'From this dashboard you can manage site users and settings.',
    manageUsers: 'Manage users',
    title: 'Admin dashboard',
  },

  users: {
    headers: {
      action: 'Action',
      createdAt: 'Created at',
      email: 'Email',
      firstname: 'First name',
      lastname: 'Last name',
      name: 'Name',
      role: 'Role',
    },
    noUsers: 'No users found.',
    roles: {
      admin: 'Admin',
      user: 'User',
    },
    title: 'User management',
  },
} as const;
