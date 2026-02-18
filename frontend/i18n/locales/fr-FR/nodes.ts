export default {
  tags: 'Tags',
  uncategorized: 'Non catégorisé',

  types: {
    workspace: 'Espace de travail',
    category: 'Catégorie',
    document: 'Document',
    resource: 'Ressource',
  },

  category: {
    name: 'Catégorie',
    new: 'Nouvelle catégorie',
    parent: 'Parent',
    order: 'Ordre de la catégorie',
    orderHint: 'Ordre de la catégorie dans la barre latérale',
    color: 'Couleur',
    notifications: {
      created: 'Catégorie créée avec succès',
      creationError: 'Erreur lors de la création',
    },
  },

  workspace: {
    name: 'Espace de travail',
    new: 'Nouvel espace de travail',
    all: 'Tous les espaces de travail',
    shared: 'Partagés avec moi',
  },

  filter: {
    title: 'Filtrer les nœuds',
    footer: '{count} / {total} correspondances',
    toClose: 'pour fermer',
  },

  actions: {
    removeFromShared: 'Retirer du partage',
    resetBoard: 'Réinitialiser le tableau',
    managePermissions: 'Gérer les permissions',
    editMeta: 'Modifier les métadonnées',
    newDocument: '+ Créer un nouveau document',
  },

  document: {
    TOC: 'Table des matières',
    childs: 'Documents enfants',
    editPage: 'Modifier la page',
    nextPage: 'Page suivante',
    prevPage: 'Page précédente',
    lastUpdated: 'Dernière mise à jour',
    notFound: 'Document non trouvé',
    noDocuments: 'Aucun document trouvé',
    noDocumentsDesc: "Il n'y a aucun document dans cette catégorie",
    notifications: {
      posted: 'Document publié avec succès',
      updated: 'Document mis à jour avec succès',
      deleted: 'Document supprimé avec succès',
      error: 'Erreur',
    },
  },

  modals: {
    delete: {
      title: 'Supprimer {type}',
      titleBulk: 'Supprimer les nœuds',
      confirm: 'Êtes-vous sûr de vouloir supprimer ce {type} ?',
      confirmBulk: 'Êtes-vous sûr de vouloir supprimer les nœuds sélectionnés ?',
      hasChildren: 'Ce {type} a {count} documents enfants. Ils seront également supprimés.',
      bulkCount: 'Cette action supprimera {count} nœuds.',
      irreversible: 'Cette action est irréversible',
    },
    metadata: {
      title: 'Métadonnées',
      name: 'Nom',
      role: 'Rôle',
      emojiOrIcon: 'Emoji ou icône',
      emojiOrIconHint: 'SVG ou emojis supportés',
      thumbnail: 'Miniature',
      thumbnailHint: 'SVG supporté',
      pinned: 'Épinglé',
      parent: 'Parent',
      color: 'Couleur',
    },
    permissions: {
      title: 'Gérer les permissions',
      generalAccess: 'Accès général',
      publicInfo: 'Ce document sera accessible publiquement via une URL unique.',
      shareLink: "Partagez ce lien pour permettre à n'importe qui de voir le document sans avoir besoin d'un compte :",
      defaultPermission: 'Permission par défaut pour les nouveaux utilisateurs',
      searchUser: 'Rechercher un utilisateur',
      searchPlaceholder: "Nom d'utilisateur ou email",
      addPermission: 'Ajouter',
      managePermissions: 'Gérer les permissions',
      noPermissions: 'Aucune permission définie',
      noResults: 'Aucun résultat trouvé',
      removePermission: 'Retirer la permission',
    },
    removeShared: {
      title: 'Retirer ce document',
      confirm: 'Êtes-vous sûr de vouloir retirer ce document ?',
      noAccess: "Après cette action, vous n'aurez plus accès à ce document.",
      childWarning: 'Ce document a {count} document(s) enfant(s). Ils seront également retirés.',
      success: 'Document retiré',
    },
  },

  container: {
    title: 'Espaces de travail & Catégories',
    searchPlaceholder: 'Rechercher un espace de travail...',
    noWorkspaces: 'Aucun espace de travail ou catégorie trouvé',
    noDocuments: 'Aucun document trouvé',
    noDocumentsDescription: "Il n'y a aucun document dans cette catégorie",
    createNewDocument: '+ Créer un nouveau document',
  },
} as const;
