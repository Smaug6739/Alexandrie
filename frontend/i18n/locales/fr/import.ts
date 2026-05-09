export default {
  actions: {
    cancel: 'Annuler',
    importAll: 'Importer tout',
    importing: 'Importation en cours...',
    optionsTitle: "Options d'importation",
    extractFrontMatter: 'Extraire les métadonnées du front matter',
    normalizeLineEndings: 'Normaliser les fins de ligne',
    preserveTimestamps: 'Conserver les horodatages originaux',
    skipExisting: 'Ignorer les documents existants (importer uniquement les nouveaux)',
  },

  advanced: {
    options: "Options d'importation avancées",
    defaultDescription: 'DDescription par défaut pour les documents importés',
    defaultTags: 'Balises par défaut pour les documents importés (séparées par des virgules)',
    defaultColor: 'Couleur par défaut pour les documents importés',
    defaultThumbnail: 'Vignette par défaut pour les documents importés (svg ou emoji unicode)',
    defaultIcon: 'Icône par défaut pour les documents importés (svg ou emoji unicode)',
    defaultTheme: 'Default theme for imported documents',
  },

  files: {
    meta: {
      title: 'Importer à partir de fichiers markdown',
      description: 'Importez rapidement des fichiers markdown avec des options pour la destination et le traitement.',
    },
    importable:
      "Vous pouvez importer des fichiers markdown ou un dossier contenant des fichiers markdown. Les dossiers seront importés de manière récursive, en préservant leur structure si vous choisissez l'option importer tout.",
    toImport: 'Éléments à importer',
  },

  categories: {
    backup: {
      title: 'Importer depuis une sauvegarde',
      description: "Restaurez une sauvegarde complète d'Alexandrie avec les documents et les paramètres.",
    },
    files: {
      title: 'Importer à partir de fichiers',
      description: 'Importez des documents à partir de fichiers markdown avec des options flexibles.',
    },
    advanced: {
      title: 'Importation avancée',
      description: 'Importez des documents en utilisant des options personnalisées pour un contrôle maximum.',
    },
  },

  header: {
    changeFile: 'Changer de fichier',
    created: 'Créé',
    documents: 'Documents',
    files: 'Fichiers',
    metadata: 'Métadonnées',
    settings: 'Paramètres',
    title: 'Informations de la sauvegarde',
    totalDocuments: 'Documents totaux',
    totalSize: 'Taille totale',
    version: 'Version',
  },

  meta: {
    breadcrumb: 'Importations',
    description: "Vous pouvez importer des documents à partir d'une sauvegarde précédente. Si vous n'en avez pas vous pouvez en créer une depuis",
    settingsLink: 'les paramètres',
    title: 'Importer des documents',
  },

  notifications: {
    importCompleteMessage: 'Les documents ont été importés avec succès.',
    importCompleteTitle: 'Importation terminée',
    importFailedMessage: "Une erreur est survenue lors de l'importation. Veuillez réessayer.",
    importFailedTitle: "Échec de l'importation",
    localImportedMessage: 'Vos paramètres locaux ont été remplacés par ceux de la sauvegarde.',
    localImportedTitle: 'Paramètres locaux importés',
  },

  steps: {
    select: {
      analyzing: 'Analyse en cours...',
      startImport: "Démarrer l'importation",
    },
  },

  summary: {
    documentsToUpdate: 'Documents à mettre à jour',
    newDocuments: 'Nouveaux documents',
    title: "Résumé de l'importation",
    unchanged: 'Inchangés',
  },

  tabs: {
    backup: 'Sauvegarde',
    current: 'Actuel',
    import: 'Importer',
    importFromBackup: 'Importer depuis la sauvegarde',
    importLocalSettings: 'Importer les paramètres locaux',
    importSelected: 'Importer la sélection ({count})',
    localSettings: 'Paramètres locaux et préférences',
    localSettingsAvailable: 'Les paramètres locaux et préférences peuvent être importés',
    localSettingsWarning: 'Cela écrasera vos paramètres locaux actuels, y compris vos snippets',
    newDocuments: 'Nouveaux documents',
    noLocalSettings: 'Aucun paramètre local trouvé dans la sauvegarde',
    noNewDocuments: 'Aucun nouveau document à importer',
    noUpdates: 'Aucun document à mettre à jour',
    replaceLocalSettings: 'Voulez-vous remplacer vos paramètres locaux par ceux de la sauvegarde ?',
    selectAll: 'Tout sélectionner',
    updates: 'Mises à jour',
    updateSelected: 'Mettre à jour la sélection ({count})',
  },
};
