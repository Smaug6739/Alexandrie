export default {
  commandCenter: {
    advanced: {
      allCategories: 'Все категории',
      category: 'Категория',
      clear: 'Очистить',
      created: 'Создано',
      dateRange: 'Диапазон дат',
      from: 'С',
      modified: 'Изменено',
      searchInContent: 'Поиск по содержимому',
      searchInContentHint: 'Поиск в тексте документа (только по целым словам)',
      tags: 'Теги',
      title: 'Расширенные фильтры',
      to: 'По',
    },
    beta: 'Бета',
    close: 'Закрыть',
    navigate: 'Навигация',
    noResults: 'По запросу «{query}» ничего не найдено',
    searchPlaceholder: 'Поиск страницы, действия или документа...',
    sections: {
      documents: 'Документы',
      pagesAndActions: 'Страницы и действия',
    },
    select: 'Выбрать',
    switchTabs: 'Переключить вкладку',
    tabs: {
      advanced: 'Расширенный',
      quick: 'Быстрый',
    },
  },

  dataTable: {
    rowsPerPage: 'Строк на странице',
    searchPlaceholder: 'Поиск...',
    showing: 'Записи с {start} по {end} из {total}',
  },

  editor: {
    placeholder: {
      description: 'Описание документа',
      title: 'Название документа',
    },
    title: 'Редактор Markdown',
  },

  filter: {
    all: 'Все',
    ascending: 'По возрастанию',
    assigned: 'Назначено',
    contains: 'Содержит',
    created: 'Дата создания',
    descending: 'По убыванию',
    exact: 'Точное совпадение',
    match: 'Совпадение',
    modified: 'Дата изменения',
    sort: 'Сортировать по',
    startsWith: 'Начинается с',
    status: 'Статус',
    tags: 'Теги',
    unassigned: 'Не назначено',
  },

  kanban: {
    addColumn: 'Добавить столбец',
    addDocument: 'Добавить документ',
    changeColor: 'Изменить цвет',
    deleteColumn: 'Удалить столбец',
    deleteColumnModal: {
      confirm: 'Вы уверены, что хотите удалить столбец «{title}»?',
      emptyColumn: 'Этот столбец пуст.',
      hasDocuments:
        'В столбце {count} документ. Он будет перемещён в первый столбец. | В столбце {count} документа. Они будут перемещены в первый столбец. | В столбце {count} документов. Они будут перемещены в первый столбец.',
      title: 'Удалить столбец',
    },
    dragHere: 'Перетащите документы сюда',
    editName: 'Изменить название',
    manageAssignees: 'Управление исполнителями',
    noAssignees: 'Исполнители не назначены',
    noDocuments: 'Нет документов',
    resetBoard: {
      confirm: 'Вы уверены, что хотите сбросить канбан-доску?',
      reset: 'Сбросить',
      title: 'Сбросить канбан-доску',
      warning: 'Это действие необратимо. Все столбцы будут удалены, а карточки перемещены в первый столбец.',
    },
    searchHint: 'Введите не менее 3 символов для поиска.',
    usersAssigned: 'Назначенные исполнители',
  },

  navbar: {
    commandCenter: 'Панель команд (Ctrl+K)',
    searchHint: 'Нажмите {key} для навигации',
  },

  noContent: {
    nothingHere: 'Здесь пока ничего нет',
  },

  sessionCard: {
    current: 'Текущий',
    inactive: 'Неактивный',
    lastActivity: 'Последняя активность',
    loggedOut: 'Сеанс завершён',
    login: 'Вход',
    unknownIP: 'Неизвестный IP-адрес',
    unknownLocation: 'Неизвестное местоположение',
    userAgent: 'User-Agent',
  },

  sidebar: {
    allWorkspaces: 'Все рабочие пространства',
    closeAll: 'Закрыть все',
    editWorkspace: 'Редактировать рабочее пространство',
    joinWorkspace: 'Присоединиться к рабочему пространству',
    nav: {
      cdn: 'CDN',
      documents: 'Документы',
      home: 'Главная',
      imports: 'Импорт',
      manageCategories: 'Управление категориями',
      newPage: 'Новая страница',
      settings: 'Настройки',
      teams: 'Команды',
    },
    newCategory: 'Новая категория',
    newDoc: 'Новый документ',
    newWorkspace: 'Новое рабочее пространство',
    noWorkspaces: 'Рабочие пространства не найдены',
    openAll: 'Открыть все',
    searchPlaceholder: 'Поиск или Ctrl+K',
    sharedWithMe: 'Доступные мне',
    toggleDock: 'Показать или скрыть панель приложений',
    workspaces: 'Рабочие пространства',
  },

  tagInput: {
    placeholder: 'Нажмите Enter, чтобы добавить тег',
  },

  viewSelection: {
    kanban: 'Канбан',
    list: 'Список',
    table: 'Таблица',
  },
};
