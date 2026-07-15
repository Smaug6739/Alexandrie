export default {
  seo: {
    description:
      'Alexandrie ist ein schnelles, selbst hostbares Markdown-Arbeitsumfeld für Notizen, Wissensdatenbanken, Zusammenarbeit und öffentliche Dokumentation.',
    keywords: 'Markdown-Notizen, Wissensdatenbank, selbst gehostete Notizen, öffentliche Dokumentation, Zusammenarbeit, Notiz-App',
    title: 'Alexandrie | Moderne Markdown-Arbeitsumgebung',
  },
  hero: {
    badges: {
      markdown: 'Markdown',
      openSource: 'Open Source',
      organization: 'Organisation',
    },
    ctaPrimary: 'Loslegen',
    ctaSecondary: 'GitHub',
    titleHighlight: 'Deine Notizen',
    titleSuffix: ', schön organisiert',
    tagline: 'Eine leistungsstarke Markdown-Arbeitsumgebung für Geschwindigkeit, Klarheit und Kreativität.',
    previewAlt: 'Vorschau der Alexandrie-App',
  },
  bento: {
    title: 'Alles, was du zum besseren Schreiben brauchst',
    subtitle: 'Leistungsstarke Funktionen in einer schönen, intuitiven Oberfläche',
    editor: {
      description:
        'Schreibe mit Syntax-Highlighting, Live-Vorschau und Tastenkürzeln. Tabellen, Codeblöcke, mathematische Gleichungen und mehr werden unterstützt.',
      heading: 'Leistungsstarker Markdown-Editor',
      sampleHeading: 'Willkommen bei Alexandrie',
      sampleList: 'Listen sind einfach',
      sampleMarkdown: 'Schreibe deine Notizen in Markdown',
      sampleText: ' und ',
    },
    organization: {
      description: 'Verschachtelte Ordner, Workspaces, Tags und leistungsstarke Suche halten alles am richtigen Platz.',
      heading: 'Intelligente Organisation',
    },
    collaboration: {
      description: 'Arbeite mit deinem Team zusammen. Teile Notizen, verwalte Berechtigungen und mehr.',
      heading: 'Zusammenarbeiten und teilen',
      editing: '3 Personen bearbeiten...',
    },
    cdn: {
      description: 'Bilder und Dateien hochladen',
      heading: 'Integriertes CDN',
    },
    themes: {
      description: 'Themes für jede Stimmung',
      extra: 'Ändere außerdem Farben, Dokument-Designs, füge benutzerdefinierte Farben, Icons und mehr hinzu.',
      heading: 'Dunkel & Hell',
    },
    search: {
      description: 'Volltextsuche über alle Dokumente. Finde alles in Millisekunden.',
      heading: 'Blitzschnelle Suche',
      input: 'react hooks...',
    },
    publish: {
      description: 'Teile deine Arbeit öffentlich oder mit bestimmten Personen. Erzeuge schöne schreibgeschützte Seiten.',
      heading: 'Veröffentlichen mit einem Klick',
      status: 'Live',
      url: 'docs.deineseite.com/guide',
    },
    organizationSamples: {
      knowledgeBase: 'Wissensdatenbank',
      projects: 'Projekte',
      roadmap: 'Roadmap.md',
      ideas: 'Ideen.md',
      development: 'Entwicklung',
      reactTips: 'React Tips.md',
    },
    searchResults: {
      customHooks: 'Eigene Hooks',
      reactHooksGuide: 'React-Hooks-Leitfaden',
      path1: 'Wissensdatenbank / Entwicklung',
      path2: 'Projekte / Frontend',
    },
    theme: {
      subtitle: 'Ändere außerdem Farben, Dokumentdesigns, füge benutzerdefinierte Farben, Icons und mehr hinzu.',
    },
  },
  showcase: {
    features: [
      {
        description: 'Beginne sofort mit dem Schreiben dank ablenkungsfreiem Editor. Alles synchronisiert automatisch.',
        points: ['Echtzeit-Autospeichern', 'Schnelle Tastenkürzel', 'Ablenkungsfreier Modus', 'Vorlagen für gängige Formate'],
        shortDesc: 'Schnelle Notizen & Entwürfe',
        title: 'Ideen sofort erfassen',
      },
      {
        description: 'Erstelle eine leistungsstarke Wissensdatenbank mit verschachtelten Ordnern, Workspaces und intelligentem Tagging.',
        points: ['Unbegrenzte verschachtelte Ordner', 'Mehrere Workspaces', 'Tag-basierte Organisation', 'Intelligente Filter und Ansichten'],
        shortDesc: 'Strukturieren & kategorisieren',
        title: 'Wissen organisieren',
      },
      {
        description: 'Teile Notizen mit deinem Team, verwalte Berechtigungen und arbeite in Echtzeit zusammen.',
        points: ['Feingranulare Berechtigungen', 'Echtzeit-Zusammenarbeit', 'Kommentare & Feedback', 'Aktivitätsverlauf'],
        shortDesc: 'Team-Workflows',
        title: 'Nahtlos zusammenarbeiten',
      },
      {
        description: 'Verwandle deine Notizen mit einem Klick in schöne öffentliche Dokumentation.',
        points: ['Eigene Domains', 'SEO-optimiert', 'Analytics integriert', 'Passwortschutz'],
        shortDesc: 'Sofort live gehen',
        title: 'Veröffentlichen & teilen',
      },
    ],
    subtitle: 'Sieh, wie Alexandrie deinen gesamten Workflow vereinfacht',
    title: 'Von der Idee zur veröffentlichten Doku',
  },
  selfHost: {
    notes: ['Kein Telemetrie-Tracking', 'Volle Datenhoheit', 'MIT-Lizenz', 'Docker-bereit'],
    steps: [
      {
        description:
          'Lade die Konfigurationsdateien von GitHub herunter <br /> <a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml">docker-compose.yml herunterladen</a> <br /><a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/.env.example">.env.example herunterladen</a> ',
        title: 'Repository klonen',
      },
      {
        code: 'cp .env.example .env && nano .env',
        description: 'Passe die Umgebungsvariablen bei Bedarf an (optional)',
        title: 'Konfigurieren',
      },
      {
        code: 'docker compose up -d',
        description: 'Starte alle Dienste mit Docker Compose',
        title: 'Starten',
      },
    ],
    subtitle: 'Beherrsche deine Daten mit einem einfachen Deployment vollständig selbst',
    terminal: {
      lines: ['[+] Running 3/3', '✓ Container alexandrie-db Started', '✓ Container alexandrie-minio Started', '✓ Container alexandrie-app Started'],
      title: 'Terminal',
    },
    title: 'In wenigen Minuten selbst hosten',
  },
  stats: {
    actions: {
      contribute: 'Mitwirken',
      star: 'Auf GitHub markieren',
      tryApp: 'App ausprobieren',
    },
    badge: 'Open Source',
    cardDescription: 'Die Open-Source-Arbeitsumgebung für Menschen, die in Markdown denken',
    labels: {
      contributors: 'Mitwirkende',
      latestRelease: 'Neueste Version',
      stars: 'GitHub-Sterne',
    },
    subtitle: 'Transparente Entwicklung, gemeinschaftsgetriebene Entscheidungen und voller Zugriff auf den Quellcode',
    title: 'Offen entwickelt',
  },
  contributors: {
    commitLabel: 'Commits',
    cta: 'Mitwirkender werden',
    subtitle: 'Lerne die großartigen Menschen kennen, die Alexandrie möglich machen',
    title: 'Von der Community gebaut',
  },
  faq: {
    answer1:
      'Ja, Alexandrie ist zu 100 % Open Source unter der MIT-Lizenz. Du kannst es frei nutzen, ändern und weitergeben. Keine versteckten Kosten, keine Premium-Stufen.',
    answer2:
      'Absolut! Du kannst Alexandrie mit Docker auf deiner eigenen Infrastruktur betreiben. Eine vollständige Dokumentation hilft dir beim Start in wenigen Minuten.',
    answer3:
      'Ja, Alexandrie ist nach Offline-First-Prinzipien gebaut. Deine Notizen sind lokal verfügbar und synchronisieren sich, sobald du dich wieder verbindest.',
    answer4:
      'Beim Self-Hosting bleiben deine Daten auf deinem eigenen Server. Wir verwenden etablierte Sicherheitspraktiken und alle Datenübertragungen sind verschlüsselt.',
    answer5:
      'Ja! Du kannst Markdown-Dateien aus anderen Apps wie Notion, Obsidian oder jedem Markdown-Editor importieren. Export zu PDF mit schöner Formatierung wird ebenfalls unterstützt.',
    answer6: 'Auf jeden Fall! Wir unterstützen Syntax-Highlighting für über 100 Programmiersprachen und die Darstellung von LaTeX-Mathematikgleichungen.',
    answer7: 'Alexandrie ist eine responsive Webanwendung, die auf Mobilgeräten hervorragend funktioniert. Native Apps sind auf der Roadmap.',
    ctaDescription: 'Du findest nicht, wonach du suchst? Werde Teil unserer Community!',
    ctaTitle: 'Noch Fragen?',
    discord: 'Discord beitreten',
    subtitle: 'Alles, was du über Alexandrie wissen musst',
    title: 'Häufig gestellte Fragen',
    questions: [
      'Ist Alexandrie wirklich kostenlos und Open Source?',
      'Kann ich Alexandrie auf meinem eigenen Server selbst hosten?',
      'Funktioniert Alexandrie offline?',
      'Wie werden meine Daten gespeichert und geschützt?',
      'Kann ich meine Notizen aus anderen Apps importieren?',
      'Unterstützt es Codeblöcke und mathematische Gleichungen?',
      'Gibt es eine mobile App?',
    ],
  },
  cta: {
    discord: 'Discord-Server',
    description: 'Begleite uns auf dem Weg zu besserem Notieren.',
    title: 'Bereit für bessere Notizen?',
    button: 'Jetzt starten',
    contributionPrefix: 'Möchtest du mitwirken oder dich austauschen? Schau dir unseren',
  },
  support: {
    badge: 'Ein Wort vom Ersteller',
    confirm: 'Ich verstehe, danke!',
    paragraph1:
      'Alexandrie begann nicht als Geschäft. Es war zuerst ein Werkzeug, das ich für mich selbst wollte. Jahre später pflege und verbessere ich es immer noch in meiner Freizeit und teile es gern mit allen, die es nützlich finden.',
    paragraph2:
      'Die Anwendung verfolgt dich nicht, zeigt keine Anzeigen und ist vollständig Open Source. Der Betrieb der Live-Plattform verursacht jedoch Hosting- und Infrastrukturkosten. Wenn Alexandrie deinem Arbeitsalltag hilft, erwäge, seine Unabhängigkeit zu unterstützen. Schon die kleinste Spende hilft, die Server monatelang zu bezahlen.',
    title: 'Alexandrie ist kostenlos und bleibt es auch.',
    signature: '— Smaug',
    cards: {
      sponsorDesc: 'Hilf dabei, Hosting, Backups und Entwicklungskosten zu decken, damit Alexandrie online und unabhängig bleibt.',
      sponsorTitle: 'Finanziell unterstützen',
      starDesc: 'Zeige deine Unterstützung und hilf anderen Entwicklern, das Projekt zu entdecken. Es kostet nichts und bedeutet alles.',
      starTitle: 'Auf GitHub markieren',
    },
  },
  footer: {
    brandDescription: 'Die Open-Source-Arbeitsumgebung für Entwickler, die in Markdown denken. Schöne Doku, starke Organisation, kein Reibungsverlust.',
    madeWith: 'Gemacht mit',
    columns: {
      community: 'Community',
      legal: 'Rechtliches',
      product: 'Produkt',
      resources: 'Ressourcen',
    },
    links: {
      about: 'Über uns',
      apiReference: 'API-Referenz',
      changelog: 'Änderungsprotokoll',
      contribute: 'Mitwirken',
      dashboard: 'Dashboard',
      discord: 'Discord',
      documentation: 'Dokumentation',
      features: 'Funktionen',
      github: 'GitHub',
      issues: 'Issues',
      mitLicense: 'MIT-Lizenz',
      privacyPolicy: 'Datenschutzerklärung',
      roadmap: 'Roadmap',
      terms: 'Nutzungsbedingungen',
    },
    by: 'von',
  },
};
