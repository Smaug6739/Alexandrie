export default {
  seo: {
    description:
      'Alexandrie est un espace Markdown rapide et auto-hébergeable pour les notes, bases de connaissances, la collaboration et la documentation publique.',
    keywords: 'notes Markdown, base de connaissances, notes auto-hébergées, documentation publique, collaboration, prise de notes',
    title: 'Alexandrie | Espace Markdown moderne',
  },
  hero: {
    badges: {
      markdown: 'Markdown',
      openSource: 'Open source',
      organization: 'Organisation',
    },
    ctaPrimary: 'Commencer',
    ctaSecondary: 'GitHub',
    titleHighlight: 'Vos notes',
    titleSuffix: ', organisées avec élégance',
    tagline: 'Un espace Markdown puissant conçu pour la vitesse, la clarté et la créativité.',
    previewAlt: 'Aperçu de l’application Alexandrie',
  },
  bento: {
    title: 'Tout ce qu’il faut pour mieux écrire',
    subtitle: 'Des fonctionnalités puissantes dans une interface belle et intuitive',
    editor: {
      description: 'Écrivez avec coloration syntaxique, aperçu en direct et raccourcis clavier. Tables, blocs de code, équations mathématiques et plus encore.',
      heading: 'Éditeur Markdown puissant',
      sampleHeading: 'Bienvenue sur Alexandrie',
      sampleList: 'Les listes sont simples',
      sampleMarkdown: 'Rédigez vos notes en Markdown',
      sampleText: ' et ',
    },
    organization: {
      description: 'Dossiers imbriqués, espaces de travail, tags et recherche avancée pour tout garder à sa place.',
      heading: 'Organisation intelligente',
    },
    collaboration: {
      description: 'Travaillez avec votre équipe. Partagez des notes, gérez les permissions et plus encore.',
      heading: 'Collaborer et partager',
      editing: '3 personnes en train d’éditer...',
    },
    cdn: {
      description: 'Téléversez des images et fichiers',
      heading: 'CDN intégré',
    },
    themes: {
      description: 'Des thèmes pour toutes les envies',
      extra: 'Changez aussi les couleurs, les thèmes de documents, ajoutez des couleurs personnalisées, des icônes et plus encore.',
      heading: 'Clair & sombre',
    },
    search: {
      description: 'Recherche plein texte dans tous vos documents. Trouvez n’importe quoi en quelques millisecondes.',
      heading: 'Recherche ultra rapide',
      input: 'react hooks...',
    },
    publish: {
      description: 'Partagez votre travail publiquement ou avec des personnes précises. Générez de belles pages en lecture seule.',
      heading: 'Publication en un clic',
      status: 'En ligne',
      url: 'docs.votresite.com/guide',
    },
    organizationSamples: {
      knowledgeBase: 'Base de connaissances',
      projects: 'Projets',
      roadmap: 'Roadmap.md',
      ideas: 'Idées.md',
      development: 'Développement',
      reactTips: 'React Tips.md',
    },
    searchResults: {
      customHooks: 'Hooks personnalisés',
      reactHooksGuide: 'Guide des React Hooks',
      path1: 'Base de connaissances / Développement',
      path2: 'Projets / Frontend',
    },
    theme: {
      subtitle: 'Changez aussi les couleurs, les thèmes de documents, ajoutez des couleurs personnalisées, des icônes et plus encore.',
    },
  },
  showcase: {
    features: [
      {
        description: 'Commencez à écrire immédiatement avec un éditeur sans distraction. Tout se synchronise automatiquement.',
        points: ['Sauvegarde automatique en temps réel', 'Raccourcis clavier rapides', 'Mode sans distraction', 'Modèles pour les formats courants'],
        shortDesc: 'Notes et brouillons rapides',
        title: 'Capturez vos idées instantanément',
      },
      {
        description: 'Créez une base de connaissances puissante avec dossiers imbriqués, espaces de travail et balisage intelligent.',
        points: ['Dossiers imbriqués illimités', 'Espaces de travail multiples', 'Organisation par tags', 'Filtres et vues intelligents'],
        shortDesc: 'Structurer et classer',
        title: 'Organisez votre savoir',
      },
      {
        description: 'Partagez des notes avec votre équipe, gérez les permissions et collaborez en temps réel.',
        points: ['Permissions granulaires', 'Collaboration en temps réel', 'Commentaires et retours', 'Historique d’activité'],
        shortDesc: 'Flux d’équipe',
        title: 'Collaborez sans friction',
      },
      {
        description: 'Transformez vos notes en belle documentation publique en un clic.',
        points: ['Domaines personnalisés', 'SEO optimisé', 'Statistiques intégrées', 'Protection par mot de passe'],
        shortDesc: 'Mise en ligne instantanée',
        title: 'Publier et partager',
      },
    ],
    subtitle: 'Découvrez comment Alexandrie simplifie tout votre flux de travail',
    title: 'De l’idée aux docs publiées',
  },
  selfHost: {
    notes: ['Aucune télémétrie', 'Propriété totale des données', 'Licence MIT', 'Prêt pour Docker'],
    steps: [
      {
        description:
          'Récupérez les fichiers de configuration depuis GitHub <br /> <a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/docker-compose.yml">Télécharger le fichier docker-compose.yml</a> <br /><a target="_blank" style="color: var(--primary);text-decoration: underline;font-weight: 500;" href="https://github.com/Smaug6739/Alexandrie/blob/main/.env.example">Télécharger le fichier .env.example</a> ',
        title: 'Cloner le dépôt',
      },
      {
        code: 'cp .env.example .env && nano .env',
        description: 'Modifiez les variables d’environnement si nécessaire (optionnel)',
        title: 'Configurer',
      },
      {
        code: 'docker compose up -d',
        description: 'Démarrez tous les services avec Docker Compose',
        title: 'Lancer',
      },
    ],
    subtitle: 'Gardez le contrôle total de vos données avec un déploiement simple',
    terminal: {
      lines: ['[+] Running 3/3', '✓ Container alexandrie-db Started', '✓ Container alexandrie-minio Started', '✓ Container alexandrie-app Started'],
      title: 'Terminal',
    },
    title: 'Auto-hébergez en quelques minutes',
  },
  stats: {
    actions: {
      contribute: 'Contribuer',
      star: 'Mettre une étoile sur GitHub',
      tryApp: 'Essayer l’application',
    },
    badge: 'Open source',
    cardDescription: 'L’espace de travail open source pour celles et ceux qui pensent en Markdown',
    labels: {
      contributors: 'Contributeurs',
      latestRelease: 'Dernière version',
      stars: 'Étoiles GitHub',
    },
    subtitle: 'Développement transparent, décisions portées par la communauté et accès total au code source',
    title: 'Construit au grand jour',
  },
  contributors: {
    commitLabel: 'commits',
    cta: 'Devenir contributeur',
    subtitle: 'Rencontrez les personnes formidables qui rendent Alexandrie possible',
    title: 'Construit par la communauté',
  },
  faq: {
    answer1:
      'Oui, Alexandrie est 100 % open source sous licence MIT. Vous pouvez l’utiliser, le modifier et le redistribuer librement. Aucun coût caché, aucun palier premium.',
    answer2:
      'Absolument ! Vous pouvez exécuter Alexandrie sur votre propre infrastructure avec Docker. Une documentation complète vous aide à démarrer en quelques minutes.',
    answer3:
      'Oui, Alexandrie est conçu selon des principes offline-first. Vos notes sont disponibles localement et se synchronisent dès que vous vous reconnectez.',
    answer4:
      'En auto-hébergement, vos données restent sur votre propre serveur. Nous utilisons des pratiques de sécurité standard et tout le trafic est chiffré.',
    answer5:
      'Oui ! Vous pouvez importer des fichiers Markdown depuis Notion, Obsidian ou tout autre éditeur Markdown. L’export PDF avec une belle mise en forme est aussi pris en charge.',
    answer6: 'Bien sûr ! Nous supportons la coloration syntaxique pour plus de 100 langages et le rendu des équations mathématiques LaTeX.',
    answer7:
      'Alexandrie est une application web responsive qui fonctionne très bien sur mobile. Des applications natives sont prévues sur la feuille de route.',
    ctaDescription: 'Vous ne trouvez pas ce que vous cherchez ? Rejoignez notre communauté !',
    ctaTitle: 'Vous avez encore des questions ?',
    discord: 'Rejoindre Discord',
    subtitle: 'Tout ce qu’il faut savoir sur Alexandrie',
    title: 'Questions fréquentes',
    questions: [
      'Alexandrie est-il vraiment gratuit et open source ?',
      'Puis-je auto-héberger Alexandrie sur mon propre serveur ?',
      'Alexandrie fonctionne-t-il hors ligne ?',
      'Comment mes données sont-elles stockées et sécurisées ?',
      'Puis-je importer mes notes depuis d’autres applications ?',
      'Prend-il en charge les blocs de code et les équations mathématiques ?',
      'Existe-t-il une application mobile ?',
    ],
  },
  cta: {
    discord: 'serveur Discord',
    description: 'Rejoignez-nous dans cette aventure pour une meilleure prise de notes.',
    title: 'Prêt à mieux prendre vos notes ?',
    button: 'Commencer maintenant',
    contributionPrefix: 'Vous voulez contribuer ou discuter ? Découvrez notre',
  },
  support: {
    badge: 'Un mot du créateur',
    confirm: 'Je comprends, merci !',
    paragraph1:
      'Alexandrie n’a pas commencé comme une entreprise. C’était d’abord un outil que je voulais pour moi. Des années plus tard, je continue à le maintenir et à l’améliorer pendant mon temps libre, et je suis heureux de le partager avec toute personne qui le trouve utile.',
    paragraph2:
      'L’application ne vous piste pas, n’affiche pas de publicités et est totalement open source. En revanche, maintenir la plateforme en ligne implique des coûts d’hébergement et d’infrastructure. Si Alexandrie apporte de la valeur à votre quotidien, pensez à soutenir son indépendance. Même un petit don aide à couvrir les serveurs pendant des mois.',
    title: 'Alexandrie est gratuit, et il le restera.',
    signature: '— Smaug',
    cards: {
      sponsorDesc: 'Aidez à couvrir l’hébergement, les sauvegardes et les coûts de développement pour garder Alexandrie en ligne et indépendant.',
      sponsorTitle: 'Soutenir financièrement',
      starDesc: 'Montrez votre soutien et aidez d’autres développeurs à découvrir le projet. Cela ne coûte rien mais change tout.',
      starTitle: 'Mettre une étoile sur GitHub',
    },
  },
  footer: {
    brandDescription:
      'L’espace de travail open source pour les développeurs qui pensent en Markdown. De beaux documents, une organisation puissante, zéro friction.',
    madeWith: 'Fait avec',
    columns: {
      community: 'Communauté',
      legal: 'Légal',
      product: 'Produit',
      resources: 'Ressources',
    },
    links: {
      about: 'À propos',
      apiReference: 'Référence API',
      changelog: 'Journal des modifications',
      contribute: 'Contribuer',
      dashboard: 'Tableau de bord',
      discord: 'Discord',
      documentation: 'Documentation',
      features: 'Fonctionnalités',
      github: 'GitHub',
      issues: 'Issues',
      mitLicense: 'Licence MIT',
      privacyPolicy: 'Politique de confidentialité',
      roadmap: 'Feuille de route',
      terms: 'Conditions d’utilisation',
    },
    by: 'par',
  },
};
