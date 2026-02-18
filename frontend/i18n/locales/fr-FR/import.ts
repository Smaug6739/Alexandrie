export default {
  meta: {
    title: 'Importer des documents',
    description:
      "Vous pouvez importer des documents depuis une exportation précédente. Si vous n'avez pas d'exportation, vous pouvez en créer une depuis la page",
    settingsLink: 'paramètres',
    breadcrumb: 'Importations',
  },

  steps: {
    select: {
      startImport: "Démarrer l'importation",
      analyzing: 'Analyse en cours...',
    },
  },

  header: {
    title: 'Informations de sauvegarde',
    changeFile: 'Changer de fichier',
    created: 'Créé',
    version: 'Version',
    totalDocuments: 'Total des documents',
    totalSize: 'Taille totale',
    documents: 'Documents',
    files: 'Fichiers',
    metadata: 'Métadonnées',
    settings: 'Paramètres',
  },

  summary: {
    title: "Résumé de l'importation",
    newDocuments: 'Nouveaux documents',
    documentsToUpdate: 'Documents à mettre à jour',
    unchanged: 'Inchangés',
  },

  actions: {
    optionsTitle: "Options d'importation",
    preserveTimestamps: 'Conserver les horodatages originaux',
    skipExisting: 'Ignorer les documents existants (importer uniquement les nouveaux)',
    cancel: 'Annuler',
    importAll: 'Tout importer',
    importing: 'Importation...',
  },

  tabs: {
    newDocuments: 'Nouveaux documents',
    updates: 'Mises à jour',
    localSettings: 'Paramètres locaux et préférences',
    noNewDocuments: 'Aucun nouveau document à importer',
    noUpdates: 'Aucun document à mettre à jour',
    selectAll: 'Tout sélectionner',
    importSelected: 'Importer la sélection ({count})',
    updateSelected: 'Mettre à jour la sélection ({count})',
    import: 'Importer',
    current: 'Actuel',
    backup: 'Sauvegarde',
    importFromBackup: 'Importer depuis la sauvegarde',
    noLocalSettings: 'Aucun paramètre local trouvé dans la sauvegarde',
    localSettingsAvailable: 'Les paramètres locaux et préférences peuvent être importés',
    replaceLocalSettings: 'Voulez-vous remplacer vos paramètres locaux par ceux de la sauvegarde ?',
    localSettingsWarning: 'Cela écrasera vos paramètres locaux actuels, y compris <strong>vos snippets</strong>',
    importLocalSettings: 'Importer les paramètres locaux',
  },
} as const;
