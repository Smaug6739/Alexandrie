export default {
  actions: {
    cancel: 'Cancelar',
    extractFrontMatter: 'Extraer el front matter como metadatos',
    importAll: 'Importar todo',
    importing: 'Importando...',
    normalizeLineEndings: 'Normalizar los finales de línea',
    optionsTitle: 'Opciones de importación',
    preserveTimestamps: 'Conservar las marcas de tiempo originales',
    skipExisting: 'Omitir los documentos existentes (importar solo los nuevos)',
  },

  categories: {
    backup: {
      description: 'Restaura una copia de seguridad completa de Alexandrie con documentos y configuración.',
      title: 'Importar desde una copia de seguridad',
    },
    files: {
      description: 'Importa documentos desde archivos Markdown con opciones flexibles.',
      title: 'Importar desde archivos',
    },
    folder: {
      description: 'Importa una carpeta completa (con subcarpetas y archivos subidos) usando opciones personalizadas para un control total.',
      title: 'Importar carpeta',
    },
  },

  files: {
    importable:
      'Puedes importar archivos Markdown o una carpeta que los contenga. Las carpetas se importan de forma recursiva y conservan su estructura si eliges la opción de importar todo.',
    meta: {
      description: 'Importa rápidamente archivos Markdown con opciones de destino y procesamiento.',
      title: 'Importar desde archivos Markdown',
    },
    toImport: 'Elementos para importar',
  },

  folder: {
    defaultColor: 'Color predeterminado de los documentos importados',
    defaultDescription: 'Descripción predeterminada de los documentos importados',
    defaultIcon: 'Icono predeterminado de los documentos importados (SVG o emoji Unicode)',
    defaultParent: 'Categoría principal predeterminada de los documentos importados',
    defaultTags: 'Etiquetas predeterminadas de los documentos importados (separadas por comas)',
    defaultTheme: 'Tema predeterminado de los documentos importados',
    defaultThumbnail: 'Miniatura predeterminada de los documentos importados (SVG o emoji Unicode)',
    options: 'Opciones avanzadas de importación',
  },

  header: {
    changeFile: 'Cambiar archivo',
    created: 'Fecha de creación',
    documents: 'Documentos',
    files: 'Archivos',
    metadata: 'Metadatos',
    settings: 'Configuración',
    title: 'Información de la copia de seguridad',
    totalDocuments: 'Total de documentos',
    totalSize: 'Tamaño total',
    version: 'Versión',
  },

  meta: {
    breadcrumb: 'Importaciones',
    description: 'Puedes importar documentos desde una exportación anterior. Si no tienes una, créala desde la',
    settingsLink: 'configuración',
    title: 'Importar documentos',
  },

  notifications: {
    importCompleteMessage: 'Los documentos se importaron correctamente.',
    importCompleteTitle: 'Importación completada',
    importFailedMessage: 'Se produjo un error durante la importación. Inténtalo de nuevo.',
    importFailedTitle: 'Error en la importación',
    localImportedMessage: 'Tu configuración local se reemplazó por la de la copia de seguridad.',
    localImportedTitle: 'Configuración local importada',
  },

  progress: {
    title: 'Progreso de la importación',
  },

  report: {
    empty: 'No hay elementos importados que mostrar.',
    startNew: 'Iniciar una nueva importación',
    title: 'Informe de importación',
  },

  steps: {
    select: {
      analyzing: 'Analizando...',
      startImport: 'Iniciar importación',
    },
  },

  summary: {
    documentsToUpdate: 'Documentos por actualizar',
    newDocuments: 'Documentos nuevos',
    title: 'Resumen de la importación',
    unchanged: 'Sin cambios',
  },

  tabs: {
    backup: 'Copia de seguridad',
    current: 'Actual',
    import: 'Importar',
    importFromBackup: 'Importar desde la copia de seguridad',
    importLocalSettings: 'Importar configuración local',
    importSelected: 'Importar selección ({count})',
    localSettings: 'Configuración y preferencias locales',
    localSettingsAvailable: 'Se pueden importar la configuración y las preferencias locales',
    localSettingsWarning: 'Esto sobrescribirá tu configuración local actual, incluidos los snippets',
    newDocuments: 'Documentos nuevos',
    noLocalSettings: 'No se encontró configuración local en la copia de seguridad',
    noNewDocuments: 'No hay documentos nuevos para importar',
    noUpdates: 'No hay documentos para actualizar',
    replaceLocalSettings: '¿Reemplazar tu configuración local por la de la copia de seguridad?',
    selectAll: 'Seleccionar todo',
    updates: 'Actualizaciones',
    updateSelected: 'Actualizar selección ({count})',
  },
};
