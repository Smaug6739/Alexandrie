import type { DB_Category, DB_Document, DB_Ressource } from '~/stores';

interface ImportationStructure {
  documents: DB_Document[];
  categories: DB_Category[];
  ressources: DB_Ressource[];
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
        } catch (error) {
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

function validateFileStructure(data: any): data is ImportationStructure {
  if (typeof data === 'object' && data !== null && Array.isArray(data.documents)) {
    return true;
  }
  return false;
}

function compareDocumentsAndLocal(data: ImportationStructure) {
  const diff: DB_Document[] = [];
  const local = useSidebarTree().structure.value;
  for (const doc of data.documents) {
    const localDoc = local.getItem(doc.id);
    if (!localDoc) {
      diff.push(doc);
    }
  }
  return diff;
}

function prepareNewDocuments(new_docs: Partial<DB_Document>[]) {
  // For each document, check if parent_id and category are valid
  // If not, set them to null
  const local = useSidebarTree().structure.value;
  for (const doc of new_docs) {
    if (doc.parent_id && !local.getItem(doc.parent_id)) {
      doc.parent_id = null;
    }
    if (doc.category && !local.getItem(doc.category)) {
      doc.category = undefined;
    }
  }
}

async function uploadDocument(document: DB_Document) {
  const documentsStore = useDocumentsStore();
  await documentsStore.post({ type: 'document', ...document });
}
async function uploadDocuments(documents: DB_Document[]) {
  const documentsStore = useDocumentsStore();
  for (const doc of documents) {
    await documentsStore.post({ type: 'document', ...doc });
  }
}

export { analyseFile, validateFileStructure, compareDocumentsAndLocal, prepareNewDocuments, uploadDocument, uploadDocuments };
