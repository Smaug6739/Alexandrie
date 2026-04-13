export default {
  actions: {
    editMeta: 'Редагувати метадані',
    exportAsMarkdown: 'Експортувати як Markdown',
    managePermissions: 'Керувати правами доступу',
    newDocument: '+ Створити новий документ',
    publicLink: 'Публічне посилання',
    removeFromShared: 'Вилучити зі спільного доступу',
    resetBoard: 'Скинути дошку',
  },

  category: {
    editTitle: 'Категорія та простір',
    iconHint: 'Підтримка SVG',
    name: 'Категорія | Категорії',
    new: 'Нова категорія',
    notifications: {
      created: 'Категорія створена успішно',
      creationError: 'Помилка під час створення категорії',
      updated: 'Категорія оновлено',
    },
    orderHint: 'Порядок категорії в бічній панелі',
    uncategorized: 'Без категорії',
  },

  container: {
    createNewDocument: '+ Створити новий документ',
    import: 'Імпорт',
    newCategory: '+ Категорія',
    newWorkspace: '+ Простір',
    noDocuments: 'Документів не знайдено',
    noDocumentsDescription: 'У цій категорії немає документів',
    noWorkspaces: 'Просторів або категорій не знайдено',
    searchPlaceholder: 'Шукати простір...',
    title: 'Простори та категорії',
  },

  document: {
    childs: 'Дочірні документи',
    editPage: 'Редагувати сторінку',
    lastUpdated: 'Останнє оновлення',
    nextPage: 'Наступна сторінка',
    prevPage: 'Попередня сторінка',
    TOC: 'Зміст',
  },

  filter: {
    footer: '{count} / {total} збігів',
    title: 'Фільтрувати вузли',
    toClose: 'щоб закрити',
  },

  modals: {
    delete: {
      bulkCount: 'Ця дія видалить {count} вузлів.',
      confirm: 'Ви впевнені, що хочете видалити цей {type}?',
      confirmBulk: 'Ви впевнені, що хочете видалити вибрані вузли?',
      hasChildren: 'Цей {type} має {count} дочірніх документів. Вони також будуть видалені.',
      irreversible: 'Ця дія є незворотною',
      title: 'Видалити {type}',
      titleBulk: 'Видалити вузли',
    },
    metadata: {
      emojiOrIcon: 'Емоджі або іконка',
      emojiOrIconHint: 'Підтримуються SVG та емоджі',
      thumbnail: 'Мініатюра',
      thumbnailHint: 'Підтримується SVG',
      title: 'Метадані',
    },
    permissions: {
      addPermission: 'Додати',
      defaultPermission: 'Права доступу за замовчуванням для нових користувачів',
      generalAccess: 'Загальний доступ',
      managePermissions: 'Керувати правами доступу',
      noPermissions: 'Права доступу не встановлено',
      noResults: 'Результатів не знайдено',
      publicInfo: 'Цей документ буде загальнодоступний за унікальним посиланням.',
      removePermission: 'Видалити права доступу',
      searchPlaceholder: 'Ім\'я користувача або email',
      searchUser: 'Знайти користувача',
      shareLink: 'Поділіться цим посиланням, щоб будь-хто міг переглянути документ без облікового запису:',
      title: 'Керувати правами доступу',
    },
    removeShared: {
      childWarning: 'Цей документ має {count} дочірніх документів. Вони також будуть вилучені.',
      confirm: 'Ви впевнені, що хочете вилучити цей документ?',
      noAccess: 'Після цієї дії ви більше не матимете доступу до цього документа.',
      success: 'Документ вилучено',
      title: 'Вилучити цей документ',
    },
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: 'Що ви хочете зробити?',
    actionCreateDocument: 'Створити новий документ',
    actionCreateDocumentDesc: 'Створити новий Markdown-документ із надісланим вмістом',
    actionUploadResource: 'Завантажити як ресурс',
    actionUploadResourceDesc: 'Завантажити надісланий вміст як ресурс (зображення, PDF тощо) та отримати посилання для вставки у документи',
    chooseDestination: 'Виберіть, куди зберегти цей вміст.',
    description: 'Вміст отримано з іншого застосунку.',
    sharedContent: 'Надісланий вміст',
    title: 'Поділитися вмістом',
  },

  tags: 'Теги',

  types: {
    category: 'Категорія | Категорії',
    document: 'Документ | Документи',
    resource: 'Ресурс',
    workspace: 'Простір',
  },

  workspace: {
    all: 'Усі простори',
    new: 'Новий простір',
    shared: 'Поділилися зі мною',
  },
};
