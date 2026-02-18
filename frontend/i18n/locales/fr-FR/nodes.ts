export default {
  tags: 'Tags',

  types: {
    workspace: 'Espace de travail',
    category: 'Catégorie',
    document: 'Document',
    resource: 'Ressource',
  },

  category: {
    name: 'Catégorie',
    new: 'Nouvelle catégorie',
    orderHint: 'Ordre de la catégorie dans la barre latérale',
    iconHint: 'SVG supporté',
    editTitle: 'Catégorie & espace de travail',
    uncategorized: 'Non catégorisé',
    notifications: {
      created: 'Catégorie créée avec succès',
      creationError: 'Erreur lors de la création',
      updated: 'Catégorie mise à jour',
    },
  },

  workspace: {
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
    exportAsMarkdown: 'Exporter en Markdown',
    publicLink: 'Lien public',
  },

  document: {
    TOC: 'Table des matières',
    childs: 'Documents enfants',
    editPage: 'Modifier la page',
    nextPage: 'Page suivante',
    prevPage: 'Page précédente',
    lastUpdated: 'Dernière mise à jour',
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
      emojiOrIcon: 'Emoji ou icône',
      emojiOrIconHint: 'SVG ou emojis supportés',
      thumbnail: 'Miniature',
      thumbnailHint: 'SVG supporté',
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
    newWorkspace: '+ Espace de travail',
    newCategory: '+ Catégorie',
    import: 'Importer',
  },

  // From the shared_target api (PWA)
  share: {
    title: 'Partage de contenu',
    description: 'Contenu reçu depuis une autre application.',
    sharedContent: 'Contenu partagé',
    chooseDestination: 'Choisissez où vous voulez enregistrer ce contenu.',
    actionChoose: 'Que voulez-vous faire ?',
    actionCreateDocument: 'Créer un nouveau document',
    actionCreateDocumentDesc: 'Créer un nouveau document Markdown avec le contenu partagé',
    actionUploadResource: 'Téléverser en tant que ressource',
    actionUploadResourceDesc: 'Téléverser le contenu partagé en tant que ressource (image, PDF, etc.) et obtenir un lien pour l’insérer dans vos documents',
  },
} as const;
