export default {
  seo: {
    description: 'Alexandrie è un workspace Markdown veloce e self-hostable per note, knowledge base, collaborazione e documentazione pubblica.',
    keywords: 'note Markdown, knowledge base, note self-hosted, documentazione pubblica, collaborazione, app per prendere appunti',
    title: 'Alexandrie | Workspace Markdown moderno',
  },
  hero: {
    badges: {
      markdown: 'Markdown',
      openSource: 'Open source',
      organization: 'Organizzazione',
    },
    ctaPrimary: 'Inizia',
    ctaSecondary: 'GitHub',
    titleHighlight: 'Le tue note',
    titleSuffix: ', organizzate con eleganza',
    tagline: 'Un potente workspace Markdown progettato per velocità, chiarezza e creatività.',
    previewAlt: 'Anteprima dell’app Alexandrie',
  },
  bento: {
    title: 'Tutto ciò che serve per scrivere meglio',
    subtitle: 'Funzionalità potenti in un’interfaccia bella e intuitiva',
    editor: {
      description:
        'Scrivi con evidenziazione della sintassi, anteprima live e scorciatoie da tastiera. Supporto per tabelle, blocchi di codice, equazioni matematiche e altro.',
      heading: 'Editor Markdown potente',
      sampleHeading: 'Benvenuto in Alexandrie',
      sampleList: 'Gli elenchi sono semplici',
      sampleMarkdown: 'Scrivi le tue note in Markdown',
      sampleText: ' e ',
    },
    organization: {
      description: 'Cartelle annidate, workspace, tag e ricerca avanzata per tenere tutto al suo posto.',
      heading: 'Organizzazione intelligente',
    },
    collaboration: {
      description: 'Lavora insieme al tuo team. Condividi note, gestisci i permessi e molto altro.',
      heading: 'Collabora e condividi',
      editing: '3 persone stanno modificando...',
    },
    cdn: {
      description: 'Carica immagini e file',
      heading: 'CDN integrato',
    },
    themes: {
      description: 'Temi per ogni umore',
      extra: 'Cambia anche i colori, i temi dei documenti, aggiungi colori personalizzati, icone e altro.',
      heading: 'Chiaro e scuro',
    },
    search: {
      description: 'Ricerca full-text in tutti i tuoi documenti. Trova qualsiasi cosa in millisecondi.',
      heading: 'Ricerca fulminea',
      input: 'react hooks...',
    },
    publish: {
      description: 'Condividi il tuo lavoro pubblicamente o con persone specifiche. Genera pagine di sola lettura bellissime.',
      heading: 'Pubblica con un clic',
      status: 'Live',
      url: 'docs.tuosito.com/guide',
    },
    organizationSamples: {
      knowledgeBase: 'Knowledge Base',
      projects: 'Progetti',
      roadmap: 'Roadmap.md',
      ideas: 'Idee.md',
      development: 'Sviluppo',
      reactTips: 'React Tips.md',
    },
    searchResults: {
      customHooks: 'Custom Hooks',
      reactHooksGuide: 'Guida ai React Hooks',
      path1: 'Knowledge Base / Sviluppo',
      path2: 'Progetti / Frontend',
    },
    theme: {
      subtitle: 'Cambia anche i colori, i temi dei documenti, aggiungi colori personalizzati, icone e altro.',
    },
  },
  showcase: {
    features: [
      {
        description: 'Inizia subito a scrivere con un editor senza distrazioni. Tutto si sincronizza automaticamente.',
        points: ['Salvataggio automatico in tempo reale', 'Scorciatoie da tastiera rapide', 'Modalità senza distrazioni', 'Template per i formati più comuni'],
        shortDesc: 'Note e bozze rapide',
        title: 'Cattura le idee all’istante',
      },
      {
        description: 'Crea una knowledge base potente con cartelle annidate, workspace e tagging intelligente.',
        points: ['Cartelle annidate illimitate', 'Più workspace', 'Organizzazione basata sui tag', 'Filtri e viste intelligenti'],
        shortDesc: 'Struttura e categorizza',
        title: 'Organizza la tua conoscenza',
      },
      {
        description: 'Condividi note con il tuo team, gestisci i permessi e collabora in tempo reale.',
        points: ['Permessi granulari', 'Collaborazione in tempo reale', 'Commenti e feedback', 'Storico delle attività'],
        shortDesc: 'Workflow di team',
        title: 'Collabora senza attriti',
      },
      {
        description: 'Trasforma le tue note in splendida documentazione pubblica con un clic.',
        points: ['Domini personalizzati', 'SEO ottimizzato', 'Analytics integrate', 'Protezione con password'],
        shortDesc: 'Vai online subito',
        title: 'Pubblica e condividi',
      },
    ],
    subtitle: 'Scopri come Alexandrie semplifica l’intero flusso di lavoro',
    title: 'Dall’idea alla documentazione pubblicata',
  },
  selfHost: {
    notes: ['Nessuna telemetria', 'Piena proprietà dei dati', 'Licenza MIT', 'Pronto per Docker'],
    steps: [
      {
        description:
          'Scarica i file di configurazione da GitHub <br /> <a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml">Scarica il file docker-compose.yml</a> <br /><a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/.env.example">Scarica il file .env.example</a> ',
        title: 'Clona il repository',
      },
      {
        code: 'cp .env.example .env && nano .env',
        description: 'Modifica le variabili d’ambiente se necessario (opzionale)',
        title: 'Configura',
      },
      {
        code: 'docker compose up -d',
        description: 'Avvia tutti i servizi con Docker Compose',
        title: 'Avvia',
      },
    ],
    subtitle: 'Prendi il controllo completo dei tuoi dati con una semplice distribuzione',
    terminal: {
      lines: ['[+] Running 3/3', '✓ Container alexandrie-db Started', '✓ Container alexandrie-minio Started', '✓ Container alexandrie-app Started'],
      title: 'Terminale',
    },
    title: 'Self-host in pochi minuti',
  },
  stats: {
    actions: {
      contribute: 'Contribuisci',
      star: 'Metti una stella su GitHub',
      tryApp: 'Prova l’app',
    },
    badge: 'Open source',
    cardDescription: 'Lo spazio di lavoro open source per chi pensa in Markdown',
    labels: {
      contributors: 'Contributori',
      latestRelease: 'Ultima release',
      stars: 'Stelle GitHub',
    },
    subtitle: 'Sviluppo trasparente, decisioni guidate dalla comunità e accesso completo al codice sorgente',
    title: 'Costruito in pubblico',
  },
  contributors: {
    commitLabel: 'commit',
    cta: 'Diventa un contributore',
    subtitle: 'Incontra le persone straordinarie che rendono possibile Alexandrie',
    title: 'Costruito dalla comunità',
  },
  faq: {
    answer1:
      'Sì, Alexandrie è open source al 100% sotto licenza MIT. Puoi usarlo, modificarlo e distribuirlo liberamente. Nessun costo nascosto, nessun piano premium.',
    answer2: 'Assolutamente! Puoi eseguire Alexandrie sulla tua infrastruttura usando Docker. La documentazione completa ti aiuta a partire in pochi minuti.',
    answer3: 'Sì, Alexandrie è progettato secondo principi offline-first. Le tue note sono disponibili localmente e si sincronizzano quando torni online.',
    answer4: 'Quando lo self-hosti, i tuoi dati restano sul tuo server. Usiamo pratiche di sicurezza standard e tutta la trasmissione dei dati è cifrata.',
    answer5:
      'Sì! Puoi importare file Markdown da altre app come Notion, Obsidian o qualsiasi editor Markdown. È supportata anche l’esportazione in PDF ben formattata.',
    answer6: 'Certamente! Supportiamo l’evidenziazione della sintassi per oltre 100 linguaggi di programmazione e il rendering di equazioni matematiche LaTeX.',
    answer7: 'Alexandrie è una web app responsive che funziona benissimo sui browser mobili. Le app native sono nella roadmap.',
    ctaDescription: 'Non trovi quello che cerchi? Unisciti alla nostra community!',
    ctaTitle: 'Hai ancora domande?',
    discord: 'Unisciti a Discord',
    subtitle: 'Tutto quello che devi sapere su Alexandrie',
    title: 'Domande frequenti',
    questions: [
      'Alexandrie è davvero gratuito e open source?',
      'Posso self-hostare Alexandrie sul mio server?',
      'Alexandrie funziona offline?',
      'Come vengono archiviati e protetti i miei dati?',
      'Posso importare le mie note da altre app?',
      'Supporta blocchi di codice ed equazioni matematiche?',
      'Esiste un’app mobile?',
    ],
  },
  cta: {
    discord: 'server Discord',
    description: 'Unisciti a noi in questo percorso per prendere note migliori.',
    title: 'Pronto a prendere note migliori?',
    button: 'Inizia ora',
    contributionPrefix: 'Vuoi contribuire o discutere? Dai un’occhiata al nostro',
  },
  support: {
    badge: 'Una parola dal creatore',
    confirm: 'Capisco, grazie!',
    paragraph1:
      'Alexandrie non è nato come un business. È iniziato come uno strumento che volevo per me stesso. Anni dopo, lo mantengo e lo miglioro nel tempo libero, e sono felice di condividerlo con chiunque lo trovi utile.',
    paragraph2:
      'L’applicazione non ti traccia, non mostra pubblicità ed è completamente open source. Tuttavia, mantenere attiva la piattaforma comporta costi di hosting e infrastruttura. Se Alexandrie aggiunge valore al tuo flusso di lavoro, considera di sostenerne l’indipendenza. Anche una piccola donazione aiuta a coprire i server per mesi.',
    title: 'Alexandrie è gratuito, e lo resterà.',
    signature: '— Smaug',
    cards: {
      sponsorDesc: 'Aiuta a coprire hosting, backup e costi di sviluppo per mantenere Alexandrie online e indipendente.',
      sponsorTitle: 'Sostieni economicamente',
      starDesc: 'Mostra il tuo supporto e aiuta altri sviluppatori a scoprire il progetto. Non costa nulla ma vale moltissimo.',
      starTitle: 'Metti una stella su GitHub',
    },
  },
  footer: {
    brandDescription: 'Lo spazio di lavoro open source per sviluppatori che pensano in Markdown. Documenti belli, organizzazione potente, zero attrito.',
    madeWith: 'Realizzato con',
    columns: {
      community: 'Community',
      legal: 'Legale',
      product: 'Prodotto',
      resources: 'Risorse',
    },
    links: {
      about: 'Informazioni',
      apiReference: 'Riferimento API',
      changelog: 'Changelog',
      contribute: 'Contribuisci',
      dashboard: 'Dashboard',
      discord: 'Discord',
      documentation: 'Documentazione',
      features: 'Funzionalità',
      github: 'GitHub',
      issues: 'Issue',
      mitLicense: 'Licenza MIT',
      privacyPolicy: 'Informativa sulla privacy',
      roadmap: 'Roadmap',
      terms: 'Termini di servizio',
    },
    by: 'da',
  },
};
