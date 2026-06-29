export default {
  actions: {
    cancel: 'Abbrechen',
    importAll: 'Alle importieren',
    importing: 'Importiere...',
    optionsTitle: 'Importoptionen',
    extractFrontMatter: 'Anfangstext als Metadaten extrahieren',
    normalizeLineEndings: 'Zeilenenden normalisieren',
    preserveTimestamps: 'Ursprüngliche Zeitstempel beibehalten',
    skipExisting: 'Bereits vorhandene Dokumente überspringen (nur neue importieren)',
  },

  advanced: {
    options: 'Erweiterte Importoptionen',
    defaultParent: 'Standardübergeordnete Kategorie für importierte Dokumente',
    defaultDescription: 'Standardbeschreibung für importierte Dokumente',
    defaultTags: 'Standard-Tags für importierte Dokumente (durch Kommas getrennt)',
    defaultColor: 'Standardfarbe für importierte Dokumente',
    defaultThumbnail: 'Standard-Miniaturansicht für importierte Dokumente (SVG oder Unicode-Emoji)',
    defaultIcon: 'Standard-Symbol für importierte Dokumente (SVG oder Unicode-Emoji)',
    defaultTheme: 'Standarddesign für importierte Dokumente',
  },

  files: {
    meta: {
      title: 'Aus Markdown-Dateien importieren',
      description: 'Markdown-Dateien schnell importieren mit Optionen für Speicherort und Verarbeitung.',
    },
    importable:
      'Du kannst Markdown-Dateien oder einen Ordner mit Markdown-Dateien importieren. Ordner werden rekursiv importiert, wobei ihre Struktur beibehalten wird, wenn du die Option „Alle importieren“ wählst.',
    toImport: 'Zu importierende Elemente',
  },

  categories: {
    backup: {
      title: 'Aus Backup importieren',
      description: 'Stelle ein vollständiges Alexandrie-Backup mit Dokumenten und Einstellungen wieder her.',
    },
    files: {
      title: 'Aus Dateien importieren',
      description: 'Dokumente aus Markdown-Dateien mit variablen Optionen importieren.',
    },
    advanced: {
      title: 'Erweiterter Import',
      description: 'Importiere gesamte Ordner (einschließlich Unterordner & Uploads) mit benutzerdefinierten Optionen für maximale Kontrolle.',
    },
  },

  header: {
    changeFile: 'Datei ändern',
    created: 'Erstellt',
    documents: 'Dokumente',
    files: 'Dateien',
    metadata: 'Metadaten',
    settings: 'Einstellungen',
    title: 'Informationen zum Backup',
    totalDocuments: 'Gesamtanzahl der Dokumente',
    totalSize: 'Gesamtgröße',
    version: 'Version',
  },

  meta: {
    breadcrumb: 'Importe',
    description: 'Du kannst Dokumente aus einem früheren Export importieren. Falls du keinen hast, erstelle ihn über die',
    settingsLink: 'Einstellungen',
    title: 'Dokumente importieren',
  },

  notifications: {
    importCompleteMessage: 'Die Dokumente wurden erfolgreich importiert.',
    importCompleteTitle: 'Import abgeschlossen',
    importFailedMessage: 'Während des Imports ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    importFailedTitle: 'Import fehlgeschlagen',
    localImportedMessage: 'Deine lokalen Einstellungen wurden durch die Backup-Datei ersetzt.',
    localImportedTitle: 'Lokale Einstellungen importiert',
  },

  progress: {
    title: 'Importfortschritt',
  },

  steps: {
    select: {
      analyzing: 'Analysiere...',
      startImport: 'Import starten',
    },
  },

  summary: {
    documentsToUpdate: 'Zu aktualisierende Dokumente',
    newDocuments: 'Neue Dokumente',
    title: 'Importübersicht',
    unchanged: 'Unverändert',
  },

  tabs: {
    backup: 'Backup',
    current: 'Aktuell',
    import: 'Import',
    importFromBackup: 'Aus Backup importieren',
    importLocalSettings: 'Lokale Einstellungen importieren',
    importSelected: 'Importauswahl ({count})',
    localSettings: 'Lokale Einstellungen und Voreinstellungen',
    localSettingsAvailable: 'Lokale Einstellungen und Voreinstellungen können importiert werden',
    localSettingsWarning: 'Dadurch werden deine aktuellen lokalen Einstellungen, einschließlich der Textbausteine, überschrieben',
    newDocuments: 'Neue Dokumente',
    noLocalSettings: 'Im Backup wurden keine lokalen Einstellungen gefunden',
    noNewDocuments: 'Es gibt keine neuen Dokumente zu importieren',
    noUpdates: 'Es gibt keine Dokumente zu aktualisieren',
    replaceLocalSettings: 'Sollen deine lokalen Einstellungen durch das Backup ersetzt werden?',
    selectAll: 'Alle auswählen',
    updates: 'Aktualisierungen',
    updateSelected: 'Auswahl aktualisieren ({count})',
  },
};
