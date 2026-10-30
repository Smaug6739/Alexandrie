export default {
  dashboard: {
    cards: {
      totalNodes: 'Total de nodes',
      totalStorage: 'Stockage total',
      totalUsers: 'Total utilisateurs',
    },
    charts: {
      nodesGrowth: 'Evolution des nodes (12 mois)',
      usersGrowth: 'Evolution des utilisateurs (12 mois)',
    },
    description: 'Depuis ce tableau de bord, vous pouvez gérer les utilisateurs et les paramètres du site.',
    error: 'Impossible de charger les statistiques',
    loading: 'Chargement des statistiques...',
    manageUsers: 'Gérer les utilisateurs',
    title: 'Tableau de bord admin',
    top: {
      byNodes: 'Top utilisateurs par nombre de nodes',
      byStorage: 'Top utilisateurs par usage de stockage',
      nodes: 'Nodes',
      storage: 'Stockage',
      user: 'Utilisateur',
    },
  },

  users: {
    actions: {
      accountActivated: 'Compte activé',
      accountSuspended: 'Compte suspendu',
      error: 'Erreur',
      errorFetchingSessions: 'Erreur lors de la récupération des sessions',
      errorRevokingSession: 'Erreur lors de la révocation de la session',
      passwordUpdated: 'Mot de passe mis à jour avec succès',
      sessionRevoked: 'Session révoquée avec succès',
      userUpdated: 'Utilisateur mis à jour avec succès',
    },
    headers: {
      action: 'Action',
      createdAt: 'Créé le',
      email: 'Email',
      firstname: 'Prénom',
      lastname: 'Nom de famille',
      name: 'Nom',
      role: 'Rôle',
    },
    noUsers: 'Aucun utilisateur trouvé.',
    roles: {
      admin: 'Admin',
      user: 'Utilisateur',
    },
    title: 'Gestion des utilisateurs',
  },
};
