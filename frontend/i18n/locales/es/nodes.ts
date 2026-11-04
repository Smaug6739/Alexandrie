export default {
  actions: {
    copyPublicLink: 'Copiar enlace público',
    editMeta: 'Editar metadatos',
    exportAsMarkdown: 'Exportar como Markdown',
    managePermissions: 'Administrar permisos',
    newDocument: '+ Crear nuevo documento',
    publicLink: 'Enlace público',
    removeFromShared: 'Quitar de compartidos',
    resetBoard: 'Restablecer tablero',
    share: 'Compartir',
  },
  category: {
    editTitle: 'Categoría y espacio de trabajo',
    iconHint: 'Admite SVG',
    name: 'Categoría | Categorías',
    new: 'Nueva categoría',
    notifications: {
      created: 'Categoría creada correctamente',
      creationError: 'Error al crear la categoría',
      updated: 'Categoría actualizada',
    },
    orderHint: 'Orden de la categoría en la barra lateral',
    uncategorized: 'Sin categoría',
  },

  container: {
    createNewDocument: '+ Crear nuevo documento',
    import: 'Importar',
    newCategory: '+ Categoría',
    newWorkspace: '+ Espacio de trabajo',
    noDocuments: 'No se encontraron documentos',
    noDocumentsDescription: 'No hay documentos en esta categoría',
    noWorkspaces: 'No se encontraron espacios de trabajo ni categorías',
    searchPlaceholder: 'Busca un espacio de trabajo...',
    title: 'Espacios de trabajo y categorías',
  },

  document: {
    childs: 'Documentos secundarios',
    editPage: 'Editar página',
    lastUpdated: 'Última actualización',
    nextPage: 'Página siguiente',
    prevPage: 'Página anterior',
    TOC: 'Tabla de contenido',
  },

  filter: {
    footer: '{count} / {total} coincidencias',
    title: 'Filtrar nodos',
    toClose: 'para cerrar',
  },

  modals: {
    delete: {
      bulkCount: 'Esta acción eliminará {count} nodos.',
      confirm: '¿Seguro que quieres eliminar este elemento ({type})?',
      confirmBulk: '¿Seguro que quieres eliminar los nodos seleccionados?',
      hasChildren: 'Este elemento ({type}) tiene {count} documentos secundarios. También se eliminarán.',
      irreversible: 'Esta acción es irreversible',
      title: 'Eliminar {type}',
      titleBulk: 'Eliminar nodos',
    },
    join: {
      access: 'Acceso al nodo',
      helperText: 'Se necesita un código o enlace de invitación para continuar.',
      inputPlaceholder: 'ABC123 o https://.../join-workspace?code=ABC123',
      join: 'Unirse',
      joining: 'Uniéndose...',
      label: 'Código o enlace de invitación',
      subtitle:
        'Pega un código de invitación o un enlace de invitación completo. Si ya te uniste a este espacio de trabajo con otro nivel de permiso, solo se conservará el más alto.',
      title: 'Unirse a un equipo o espacio de trabajo',
    },
    metadata: {
      emojiOrIcon: 'Emoji o icono',
      emojiOrIconHint: 'Admite SVG o emojis',
      labelAppearance: 'Apariencia',
      labelMedia: 'Multimedia',
      labelOrganization: 'Organización',
      pinDescription: 'Fija este documento en la parte superior de tu espacio de trabajo',
      thumbnail: 'Miniatura',
      thumbnailHint: 'Admite SVG',
      title: 'Metadatos',
    },
    permissions: {
      addPermission: 'Agregar',
      defaultPermission: 'Permiso predeterminado para nuevos usuarios',
      generalAccess: 'Acceso general',
      inviteCreate: 'Crear invitación',
      inviteCreateProgress: 'Creando invitación...',
      inviteEmpty: 'Todavía no hay invitaciones',
      inviteLabel: 'Invitaciones al nodo',
      invitePermission: 'Permiso',
      managePermissions: 'Administrar permisos',
      noPermissions: 'No hay permisos definidos',
      noResults: 'No se encontraron resultados',
      publicInfo: 'Este documento será accesible públicamente mediante una URL única.',
      removePermission: 'Quitar permiso',
      searchPlaceholder: 'Nombre de usuario o correo electrónico',
      searchUser: 'Busca un usuario',
      shareLink: 'Comparte este enlace para que cualquiera pueda ver el documento sin una cuenta:',
      title: 'Administrar permisos',
    },
    removeShared: {
      childWarning: 'Este documento tiene {count} documento(s) secundario(s). También se quitarán.',
      confirm: '¿Seguro que quieres quitar este documento?',
      noAccess: 'Después de esta acción ya no tendrás acceso a este documento.',
      success: 'Documento quitado',
      title: 'Quitar este documento',
    },
  },

  nodes: 'Nodos',

  notifications: {
    linkCopied: 'Enlace copiado al portapapeles',
  },

  // From the shared_target api (PWA)
  share: {
    actionChoose: '¿Qué quieres hacer?',
    actionCreateDocument: 'Crear nuevo documento',
    actionCreateDocumentDesc: 'Crea un nuevo documento Markdown con el contenido compartido',
    actionUploadResource: 'Subir como recurso',
    actionUploadResourceDesc: 'Sube el contenido compartido como recurso (imagen, PDF, etc.) y obtén un enlace para insertarlo en tus documentos',
    chooseDestination: 'Elige dónde quieres guardar este contenido.',
    description: 'Contenido recibido desde otra aplicación.',
    sharedContent: 'Contenido compartido',
    title: 'Compartir contenido',
  },

  tags: 'Etiquetas',

  types: {
    category: 'Categoría | Categorías',
    document: 'Documento | Documentos',
    resource: 'Recurso',
    workspace: 'Espacio de trabajo',
  },

  workspace: {
    all: 'Todos los espacios de trabajo',
    new: 'Nuevo espacio de trabajo',
    shared: 'Compartido conmigo',
  },
};
