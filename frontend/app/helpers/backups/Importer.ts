import compile from '~/helpers/markdown';
import { extractMetadataFromMarkdown } from '~/helpers/node';
import type { DB_Node } from '~/stores';

export interface ImportJob<T = DB_Node, O = ImportOptions> {
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  toCreate: T[];
  created: string[];
  toUpdate: T[];
  updated: string[];
  failures: number;
  error_message?: string;
  options: O;
}

export type ImportBackupJob = ImportJob<ImportItem>;

interface ImportOptions {
  extractFrontMatter?: boolean;
  normalizeLineEndings?: boolean;
  preserveTimestamps?: boolean;
  defaultValues?: {
    defaultParent?: string;
    defaultDescription: string;
    defaultTags: string;
    defaultColor: number;
    defaultThumbnail: string;
    defaultIcon: string;
    defaultTheme: string;
  };
}

interface ImportItemBase {
  id: string;
  name: string;
  status: 'pending' | 'completed' | 'failed';
  error_message?: string;
}

export interface NodeImportItem extends ImportItemBase {
  type: 'node';
  data: DB_Node;
}
export interface ResourceImportItem extends ImportItemBase {
  type: 'resource';
  data: ResourceImportTask;
}
export type ImportItem = NodeImportItem | ResourceImportItem;

export interface NormalizedEntry<T = 'folder' | 'text_based' | 'resource'> {
  id: string;
  parent_id?: string;
  filetype: T;
  file: File;
  filename?: string;
  content: string | ArrayBuffer;
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

      const path = file.webkitRelativePath || file.name; // webkitRelativePath is only available when the user selects a folder, otherwise we use the file name
      const parts = path.split('/'); // ["A", "B", "C", "D", "file.txt"]

      const isFolder = Boolean(file.webkitRelativePath);

      // --- 1. REBUILDING INTERMEDIATE FOLDERS ---
      // We iterate through the parts of the path, creating folder entries in normalized_files as needed.
      if (isFolder) {
        let currentPath: string = '';

        for (let i = 0; i < parts.length - 1; i++) {
          const folderName = parts[i]!;
          const previousPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
          // We check if this level of folder already exists in the global tree
          let folderEntry = this.normalized_files.find(e => e.id === currentPath);
          // If we are at the first level ("A"), the parent is the root (undefined),
          // otherwise it's the previous folder ("A/B" has "A" as parent)
          if (!folderEntry) {
            folderEntry = {
              id: currentPath,
              parent_id: previousPath || undefined,
              filetype: 'folder',
              file: file, // We use the current file as a placeholder for the folder entry
              filename: folderName,
              content: '',
            };

            this.normalized_files.push(folderEntry);
          }
        }
      }
      // --- 2. ADDING THE FILE TO ITS FINAL PARENT FOLDER ---
      const finalParentPath = isFolder ? parts.slice(0, -1).join('/') : path;
      const isText = file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json');
      const filetype: 'folder' | 'text_based' | 'resource' = isText ? 'text_based' : 'resource';
      const content = isText ? await file.text() : '';

      const fileEntry = {
        id: path,
        parent_id: finalParentPath || undefined,
        filetype,
        file,
        filename: file.name,
        content,
      };

      this.normalized_files.push(fileEntry);
    }
  }
  async normalizedToNodes() {
    const to_process = [...this.normalized_files];
    const resourceTasks: ResourceImportTask[] = [];
    while (to_process.length) {
      const entry = to_process.shift()!;

      let tags = this.options.defaultValues?.defaultTags;
      let description = this.options.defaultValues?.defaultDescription;
      let content = '';
      if (this.options.extractFrontMatter && entry.filetype === 'text_based') {
        const data = extractMetadataFromMarkdown(entry.content as string);
        tags = data.tags || this.options.defaultValues?.defaultTags;
        description = data.description || this.options.defaultValues?.defaultDescription;
        content = data.content_clean;
      }
      const parentId = entry.id.split('/').slice(0, -1).join('/') || undefined;
      if (entry.filetype === 'text_based') {
        this.nodes.push({
          id: entry.id,
          parent_id: parentId || this.options.defaultValues?.defaultParent,
          name: normalizeName(entry.filename) || 'Untitled',
          description: description,
          tags: tags,
          color: this.options.defaultValues?.defaultColor || -1,
          role: 3,
          icon: this.options.defaultValues?.defaultIcon,
          theme: this.options.defaultValues?.defaultTheme,
          content: content,
          content_compiled: compile(content),
          accessibility: 1,
          access: 1,
          user_id: '',
          created_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          updated_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
        });
      }

      if (entry.filetype === 'folder') {
        this.nodes.push({
          id: entry.id,
          parent_id: parentId || this.options.defaultValues?.defaultParent,
          name: normalizeName(entry.filename) || 'Untitled',
          role: 2,
          accessibility: 1,
          access: 1,
          created_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          updated_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          user_id: '',
        });
      }

      if (entry.filetype === 'resource') {
        resourceTasks.push({
          id: entry.id,
          parent_id: parentId || this.options.defaultValues?.defaultParent,
          file: entry.file,
        });
      }
    }
    return {
      nodesToCreate: this.nodes,
      resourcesToUpload: resourceTasks,
    };
  }
}
