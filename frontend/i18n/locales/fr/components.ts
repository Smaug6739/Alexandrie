export default {
  commandCenter: {
    advanced: {
      allCategories: 'Toutes les catégories',
      category: 'Catégorie',
      clear: 'Effacer',
      created: 'Créé',
      dateRange: 'Plage de dates',
      from: 'Du',
      modified: 'Modifié',
      searchInContent: 'Rechercher dans le contenu',
      searchInContentHint: 'Recherche dans le corps du document (nécessite des mots complets)',
      tags: 'Tags',
      title: 'Filtres avancés',
      to: 'Au',
    },
    beta: 'Beta',
    close: 'Fermer',
    navigate: 'Naviguer',
    noResults: 'Aucun résultat pour "{query}"',
    searchPlaceholder: 'Rechercher une page, action ou document...',
    sections: {
      documents: 'Documents',
      pagesAndActions: 'Pages & actions',
    },
    select: 'Sélectionner',
    switchTabs: "Changer d'onglet",
    tabs: {
      advanced: 'Avancé',
      quick: 'Rapide',
    },
  },

  dataTable: {
    rowsPerPage: 'Lignes par page',
    searchPlaceholder: 'Rechercher...',
    showing: 'Affichage de {start} à {end} sur {total} entrées',
  },

  editor: {
    placeholder: {
      description: 'Document description',
      title: 'Document title',
    },
    title: 'Éditeur Markdown',
  },

  filter: {
    all: 'Tous',
    ascending: 'Ascendant',
    assigned: 'Assigné',
    contains: 'Contient',
    created: 'Créé',
    descending: 'Descendant',
    exact: 'Correspondance exacte',
    match: 'Correspondance',
    modified: 'Modifié',
    sort: 'Trier par',
    startsWith: 'Commence par',
    status: 'Statut',
    tags: 'Tags',
    unassigned: 'Non assigné',
  },

  kanban: {
    addColumn: 'Ajouter une colonne',
    addDocument: 'Ajouter un document',
    changeColor: 'Changer la couleur',
    deleteColumn: 'Supprimer la colonne',
    deleteColumnModal: {
      confirm: 'Êtes-vous sûr de vouloir supprimer la colonne "{title}" ?',
      emptyColumn: 'Cette colonne est vide.',
      hasDocuments: 'Cette colonne contient {count} document(s). Ils seront déplacés vers la première colonne.',
      title: 'Supprimer la colonne',
    },
    dragHere: 'Glissez des documents ici',
    editName: 'Modifier le nom',
    manageAssignees: 'Gérer les assignations',
    noAssignees: 'Aucun utilisateur assigné',
    noDocuments: 'Aucun document',
    resetBoard: {
      confirm: 'Êtes-vous sûr de vouloir réinitialiser le tableau kanban ?',
      reset: 'Réinitialiser',
      title: 'Réinitialiser le tableau kanban',
      warning: 'Cette action est irréversible. Toutes les colonnes seront supprimées et les cartes déplacées vers la première colonne.',
    },
    searchHint: 'Saisissez au moins 3 caractères pour lancer la recherche.',
    usersAssigned: 'Utilisateurs assignés',
  },

  navbar: {
    commandCenter: 'Centre de commande (Ctrl+K)',
    searchHint: 'Taper {key} pour naviguer',
  },

  noContent: {
    nothingHere: 'Rien à afficher ici',
  },

  sessionCard: {
    current: 'Actuel',
    inactive: 'Inactif',
    lastActivity: 'Dernière activité',
    loggedOut: 'Déconnecté',
    login: 'Connexion',
    unknownIP: 'IP inconnue',
    unknownLocation: 'Emplacement inconnu',
    userAgent: 'Agent utilisateur',
  },

  sidebar: {
    allWorkspaces: 'Tous les espaces de travail',
    closeAll: 'Tout fermer',
    editWorkspace: "Modifier l'espace de travail",
    joinWorkspace: "Rejoindre l'espace de travail",
    nav: {
      cdn: 'CDN',
      documents: 'Documents',
      home: 'Accueil',
      imports: 'Importations',
      manageCategories: 'Gérer les catégories',
      newPage: 'Nouvelle page',
      settings: 'Paramètres',
      teams: 'Teams',
    },
    newCategory: 'Nouvelle catégorie',
    newDoc: 'Nouveau doc',
    newWorkspace: 'Nouvel espace de travail',
    noWorkspaces: 'Aucun espace de travail trouvé',
    openAll: 'Tout ouvrir',
    searchPlaceholder: 'Rechercher ou ctrl + k',
    sharedWithMe: 'Partagés avec moi',
    toggleDock: 'Basculer le dock',
    workspaces: 'Espaces de travail',
  },

  tagInput: {
    placeholder: 'Entrer pour ajouter un tag',
  },

  viewSelection: {
    kanban: 'Kanban',
    list: 'Liste',
    table: 'Tableau',
  },
} as const;
