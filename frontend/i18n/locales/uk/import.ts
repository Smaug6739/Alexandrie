export default {
  actions: {
    cancel: 'Скасувати',
    importAll: 'Імпортувати все',
    importing: 'Імпорт...',
    optionsTitle: 'Параметри імпорту',
    extractFrontMatter: 'Витягувати front matter як метадані',
    normalizeLineEndings: 'Нормалізувати закінчення рядків',
    preserveTimestamps: 'Зберегти оригінальні часові мітки',
    skipExisting: 'Пропустити наявні документи (імпортувати лише нові)',
  },

  advanced: {
    options: 'Розширені параметри імпорту',
    defaultDescription: 'Типовий опис для імпортованих документів',
    defaultTags: 'Типові теги для імпортованих документів (через кому)',
    defaultColor: 'Типовий колір для імпортованих документів',
    defaultThumbnail: 'Типова мініатюра для імпортованих документів (svg або emoji Unicode)',
    defaultIcon: 'Типова іконка для імпортованих документів (svg або emoji Unicode)',
    defaultTheme: 'Типова тема для імпортованих документів',
  },

  files: {
    meta: {
      title: 'Імпорт із markdown-файлів',
      description: 'Швидко імпортуйте markdown-файли з параметрами призначення та обробки.',
    },
    importable:
      'Ви можете імпортувати markdown-файли або папку, що містить markdown-файли. Папки будуть імпортовані рекурсивно зі збереженням структури, якщо ви виберете параметр імпорту всього.',
    toImport: 'Елементи для імпорту',
  },

  categories: {
    backup: {
      title: 'Імпорт із резервної копії',
      description: 'Відновіть повну резервну копію Alexandrie з документами та налаштуваннями.',
    },
    files: {
      title: 'Імпорт із файлів',
      description: 'Імпортуйте документи з markdown-файлів із гнучкими параметрами.',
    },
    advanced: {
      title: 'Розширений імпорт',
      description: 'Імпортуйте документи з використанням власних параметрів для максимального контролю.',
    },
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
    breadcrumb: 'Імпорт',
    description: 'Ви можете імпортувати документи з попереднього експорту. Якщо такого немає, створіть його в',
    settingsLink: 'налаштуваннях',
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
    backup: 'Резервна копія',
    current: 'Поточний',
    import: 'Імпорт',
    importFromBackup: 'Імпортувати з резервної копії',
    importLocalSettings: 'Імпортувати локальні налаштування',
    importSelected: 'Імпортувати вибране ({count})',
    localSettings: 'Локальні налаштування та параметри',
    localSettingsAvailable: 'Локальні налаштування та параметри можна імпортувати',
    localSettingsWarning: 'Це замінить ваші поточні локальні налаштування, включаючи фрагменти коду',
    newDocuments: 'Нові документи',
    noLocalSettings: 'У резервній копії не знайдено локальних налаштувань',
    noNewDocuments: 'Нових документів для імпорту немає',
    noUpdates: 'Документів для оновлення немає',
    replaceLocalSettings: 'Замінити ваші локальні налаштування резервною копією?',
    selectAll: 'Вибрати все',
    updates: 'Оновлення',
    updateSelected: 'Оновити вибране ({count})',
  },
};
