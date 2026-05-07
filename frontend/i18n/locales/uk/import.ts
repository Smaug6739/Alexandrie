export default {
  actions: {
    cancel: 'Скасувати',
    importAll: 'Імпортувати все',
    importing: 'Імпорт...',
    optionsTitle: 'Параметри імпорту',
    preserveTimestamps: 'Зберегти оригінальні часові мітки',
    skipExisting: 'Пропустити наявні документи (імпортувати лише нові)',
  },

  files: {
    noMarkdownFiles: 'Не знайдено файлів markdown.',
  },

  header: {
    changeFile: 'Змінити файл',
    created: 'Створено',
    documents: 'Документи',
    files: 'Файли',
    metadata: 'Метадані',
    settings: 'Налаштування',
    title: 'Інформація про резервне копіювання',
    totalDocuments: 'Загальна кількість документів',
    totalSize: 'Загальний розмір',
    version: 'Версія',
  },

  meta: {
    breadcrumb: 'Імпортування',
    description: 'Ви можете імпортувати документи з попереднього експорту. Якщо такого немає, створіть його з',
    settingsLink: 'налаштування',
    title: 'Імпортувати документи',
  },

  notifications: {
    importCompleteMessage: 'Документи було успішно імпортовано.',
    importCompleteTitle: 'Імпорт завершено',
    importFailedMessage: 'Під час імпорту сталася помилка. Спробуйте ще раз.',
    importFailedTitle: 'Імпорт не вдався',
    localImportedMessage: 'Ваші локальні налаштування були замінені резервною копією.',
    localImportedTitle: 'Імпортовано локальні налаштування',
  },

  steps: {
    select: {
      analyzing: 'Аналіз...',
      startImport: 'Почати імпорт',
    },
  },

  summary: {
    documentsToUpdate: 'Документи, які потрібно оновити',
    newDocuments: 'Нові документи',
    title: 'Звіт про імпорт',
    unchanged: 'Без змін',
  },

  tabs: {
    backup: 'Резервне копіювання',
    current: 'Поточний',
    import: 'Імпорт',
    importFromBackup: 'Імпортувати з резервної копії',
    importLocalSettings: 'Імпортувати локальні налаштування',
    importSelected: 'Вибір для імпорту ({count})',
    localSettings: 'Локальні налаштування та параметри',
    localSettingsAvailable: 'Локальні налаштування та параметри можна імпортувати',
    localSettingsWarning: 'Це замінить ваші поточні локальні налаштування, включаючи фрагменти коду',
    newDocuments: 'Нові документи',
    noLocalSettings: 'У резервній копії не знайдено локальних налаштувань',
    noNewDocuments: 'Нових документів для імпорту немає',
    noUpdates: 'Документів для оновлення немає',
    replaceLocalSettings: 'Замінити локальні налаштування резервною копією?',
    selectAll: 'Вибрати все',
    updates: 'Оновлення',
    updateSelected: 'Оновити вибір ({count})',
  },
};
