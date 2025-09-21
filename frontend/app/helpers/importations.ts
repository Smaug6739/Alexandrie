import type { DB_Node } from '~/stores';

interface ImportationStructure {
  nodes: DB_Node[];
}

function analyseFile(file: File): Promise<ImportationStructure> {
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

function validateFileStructure(data: ImportationStructure): data is ImportationStructure {
  if (typeof data === 'object' && data !== null && Array.isArray(data.nodes)) {
    return true;
  }
  return false;
}

function compareDocumentsAndLocal(data: ImportationStructure) {
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

function prepareNewDocuments(new_docs: Partial<DB_Node>[]) {
  // For each document, check if parent_id and category are valid
  // If not, set them to null
  const local = useSidebarTree().structure.value;
  for (const doc of new_docs) {
    if (doc.parent_id && !local.getItem(doc.parent_id)) {
      doc.parent_id = undefined;
    }
  }
}

async function uploadDocument(document: DB_Node) {
  const documentsStore = useNodesStore();
  await documentsStore.post(document);
}
async function uploadDocuments(documents: DB_Node[]) {
  const documentsStore = useNodesStore();
  for (const doc of documents) {
    await documentsStore.post(doc);
  }
}

export { analyseFile, validateFileStructure, compareDocumentsAndLocal, prepareNewDocuments, uploadDocument, uploadDocuments };
