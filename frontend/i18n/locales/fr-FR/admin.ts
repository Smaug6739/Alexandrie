export default {
  dashboard: {
    title: 'Tableau de bord admin',
    description: 'Depuis ce tableau de bord, vous pouvez gérer les utilisateurs et les paramètres du site.',
    manageUsers: 'Gérer les utilisateurs',
  },

  users: {
    title: 'Gestion des utilisateurs',
    noUsers: 'Aucun utilisateur trouvé.',
    headers: {
      name: 'Nom',
      firstname: 'Prénom',
      lastname: 'Nom de famille',
      email: 'Email',
      role: 'Rôle',
      createdAt: 'Créé le',
      action: 'Action',
    },
    roles: {
      admin: 'Admin',
      user: 'Utilisateur',
    },
  },
} as const;
