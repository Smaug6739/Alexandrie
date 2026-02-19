export default {
  actions: {
    editMeta: 'Modifier les métadonnées',
    exportAsMarkdown: 'Exporter en Markdown',
    managePermissions: 'Gérer les permissions',
    newDocument: '+ Créer un nouveau document',
    publicLink: 'Lien public',
    removeFromShared: 'Retirer du partage',
    resetBoard: 'Réinitialiser le tableau',
  },

  category: {
    editTitle: 'Catégorie & espace de travail',
    iconHint: 'SVG supporté',
    name: 'Catégorie',
    new: 'Nouvelle catégorie',
    notifications: {
      created: 'Catégorie créée avec succès',
      creationError: 'Erreur lors de la création',
      updated: 'Catégorie mise à jour',
    },
    orderHint: 'Ordre de la catégorie dans la barre latérale',
    uncategorized: 'Non catégorisé',
  },

  container: {
    createNewDocument: '+ Créer un nouveau document',
    import: 'Importer',
    newCategory: '+ Catégorie',
    newWorkspace: '+ Espace de travail',
    noDocuments: 'Aucun document trouvé',
    noDocumentsDescription: "Il n'y a aucun document dans cette catégorie",
    noWorkspaces: 'Aucun espace de travail ou catégorie trouvé',
    searchPlaceholder: 'Rechercher un espace de travail...',
    title: 'Espaces de travail & Catégories',
  },

  document: {
    childs: 'Documents enfants',
    editPage: 'Modifier la page',
    lastUpdated: 'Dernière mise à jour',
    nextPage: 'Page suivante',
    prevPage: 'Page précédente',
    TOC: 'Table des matières',
  },

  filter: {
    footer: '{count} / {total} correspondances',
    title: 'Filtrer les nœuds',
    toClose: 'pour fermer',
  },

  modals: {
    delete: {
      bulkCount: 'Cette action supprimera {count} nœuds.',
      confirm: 'Êtes-vous sûr de vouloir supprimer ce {type} ?',
      confirmBulk: 'Êtes-vous sûr de vouloir supprimer les nœuds sélectionnés ?',
      hasChildren: 'Ce {type} a {count} documents enfants. Ils seront également supprimés.',
      irreversible: 'Cette action est irréversible',
      title: 'Supprimer {type}',
      titleBulk: 'Supprimer les nœuds',
    },
    metadata: {
      emojiOrIcon: 'Emoji ou icône',
      emojiOrIconHint: 'SVG ou emojis supportés',
      thumbnail: 'Miniature',
      thumbnailHint: 'SVG supporté',
      title: 'Métadonnées',
    },
    permissions: {
      addPermission: 'Ajouter',
      defaultPermission: 'Permission par défaut pour les nouveaux utilisateurs',
      generalAccess: 'Accès général',
      managePermissions: 'Gérer les permissions',
      noPermissions: 'Aucune permission définie',
      noResults: 'Aucun résultat trouvé',
      publicInfo: 'Ce document sera accessible publiquement via une URL unique.',
      removePermission: 'Retirer la permission',
      searchPlaceholder: "Nom d'utilisateur ou email",
      searchUser: 'Rechercher un utilisateur',
      shareLink: "Partagez ce lien pour permettre à n'importe qui de voir le document sans avoir besoin d'un compte :",
      title: 'Gérer les permissions',
    },
    removeShared: {
      childWarning: 'Ce document a {count} document(s) enfant(s). Ils seront également retirés.',
      confirm: 'Êtes-vous sûr de vouloir retirer ce document ?',
      noAccess: "Après cette action, vous n'aurez plus accès à ce document.",
      success: 'Document retiré',
      title: 'Retirer ce document',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Que voulez-vous faire ?',
    actionCreateDocument: 'Créer un nouveau document',
    actionCreateDocumentDesc: 'Créer un nouveau document Markdown avec le contenu partagé',
    actionUploadResource: 'Téléverser en tant que ressource',
    actionUploadResourceDesc: 'Téléverser le contenu partagé en tant que ressource (image, PDF, etc.) et obtenir un lien pour l’insérer dans vos documents',
    chooseDestination: 'Choisissez où vous voulez enregistrer ce contenu.',
    description: 'Contenu reçu depuis une autre application.',
    sharedContent: 'Contenu partagé',
    title: 'Partage de contenu',
  },

  tags: 'Tags',

  types: {
    category: 'Catégorie | Catégories',
    document: 'Document | Documents',
    resource: 'Ressource',
    workspace: 'Espace de travail',
  },

  workspace: {
    all: 'Tous les espaces de travail',
    new: 'Nouvel espace de travail',
    shared: 'Partagés avec moi',
  },
};
