export default {
  actions: {
    download: 'Télécharger le fichier',
    upload: {
      idle: 'Téléverser',
      multiple: 'Téléverser {n} fichier | Téléverser {n} fichiers',
      progress: 'Téléversement de {n} / {total}',
    },
  },

  appdrop: {
    addMore: 'Ajouter plus de fichiers',
    link: 'cliquez ici',
    max: 'Maximum {n} fichiers',
    prompt: 'Glissez-déposez votre fichier ici ou {link} pour sélectionner',
    promptPlural: 'Glissez-déposez vos fichiers ici ou {link} pour sélectionner',
    removeFile: 'Supprimer le fichier',
  },

  edit: {
    description: 'Gérer les ressources et fichiers sur le serveur. Vous pouvez modifier les métadonnées et supprimer des fichiers du serveur.',
    title: 'Mettre à jour le fichier',
  },

  labels: {
    originalPath: "Chemin d'origine",
    path: 'Chemin',
  },

  meta: {
    shortTitle: 'CDN',
    title: 'Gestionnaire de fichiers',
  },

  notifications: {
    error: 'Échec du téléversement de {file}: {error}',
    successMsg: '{n} fichier téléversé avec succès | {n} fichiers téléversés avec succès',
    successTitle: 'Téléversement terminé',
  },

  page: {
    empty: 'Aucun fichier téléversé pour le moment.',
  },

  preview: {
    title: 'Aperçu',
    unavailable: 'Aperçu non disponible pour ce type de fichier',
  },

  storageUsed: 'Espace utilisé',
} as const;