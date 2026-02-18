export default {
  actions: {
    cancel: 'Annuler',
    importAll: 'Tout importer',
    importing: 'Importation...',
    optionsTitle: "Options d'importation",
    preserveTimestamps: 'Conserver les horodatages originaux',
    skipExisting: 'Ignorer les documents existants (importer uniquement les nouveaux)',
  },

  header: {
    changeFile: 'Changer de fichier',
    created: 'Créé',
    documents: 'Documents',
    files: 'Fichiers',
    metadata: 'Métadonnées',
    settings: 'Paramètres',
    title: 'Informations de sauvegarde',
    totalDocuments: 'Total des documents',
    totalSize: 'Taille totale',
    version: 'Version',
  },

  meta: {
    breadcrumb: 'Importations',
    description:
      "Vous pouvez importer des documents depuis une exportation précédente. Si vous n'avez pas d'exportation, vous pouvez en créer une depuis la page",
    settingsLink: 'paramètres',
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
} as const;
