export default {
  nodes: 'Nodi',
  actions: {
    editMeta: 'Modifica metadati',
    exportAsMarkdown: 'Esporta come Markdown',
    managePermissions: 'Gestisci permessi',
    newDocument: '+ Crea nuovo documento',
    publicLink: 'Link pubblico',
    removeFromShared: 'Rimuovi dai condivisi',
    resetBoard: 'Ripristina lavagna',
  },

  category: {
    editTitle: 'Categoria e area di lavoro',
    iconHint: 'Supporta gli SVG',
    name: 'Categoria | Categorie',
    new: 'Nuova categoria',
    notifications: {
      created: 'Categoria creata con successo',
      creationError: 'Errore durante la creazione della categoria',
      updated: 'Categoria aggiornata',
    },
    orderHint: 'Ordine della categoria nella barra laterale',
    uncategorized: 'Senza categoria',
  },

  container: {
    createNewDocument: '+ Crea nuovo documento',
    import: 'Importa',
    newCategory: '+ Categoria',
    newWorkspace: '+ Area di lavoro',
    noDocuments: 'Nessun documento trovato',
    noDocumentsDescription: 'Non ci sono documenti in questa categoria',
    noWorkspaces: 'Nessuna area di lavoro o categoria trovata',
    searchPlaceholder: 'Cerca un\'area di lavoro...',
    title: 'Aree di lavoro e Categorie',
  },

  document: {
    childs: 'Documenti figli',
    editPage: 'Modifica pagina',
    lastUpdated: 'Ultimo aggiornamento',
    nextPage: 'Pagina successiva',
    prevPage: 'Pagina precedente',
    TOC: 'Indice dei contenuti',
  },

  filter: {
    footer: '{count} / {total} corrispondenze',
    title: 'Filtra nodi',
    toClose: 'per chiudere',
  },

  modals: {
    delete: {
      bulkCount: 'Questa azione eliminerà {count} nodi.',
      confirm: 'Sei sicuro di voler eliminare questo {type}?',
      confirmBulk: 'Sei sicuro di voler eliminare i nodi selezionati?',
      hasChildren: 'Questo {type} ha {count} documenti figli. Verranno eliminati anche essi.',
      irreversible: 'Questa azione è irreversibile',
      title: 'Elimina {type}',
      titleBulk: 'Elimina nodi',
    },
    join: {
      access: 'Accesso al nodo',
      title: 'Entra in un team o in un\'area di lavoro',
      subtitle:
        'Incolla un codice di invito o un link di invito completo. Se sei già entrato in questa area di lavoro con un livello di permesso differente, verrà mantenuto solo quello più alto.',
      label: 'Codice o link di invito',
      join: 'Entra',
      joining: 'Accesso in corso...',
      inputPlaceholder: 'ABC123 o https://.../join-workspace?code=ABC123',
    },
    metadata: {
      emojiOrIcon: 'Emoji o icona',
      emojiOrIconHint: 'Supporta SVG o emoji',
      thumbnail: 'Miniatura',
      thumbnailHint: 'Supporta gli SVG',
      title: 'Metadati',
    },
    permissions: {
      addPermission: 'Aggiungi',
      defaultPermission: 'Permesso predefinito per i nuovi utenti',
      generalAccess: 'Accesso generale',
      inviteLabel: 'Inviti del nodo',
      inviteCreate: 'Crea invito',
      inviteCreateProgress: 'Creazione invito in corso...',
      inviteEmpty: 'Nessun invito presente',
      invitePermission: 'Permesso',
      managePermissions: 'Gestisci permessi',
      noPermissions: 'Nessun permesso impostato',
      noResults: 'Nessun risultato trovato',
      publicInfo: 'Questo documento sarà accessibile pubblicamente tramite un URL unico.',
      removePermission: 'Rimuovi permesso',
      searchPlaceholder: 'Nome utente o email',
      searchUser: 'Cerca un utente',
      shareLink: 'Condividi questo link per consentire a chiunque di visualizzare il documento senza un account:',
      title: 'Gestisci permessi',
    },
    removeShared: {
      childWarning: 'Questo documento ha {count} documento/i figlio. Verranno rimossi anche essi.',
      confirm: 'Sei sicuro di voler rimuovere questo documento?',
      noAccess: 'Dopo questa azione non avrai più accesso a questo documento.',
      success: 'Documento rimosso',
      title: 'Rimuovi questo documento',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Cosa vuoi fare?',
    actionCreateDocument: 'Crea nuovo documento',
    actionCreateDocumentDesc: 'Crea un nuovo documento Markdown con il contenuto condiviso',
    actionUploadResource: 'Carica come risorsa',
    actionUploadResourceDesc: 'Carica il contenuto condiviso come risorsa (immagine, PDF, ecc.) e ottieni un link da inserire nei tuoi documenti',
    chooseDestination: 'Scegli dove vuoi salvare questo contenuto.',
    description: 'Contenuto ricevuto da un\'altra app.',
    sharedContent: 'Contenuto condiviso',
    title: 'Condividi contenuto',
  },

  tags: 'Tag',

  types: {
    category: 'Categoria | Categorie',
    document: 'Documento | Documenti',
    resource: 'Risorsa',
    workspace: 'Area di lavoro',
  },

  workspace: {
    all: 'Tutte le aree di lavoro',
    new: 'Nuova area di lavoro',
    shared: 'Condivisi con me',
  },
};
