export default {
  actions: {
    editMeta: 'Metadaten bearbeiten',
    exportAsMarkdown: 'Als Markdown exportieren',
    managePermissions: 'Berechtigungen verwalten',
    newDocument: '+ Neues Dokument erstellen',
    publicLink: 'Öffentlicher Link',
    removeFromShared: 'Aus der Freigabe entfernen',
    resetBoard: 'Board zurücksetzen',
  },

  category: {
    editTitle: 'Kategorie & Arbeitsbereich',
    iconHint: 'SVG wird unterstützt',
    name: 'Kategorie | Kategorien',
    new: 'Neue Kategorie',
    notifications: {
      created: 'Kategorie erfolgreich erstellt',
      creationError: 'Fehler beim Erstellen der Kategorie',
      updated: 'Kategorie aktualisiert',
    },
    orderHint: 'Reihenfolge der Kategorien in der Seitenleiste',
    uncategorized: 'Unkategorisiert',
  },

  container: {
    createNewDocument: '+ Neues Dokument erstellen',
    import: 'Import',
    newCategory: '+ Kategorie',
    newWorkspace: '+ Arbeitsbereich',
    noDocuments: 'Es wurden keine Dokumente gefunden',
    noDocumentsDescription: 'Es gibt keine Dokumente in dieser Kategorie',
    noWorkspaces: 'Es wurde kein Arbeitsbereich und keine Kategorie gefunden',
    searchPlaceholder: 'Einen Arbeitsbereich suchen...',
    title: 'Arbeitsbereiche & Kategorien',
  },

  document: {
    childs: 'Untergeordnete Dokumente',
    editPage: 'Seite bearbeiten',
    lastUpdated: 'Zuletzt aktualisiert',
    nextPage: 'Nächste Seite',
    prevPage: 'Vorherige Seite',
    TOC: 'Inhaltsverzeichnis',
  },

  filter: {
    footer: '{count} / {total} Treffer',
    title: 'Nodes filtern',
    toClose: 'zum Schließen',
  },

  modals: {
    delete: {
      bulkCount: 'Durch diesen Vorgang werden {count} Nodes gelöscht.',
      confirm: 'Möchtest du {type} wirklich löschen?',
      confirmBulk: 'Möchtest du die ausgewählten Nodes wirklich löschen?',
      hasChildren: '{Typ} hat {Anzahl} untergeordnete Dokumente. Diese werden ebenfalls gelöscht.',
      irreversible: 'Dieser Vorgang ist unwiderruflich',
      title: 'Lösche {type}',
      titleBulk: 'Nodes löschen',
    },
    metadata: {
      emojiOrIcon: 'Emoji oder Symbol',
      emojiOrIconHint: 'SVG oder Emojis werden unterstützt',
      thumbnail: 'Vorschaubild',
      thumbnailHint: 'SVG wird unterstützt',
      title: 'Metadaten',
    },
    permissions: {
      addPermission: 'Hinzufügen',
      defaultPermission: 'Standardberechtigung für neue Benutzer',
      generalAccess: 'Allgemeiner Zugang',
      managePermissions: 'Berechtigungen verwalten',
      noPermissions: 'Keine Berechtigungen festgelegt',
      noResults: 'Es wurden keine Ergebnisse gefunden',
      publicInfo: 'Dieses Dokument wird über eine einzigartige URL öffentlich zugänglich sein.',
      removePermission: 'Berechtigung entfernen',
      searchPlaceholder: 'Benutzername oder E-Mail-Adresse',
      searchUser: 'Benutzer suchen',
      shareLink: 'Teile diesen Link, damit jeder das Dokument ohne Konto ansehen kann:',
      title: 'Berechtigungen verwalten',
    },
    removeShared: {
      childWarning: 'Dieses Dokument hat {count} untergeordnete Dokumente. Diese werden ebenfalls entfernt.',
      confirm: 'Bist du sicher, dass du dieses Dokument löschen möchtest?',
      noAccess: 'Nach dieser Aktion hast du keinen Zugriff mehr auf dieses Dokument.',
      success: 'Dokument entfernt',
      title: 'Dieses Dokument entfernen',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Was möchtest du tun?',
    actionCreateDocument: 'Neues Dokument erstellen',
    actionCreateDocumentDesc: 'Erstelle ein neues Markdown-Dokument mit den freigegebenen Inhalten',
    actionUploadResource: 'Als Ressource hochladen',
    actionUploadResourceDesc: 'Lade die freigegebenen Inhalte als Ressource (Bild, PDF, usw.) hoch und erhalte einen Link, den du in deine Dokumente einfügen kannst',
    chooseDestination: 'Wähle aus, wo du diesen Inhalt speichern möchten.',
    description: 'Von einer anderen App empfangene Inhalte.',
    sharedContent: 'Geteilte Inhalte',
    title: 'Inhalt teilen',
  },

  tags: 'Tags',

  types: {
    category: 'Kategorie | Kategorien',
    document: 'Dokument | Dokumente',
    resource: 'Resource',
    workspace: 'Arbeitsbereich',
  },

  workspace: {
    all: 'Alle Arbeitsbereiche',
    new: 'Neuer Arbeitsbereich',
    shared: 'Mit mir geteilt',
  },
};
