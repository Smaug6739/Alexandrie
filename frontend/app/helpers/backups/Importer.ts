import compile from '~/helpers/markdown';
import { extractMetadataFromMarkdown } from '~/helpers/node';
import type { DB_Node } from '~/stores';

interface ImportOptions {
  extractFrontMatter: boolean;
  normalizeLineEndings: boolean;
  preserveTimestamps: boolean;
  defaultValues: {
    defaultDescription: string;
    defaultTags: string;
    defaultColor: number;
    defaultThumbnail: string;
    defaultIcon: string;
    defaultTheme: string;
  };
  user_id: string;
}

interface NormalizedEntry<T = 'folder' | 'text_based'> {
  id: string; // path
  filetype: T;
  file: File;
  filename?: string; // For folders, this will be the folder name
  children?: NormalizedEntry[];
  content: string | ArrayBuffer;
}

function isImportable(file: File) {
  return file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.txt');
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

      const path = file.webkitRelativePath;
      const parts = path.split('/');
      const id = parts.slice(0, -1).join('/'); // Use folder path as ID

      let parent = this.normalized_files.find(e => e.id === id);
      if (!parent) {
        parent = {
          id,
          filetype: 'folder',
          file,
          filename: parts[parts.length - 2] || '',
          children: [],
          content: '',
        };
        this.normalized_files.push(parent);
      }

      const content = await file.text();
      parent.children!.push({
        id: path,
        filetype: 'text_based',
        file,
        filename: file.name,
        content,
      });
    }
  }
  async normalizedToNodes() {
    const to_process = [...this.normalized_files];
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
          parent_id: parentId,
          name: normalizeName(entry.filename) || 'Untitled',
          role: 2,
          user_id: this.options.user_id,
          accessibility: 1,
          access: 1,
          created_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
          updated_timestamp: this.options.preserveTimestamps ? entry.file.lastModified : Date.now(),
        });
      }

      if (entry.children?.length) to_process.push(...entry.children);
    }
    return this.nodes;
  }
}
