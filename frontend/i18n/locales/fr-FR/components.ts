export default {
  navbar: {
    searchHint: 'Taper {key} pour naviguer',
    commandCenter: 'Centre de commande (Ctrl+K)',
  },

  dataTable: {
    searchPlaceholder: 'Rechercher...',
    showing: 'Affichage de {start} à {end} sur {total} entrées',
    rowsPerPage: 'Lignes par page',
  },

  noContent: {
    nothingHere: 'Rien à afficher ici',
  },

  commandCenter: {
    searchPlaceholder: 'Rechercher une page, action ou document...',
    beta: 'Beta',
    navigate: 'Naviguer',
    select: 'Sélectionner',
    switchTabs: "Changer d'onglet",
    close: 'Fermer',
    noResults: 'Aucun résultat pour "{query}"',
    tabs: {
      quick: 'Rapide',
      advanced: 'Avancé',
    },
    sections: {
      pagesAndActions: 'Pages & actions',
      documents: 'Documents',
    },
    advanced: {
      title: 'Filtres avancés',
      clear: 'Effacer',
      dateRange: 'Plage de dates',
      from: 'Du',
      to: 'Au',
      created: 'Créé',
      modified: 'Modifié',
      category: 'Catégorie',
      allCategories: 'Toutes les catégories',
      tags: 'Tags',
      searchInContent: 'Rechercher dans le contenu',
      searchInContentHint: 'Recherche dans le corps du document (nécessite des mots complets)',
    },
  },

  sidebar: {
    searchPlaceholder: 'Rechercher ou ctrl + q',
    newDoc: 'Nouveau doc',
    newCategory: 'Nouvelle catégorie',
    closeAll: 'Tout fermer',
    openAll: 'Tout ouvrir',
    toggleDock: 'Basculer le dock',
    workspaces: 'Espaces de travail',
    allWorkspaces: 'Tous les espaces de travail',
    sharedWithMe: 'Partagés avec moi',
    noWorkspaces: 'Aucun espace de travail trouvé',
    newWorkspace: 'Nouvel espace de travail',
    editWorkspace: "Modifier l'espace de travail",
    nav: {
      home: 'Accueil',
      manageCategories: 'Gérer les catégories',
      cdn: 'CDN',
      settings: 'Paramètres',
      documents: 'Documents',
      imports: 'Importations',
      newPage: 'Nouvelle page',
    },
  },

  sessionCard: {
    current: 'Actuel',
    inactive: 'Inactif',
    unknownLocation: 'Emplacement inconnu',
    unknownIP: 'IP inconnue',
    login: 'Connexion',
    lastActivity: 'Dernière activité',
    loggedOut: 'Déconnecté',
    userAgent: 'Agent utilisateur',
  },

  viewSelection: {
    table: 'Tableau',
    list: 'Liste',
    kanban: 'Kanban',
  },

  kanban: {
    addColumn: 'Ajouter une colonne',
    changeColor: 'Changer la couleur',
    editName: 'Modifier le nom',
    deleteColumn: 'Supprimer la colonne',
    noDocuments: 'Aucun document',
    dragHere: 'Glissez des documents ici',
    addDocument: 'Ajouter un document',
    resetBoard: {
      title: 'Réinitialiser le tableau kanban',
      confirm: 'Êtes-vous sûr de vouloir réinitialiser le tableau kanban ?',
      warning: 'Cette action est irréversible. Toutes les colonnes seront supprimées et les cartes déplacées vers la première colonne.',
      reset: 'Réinitialiser',
    },
    deleteColumnModal: {
      title: 'Supprimer la colonne',
      confirm: 'Êtes-vous sûr de vouloir supprimer la colonne "{title}" ?',
      hasDocuments: 'Cette colonne contient {count} document(s). Ils seront déplacés vers la première colonne.',
      emptyColumn: 'Cette colonne est vide.',
    },
  },

  tagInput: {
    placeholder: 'Entrer pour ajouter un tag',
  },
} as const;
