export default {
  meta: {
    title: 'Gestionnaire de fichiers',
    shortTitle: 'CDN',
  },

  page: {
    empty: 'Aucun fichier téléversé pour le moment.',
  },

  labels: {
    originalPath: "Chemin d'origine",
    path: 'Chemin',
  },

  actions: {
    upload: {
      idle: 'Téléverser',
      multiple: 'Téléverser {n} fichier | Téléverser {n} fichiers',
      progress: 'Téléversement de {n} / {total}',
    },
    download: 'Télécharger le fichier',
  },

  notifications: {
    successTitle: 'Téléversement terminé',
    successMsg: '{n} fichier téléversé avec succès | {n} fichiers téléversés avec succès',
    error: 'Échec du téléversement de {file}: {error}',
  },

  preview: {
    title: 'Aperçu',
    unavailable: 'Aperçu non disponible pour ce type de fichier',
  },

  edit: {
    title: 'Mettre à jour le fichier',
    description: 'Gérer les ressources et fichiers sur le serveur. Vous pouvez modifier les métadonnées et supprimer des fichiers du serveur.',
  },

  appdrop: {
    prompt: 'Glissez-déposez votre fichier ici ou {link} pour sélectionner',
    promptPlural: 'Glissez-déposez vos fichiers ici ou {link} pour sélectionner',
    link: 'cliquez ici',
    removeFile: 'Supprimer le fichier',
    addMore: 'Ajouter plus de fichiers',
    max: 'Maximum {n} fichiers',
  },
} as const;
