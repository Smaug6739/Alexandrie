/**
 * Node utilities - centralized helpers for working with nodes (documents, categories, workspaces, resources)
 * Roles: 1 = Workspace, 2 = Category, 3 = Document, 4 = Resource
 */
import type { DB_Node, Node } from '~/stores';

/** Resolve the appropriate icon for a node based on its role and properties */
export const resolveIcon = (item: Node): string => {
  if (item.icon) return item.icon;
  if (item.role === 1) return 'workspace';
  if (item.role === 2) return item.shared ? 'shared_folder' : 'folder';
  if (item.role === 3) return item.accessibility == 1 ? 'sidebar/file' : item.accessibility == 2 ? 'draft' : 'shared_doc';
  if (item.role === 4) return item.metadata?.filetype == 'application/pdf' ? 'pdf' : 'sidebar/image';
  return 'sidebar/file';
};

/** Get the dashboard route for a node */
export const resolveNodeLink = (node: Node): string => {
  if (node.role === 1 || node.role === 2) return `/dashboard/categories/${node.id}`;
  if (node.role === 3) return `/dashboard/docs/${node.id}`;
  if (node.role === 4) return `/dashboard/cdn/${node.id}/preview`;
  return '/dashboard';
};

/** Get human-readable type name for a node */
export const resolveNodeType = (node: Node): string => {
  const types: Record<number, string> = { 1: 'Workspace', 2: 'Category', 3: 'Document', 4: 'Resource' };
  return types[node.role] || '';
};

// Node importation structure
interface ImportationStructure {
  nodes: DB_Node[];
}

// Analyze the uploaded file and parse its content as JSON
export function analyseFile(file: File): Promise<ImportationStructure> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        try {
          const data = JSON.parse(content);
          resolve(data);
        } catch {
          reject(new Error('Invalid JSON format'));
        }
      } else {
        reject(new Error('File content is not a string'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
}

export function validateFileStructure(data: ImportationStructure): data is ImportationStructure {
  if (typeof data === 'object' && data !== null && Array.isArray(data.nodes)) {
    return true;
  }
  return false;
}

export function compareDocumentsAndLocal(data: ImportationStructure) {
  const diff: DB_Node[] = [];
  const local = useSidebarTree().structure.value;
  for (const doc of data.nodes) {
    const localDoc = local.getItem(doc.id);
    if (!localDoc) {
      diff.push(doc);
    }
  }
  return diff;
}

export function prepareNewDocuments(new_docs: Partial<DB_Node>[]) {
  // For each document, check if parent_id and category are valid
  // If not, set them to null
  const local = useSidebarTree().structure.value;
  for (const doc of new_docs) {
    if (doc.parent_id && !local.getItem(doc.parent_id)) {
      doc.parent_id = undefined;
    }
  }
}
