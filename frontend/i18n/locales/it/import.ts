export default {
  actions: {
    cancel: 'Annulla',
    importAll: 'Importa tutto',
    importing: 'Importazione in corso...',
    optionsTitle: 'Opzioni di importazione',
    extractFrontMatter: 'Estrai front matter come metadati',
    normalizeLineEndings: 'Normalizza le interruzioni di riga',
    preserveTimestamps: 'Preserva i timestamp originali',
    skipExisting: 'Salta i documenti esistenti (importa solo quelli nuovi)',
  },

  advanced: {
    options: 'Opzioni di importazione avanzate',
    defaultParent: 'Categoria genitore predefinita per i documenti importati',
    defaultDescription: 'Descrizione predefinita per i documenti importati',
    defaultTags: 'Tag predefiniti per i documenti importati (separati da virgola)',
    defaultColor: 'Colore predefinito per i documenti importati',
    defaultThumbnail: 'Miniatura predefinita per i documenti importati (svg o emoji unicode)',
    defaultIcon: 'Icona predefinita per i documenti importati (svg o emoji unicode)',
    defaultTheme: 'Tema predefinito per i documenti importati',
  },

  files: {
    meta: {
      title: 'Importa da file markdown',
      description: 'Importa rapidamente file markdown con opzioni di destinazione ed elaborazione.',
    },
    importable:
      'Puoi importare file markdown o una cartella contenente file markdown. Le cartelle verranno importate in modo ricorsivo, preservando la loro struttura se scegli l\'opzione importa tutto.',
    toImport: 'Elementi da importare',
  },

  categories: {
    backup: {
      title: 'Importa da backup',
      description: 'Ripristina un backup completo di Alexandrie con documenti e impostazioni.',
    },
    files: {
      title: 'Importa da file',
      description: 'Importa documenti da file markdown con opzioni flessibili.',
    },
    advanced: {
      title: 'Importazione avanzata',
      description: 'Importa un\'intera cartella (incluse sottocartelle e caricamenti) utilizzando opzioni personalizzate per il massimo controllo.',
    },
  },

  header: {
    changeFile: 'Cambia file',
    created: 'Creato',
    documents: 'Documenti',
    files: 'File',
    metadata: 'Metadati',
    settings: 'Impostazioni',
    title: 'Info backup',
    totalDocuments: 'Documenti totali',
    totalSize: 'Dimensione totale',
    version: 'Versione',
  },

  meta: {
    breadcrumb: 'Importazioni',
    description: "Puoi importare documenti da un'esportazione precedente. Se non ne hai una, creala dalle",
    settingsLink: 'impostazioni',
    title: 'Importa documenti',
  },

  notifications: {
    importCompleteMessage: 'I documenti sono stati importati con successo.',
    importCompleteTitle: 'Importazione completata',
    importFailedMessage: 'Si è verificato un errore durante l\'importazione. Riprova.',
    importFailedTitle: 'Importazione fallita',
    localImportedMessage: 'Le tue impostazioni locali sono state sostituite con il backup.',
    localImportedTitle: 'Impostazioni locali importate',
  },

  progress: {
    title: 'Avanzamento importazione',
  },

  steps: {
    select: {
      analyzing: 'Analisi in corso...',
      startImport: 'Avvia importazione',
    },
  },

  summary: {
    documentsToUpdate: 'Documenti da aggiornare',
    newDocuments: 'Nuovi documenti',
    title: 'Riepilogo importazione',
    unchanged: 'Invariati',
  },

  tabs: {
    backup: 'Backup',
    current: 'Attuale',
    import: 'Importa',
    importFromBackup: 'Importa da backup',
    importLocalSettings: 'Importa impostazioni locali',
    importSelected: 'Importa selezione ({count})',
    localSettings: 'Impostazioni locali e preferenze',
    localSettingsAvailable: 'Le impostazioni locali e le preferenze possono essere importate',
    localSettingsWarning: 'Questo sovrascriverà le tue attuali impostazioni locali, inclusi gli snippet',
    newDocuments: 'Nuovi documenti',
    noLocalSettings: 'Nessuna impostazione locale trovata nel backup',
    noNewDocuments: 'Nessun nuovo documento da importare',
    noUpdates: 'Nessun documento da aggiornare',
    replaceLocalSettings: 'Vuoi sostituire le tue impostazioni locali con il backup?',
    selectAll: 'Seleziona tutto',
    updates: 'Aggiornamenti',
    updateSelected: 'Aggiorna selezione ({count})',
  },
};
