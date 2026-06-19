import compile from '~/helpers/markdown';
import { extractMetadataFromMarkdown } from '~/helpers/node';
import type { DB_Node } from '~/stores';

interface ImportOptions {
  extractFrontMatter: boolean;
  normalizeLineEndings: boolean;
  preserveTimestamps: boolean;
  defaultValues: {
    defaultParent?: string;
    defaultDescription: string;
    defaultTags: string;
    defaultColor: number;
    defaultThumbnail: string;
    defaultIcon: string;
    defaultTheme: string;
  };
  user_id: string;
}

interface NormalizedEntry<T = 'folder' | 'text_based' | 'resource'> {
  id: string;
  filetype: T;
  file: File;
  filename?: string;
  children?: NormalizedEntry[];
  content: string | ArrayBuffer; // Restera vide pour les ressources binaires
}
export interface ResourceImportTask {
  id: string;
  parent_id?: string;
  file: File;
}

function isImportable(file: File) {
  return !file.name.startsWith('.') && !file.name.endsWith('.DS_Store');
}
function normalizeName(name?: string) {
  return name?.split('.').slice(0, -1).join('.') || name;
}

export class Importer {
  options: ImportOptions;

  normalized_files: NormalizedEntry[] = [];

  nodes: DB_Node[] = [];

  constructor(options: ImportOptions) {
    this.options = options;
  }

  async handleFiles(files: File[] | File) {
    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      if (!isImportable(file)) continue;

      const path = file.webkitRelativePath; // ex: "A/B/C/D/file.txt"
      const parts = path.split('/'); // ["A", "B", "C", "D", "file.txt"]

      // --- 1. RECONSTRUCTION DES DOSSIERS INTERMÉDIAIRES ---
      // On boucle sur tous les segments sauf le dernier (qui est le fichier lui-même)
      let currentPath: string = '';

      for (let i = 0; i < parts.length - 1; i++) {
        const folderName = parts[i]!;
        const previousPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;

        // On vérifie si ce niveau de dossier existe déjà dans l'arborescence globale
        let folderEntry = this.normalized_files.find(e => e.id === currentPath);

        // Si on est au premier niveau ("A"), le parent est la racine (undefined),
        // sinon c'est le dossier précédent ("A/B" a pour parent "A")
        if (!folderEntry) {
          folderEntry = {
            id: currentPath,
            filetype: 'folder',
            file: file, // On associe le fichier courant à défaut d'avoir un objet File pour le dossier
            filename: folderName,
            children: [],
            content: '',
          };

          if (!previousPath) {
            // Dossier racine de l'import (ex: "A")
            this.normalized_files.push(folderEntry);
          } else {
            // Trouver le dossier parent direct dans la structure globale pour lui affecter son enfant
            const parentEntry = this.normalized_files.find(e => e.id === previousPath);
            if (parentEntry && parentEntry.children) {
              parentEntry.children.push(folderEntry);
            } else {
              // Sécurité si le traitement n'est pas linéaire (théoriquement impossible ici)
              this.normalized_files.push(folderEntry);
            }
          }
        }
      }

      // --- 2. AJOUT DU FICHIER DANS SON DOSSIER PARENT FINAL ---
      const finalParentPath = parts.slice(0, -1).join('/');
      const isText = file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json');
      const filetype: 'folder' | 'text_based' | 'resource' = isText ? 'text_based' : 'resource';
      const content = isText ? await file.text() : '';

      const fileEntry = {
        id: path,
        filetype,
        file,
        filename: file.name,
        content,
      };

      // On cherche le dossier "D" (finalParentPath) pour lui pousser le fichier
      const finalParentFolder = this.normalized_files.find(e => e.id === finalParentPath);
      if (finalParentFolder && finalParentFolder.children) {
        finalParentFolder.children.push(fileEntry);
      } else {
        // Cas de secours si le fichier est à la racine absolue du glisser-déposer sans dossier
        this.normalized_files.push(fileEntry);
      }
    }
  }
  async normalizedToNodes() {
    const to_process = [...this.normalized_files];
    const resourceTasks: ResourceImportTask[] = [];
    while (to_process.length) {
      const entry = to_process.shift()!;

      let tags = this.options.defaultValues.defaultTags;
      let description = this.options.defaultValues.defaultDescription;
      let content = '';
      if (this.options.extractFrontMatter && entry.filetype === 'text_based') {
        const data = extractMetadataFromMarkdown(entry.content as string);
        tags = data.tags || this.options.defaultValues.defaultTags;
        description = data.description || this.options.defaultValues.defaultDescription;
        content = data.content_clean;
      }
      const parentId = entry.id.split('/').slice(0, -1).join('/') || undefined;
      if (entry.filetype === 'text_based') {
        this.nodes.push({
          id: entry.id,
          parent_id: parentId,
          name: normalizeName(entry.filename) || 'Untitled',
          description: description,
          tags: tags,
          color: this.options.defaultValues.defaultColor || -1,
          role: 3,
          icon: this.options.defaultValues.defaultIcon,
          theme: this.options.defaultValues.defaultTheme,
          user_id: this.options.user_id,
          content: content,
          content_compiled: compile(content),
          accessibility: 1,
          access: 1,
          created_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          updated_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
        });
      }

      if (entry.filetype === 'folder') {
        this.nodes.push({
          id: entry.id,
          parent_id: parentId || this.options.defaultValues.defaultParent,
          name: normalizeName(entry.filename) || 'Untitled',
          role: 2,
          user_id: this.options.user_id,
          accessibility: 1,
          access: 1,
          created_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          updated_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
        });
      }

      if (entry.filetype === 'resource') {
        resourceTasks.push({
          id: entry.id, // Le path d'origine pour mapper le parent_id plus tard
          parent_id: parentId,
          file: entry.file,
        });
      }

      if (entry.children?.length) to_process.push(...entry.children);
    }
    return {
      nodesToCreate: this.nodes,
      resourcesToUpload: resourceTasks,
    };
  }
}
