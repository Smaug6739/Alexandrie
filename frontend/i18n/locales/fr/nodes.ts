export default {
  actions: {
    copyPublicLink: 'Copier le lien public',
    editMeta: 'Modifier les mÃ©tadonnÃ©es',
    exportAsMarkdown: 'Exporter en Markdown',
    managePermissions: 'GÃ©rer les permissions',
    newDocument: '+ CrÃ©er un nouveau document',
    publicLink: 'Lien public',
    removeFromShared: 'Retirer du partage',
    resetBoard: 'RÃ©initialiser le tableau',
    share: 'Partager',
  },
  category: {
    editTitle: 'CatÃ©gorie & espace de travail',
    iconHint: 'SVG supportÃ©',
    name: 'CatÃ©gorie',
    new: 'Nouvelle catÃ©gorie',
    notifications: {
      created: 'CatÃ©gorie crÃ©Ã©e avec succÃ¨s',
      creationError: 'Erreur lors de la crÃ©ation',
      updated: 'CatÃ©gorie mise Ã  jour',
    },
    orderHint: 'Ordre de la catÃ©gorie dans la barre latÃ©rale',
    uncategorized: 'Non catÃ©gorisÃ©',
  },

  container: {
    createNewDocument: '+ CrÃ©er un nouveau document',
    import: 'Importer',
    newCategory: '+ CatÃ©gorie',
    newWorkspace: '+ Espace de travail',
    noDocuments: 'Aucun document trouvÃ©',
    noDocumentsDescription: "Il n'y a aucun document dans cette catÃ©gorie",
    noWorkspaces: 'Aucun espace de travail ou catÃ©gorie trouvÃ©',
    searchPlaceholder: 'Rechercher un espace de travail...',
    title: 'Espaces de travail & CatÃ©gories',
  },

  document: {
    childs: 'Documents enfants',
    editPage: 'Modifier la page',
    lastUpdated: 'DerniÃ¨re mise Ã  jour',
    nextPage: 'Page suivante',
    prevPage: 'Page prÃ©cÃ©dente',
    TOC: 'Table des matiÃ¨res',
  },

  filter: {
    footer: '{count} / {total} correspondances',
    title: 'Filtrer les nÅ“uds',
    toClose: 'pour fermer',
  },

  modals: {
    delete: {
      bulkCount: 'Cette action supprimera {count} nÅ“uds.',
      confirm: 'ÃŠtes-vous sÃ»r de vouloir supprimer ce {type} ?',
      confirmBulk: 'ÃŠtes-vous sÃ»r de vouloir supprimer les nÅ“uds sÃ©lectionnÃ©s ?',
      hasChildren: 'Ce {type} a {count} documents enfants. Ils seront Ã©galement supprimÃ©s.',
      irreversible: 'Cette action est irrÃ©versible',
      title: 'Supprimer {type}',
      titleBulk: 'Supprimer les nÅ“uds',
    },
    join: {
      access: 'AccÃ¨s au nÅ“ud',
      helperText: 'An invitation code or link is required before proceeding.',
      inputPlaceholder: 'ABC123 ou https://.../join-workspace?code=ABC123',
      join: 'Rejoindre',
      joining: 'Rejoindre...',
      label: "Code d'invitation ou lien",
      subtitle:
        "Coller un code d'invitation ou un lien d'invitation complet. Si vous avez dÃ©jÃ  rejoint cet espace de travail avec un niveau de permission diffÃ©rent, seul le plus Ã©levÃ© sera conservÃ©.",
      title: 'Rejoindre une Ã©quipe ou un espace de travail',
    },
    metadata: {
      emojiOrIcon: 'Emoji ou icÃ´ne',
      emojiOrIconHint: 'SVG ou emojis supportÃ©s',
      labelAppearance: 'Apparence',
      labelMedia: 'Media',
      labelOrganization: 'Organisation',
      pinDescription: 'Ã‰pingler ce document en haut de votre espace de travail',
      thumbnail: 'Miniature',
      thumbnailHint: 'SVG supportÃ©',
      title: 'MÃ©tadonnÃ©es',
    },
    permissions: {
      addPermission: 'Ajouter',
      defaultPermission: 'Permission par dÃ©faut pour les nouveaux utilisateurs',
      generalAccess: 'AccÃ¨s gÃ©nÃ©ral',
      inviteCreate: 'CrÃ©er une invitation',
      inviteCreateProgress: "CrÃ©ation de l'invitation...",
      inviteEmpty: 'Aucune invitation pour le moment',
      inviteLabel: 'Invitations au nÅ“ud',
      invitePermission: 'Permission',
      managePermissions: 'GÃ©rer les permissions',
      noPermissions: 'Aucune permission dÃ©finie',
      noResults: 'Aucun rÃ©sultat trouvÃ©',
      publicInfo: 'Ce document sera accessible publiquement via une URL unique.',
      removePermission: 'Retirer la permission',
      searchPlaceholder: "Nom d'utilisateur ou email",
      searchUser: 'Rechercher un utilisateur',
      shareLink: "Partagez ce lien pour permettre Ã  n'importe qui de voir le document sans avoir besoin d'un compte :",
      title: 'GÃ©rer les permissions',
    },
    removeShared: {
      childWarning: 'Ce document a {count} document(s) enfant(s). Ils seront Ã©galement retirÃ©s.',
      confirm: 'ÃŠtes-vous sÃ»r de vouloir retirer ce document ?',
      noAccess: "AprÃ¨s cette action, vous n'aurez plus accÃ¨s Ã  ce document.",
      success: 'Document retirÃ©',
      title: 'Retirer ce document',
    },
  },

  nodes: 'NÅ“uds',

  notifications: {
    linkCopied: 'Lien copiÃ© dans le presse-papiers',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Que voulez-vous faire ?',
    actionCreateDocument: 'CrÃ©er un nouveau document',
    actionCreateDocumentDesc: 'CrÃ©er un nouveau document Markdown avec le contenu partagÃ©',
    actionUploadResource: 'TÃ©lÃ©verser en tant que ressource',
    actionUploadResourceDesc: 'TÃ©lÃ©verser le contenu partagÃ© en tant que ressource (image, PDF, etc.) et obtenir un lien pour lâ€™insÃ©rer dans vos documents',
    chooseDestination: 'Choisissez oÃ¹ vous voulez enregistrer ce contenu.',
    description: 'Contenu reÃ§u depuis une autre application.',
    sharedContent: 'Contenu partagÃ©',
    title: 'Partage de contenu',
  },

  tags: 'Tags',

  types: {
    category: 'CatÃ©gorie | CatÃ©gories',
    document: 'Document | Documents',
    resource: 'Ressource',
    workspace: 'Espace de travail',
  },

  workspace: {
    all: 'Tous les espaces de travail',
    new: 'Nouvel espace de travail',
    shared: 'PartagÃ©s avec moi',
  },
};
