import type { DB_Node, Node } from './db_structures';
import type { ImportBackupJob, ImportItem, NodeImportItem, ResourceImportTask } from '~/helpers/backups/Importer';

const WAIT_BETWEEN_IMPORTS_MS = 50;

export const useNodesImporterStore = defineStore('nodesImporter', () => {
  const nodesStore = useNodesStore();
  const resourcesStore = useResourcesStore();
  const preferences = usePreferencesStore();
  const defaultUploadFolder = preferences.get('defaultUploadFolder').value;

  // Prepare nodes for import by checking which nodes need to be created or updated
  function prepareImport(nodesToImport: DB_Node[], filesToImport: ResourceImportTask[] = []): { toCreate: ImportItem[]; toUpdate: ImportItem[] } {
    const toCreate: ImportItem[] = [];
    const toUpdate: ImportItem[] = [];
    for (const backupNode of nodesToImport) {
      const existingNode = nodesStore.getById(backupNode.id);
      if (!existingNode) {
        toCreate.push({
          type: 'node',
          data: backupNode,
          id: backupNode.id,
          name: backupNode.name,
          status: 'pending',
        });
      } else {
        if (backupNode.updated_timestamp !== existingNode.updated_timestamp) {
          toUpdate.push({
            type: 'node',
            data: backupNode,
            id: backupNode.id,
            name: backupNode.name,
            status: 'pending',
          });
        }
      }
    }
    for (const backupNode of filesToImport) {
      console.log('Preparing resource for import:', backupNode.file.name, 'with ID:', backupNode.id);
      const existingNode = nodesStore.getById(backupNode.id);
      if (!existingNode) {
        toCreate.push({
          type: 'resource',
          data: backupNode,
          id: backupNode.id,
          name: backupNode.file.name,
          status: 'pending',
        });
      }
    }
    return { toCreate, toUpdate };
  }
  async function importAllNodesAndResources(
    nodes: { toCreate: ImportItem[]; toUpdate: ImportItem[] },
    job: Ref<ImportBackupJob>,
    importResourcesFirst: boolean = false,
  ) {
    job.value.status = 'in_progress';
    job.value.failures = 0;
    nodesStore.nodes.startBulk();
    try {
      const corresponding: Record<string, string> = {};
      if (importResourcesFirst) await importAllResources(nodes.toCreate, job, corresponding);
      await importAllNodes(nodes.toCreate, job, corresponding);
      await updateAllNodes(nodes.toUpdate, job, corresponding);
      if (!importResourcesFirst) await importAllResources(nodes.toCreate, job, corresponding);
      job.value.status = 'completed';
    } catch (error) {
      job.value.status = 'failed';
      job.value.error_message = (error as Error).message;
    }
    nodesStore.nodes.endBulk();
  }
  async function importAllNodes(items: ImportItem[], job: Ref<ImportBackupJob>, corresponding: Record<string, string>) {
    const nodesById = new Map(items.map(n => [n.id, n]));

    for (const item of items) {
      if (item.type !== 'node') continue;
      await importNode(item, nodesById, corresponding, job);
    }
  }

  async function importNode(
    item: NodeImportItem,
    nodesById: Map<string, ImportItem>,
    corresponding: Record<string, string>,
    job: Ref<ImportBackupJob>,
  ): Promise<void> {
    const node = item.data;
    if (corresponding[node.id]) return; // Already imported

    if (node.parent_id && !nodesStore.getById(node.parent_id)) {
      const newParentId = corresponding[node.parent_id];

      if (!newParentId) {
        const parent = nodesById.get(node.parent_id); // Parent from the backup (future import)

        if (parent) {
          await importNode(parent as NodeImportItem, nodesById, corresponding, job); // Import the parent first
        } else {
          delete node.parent_id; // Parent not found → detach
        }
      }

      if (corresponding[node.parent_id!]) node.parent_id = corresponding[node.parent_id!]; // Update parent_id after import
    }

    try {
      // Replace all occurences of old IDs with the new one in the content
      replaceIdsInContent(node, corresponding);

      // Import of the node
      const res = await nodesStore.post({ ...node, user_id: undefined });
      job.value.created.push(node.id);
      item.status = 'completed';
      await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_IMPORTS_MS));
      corresponding[node.id] = res.id;
    } catch (error) {
      item.status = 'failed';
      item.error_message = String(error);
      job.value.failures++;
    }
  }
  async function updateAllNodes(items: ImportItem[], job?: Ref<ImportBackupJob>, corresponding: Record<string, string> = {}) {
    for (const item of items) {
      if (item.type !== 'node') continue;
      const node = item.data;
      if (!nodesStore.getById(node.id)) continue;
      try {
        replaceIdsInContent(node, corresponding);

        await nodesStore.update({ ...(node as Node), partial: false, shared: false, permissions: [] });
        if (job) job.value.updated.push(node.id);
        item.status = 'completed';
        await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_IMPORTS_MS));
      } catch (error) {
        item.status = 'failed';
        item.error_message = String(error);
        if (job) job.value.failures++;
      }
    }
  }
  async function importAllResources(items: ImportItem[], job: Ref<ImportBackupJob>, corresponding: Record<string, string>) {
    for (const item of items) {
      if (item.type !== 'resource') continue;
      const task = item.data;
      try {
        let finalParentId = undefined;
        if (task.parent_id) finalParentId = corresponding[task.parent_id] || task.parent_id;
        else {
          if (job.value.options?.defaultValues?.defaultParent) finalParentId = job.value.options.defaultValues.defaultParent;
          else if (defaultUploadFolder) finalParentId = defaultUploadFolder;
        }

        const formData = new FormData();
        formData.append('file', task.file);
        if (finalParentId) formData.append('parent_id', finalParentId);

        const uploadedResourceNode = await resourcesStore.post(formData);

        job.value.created.push(uploadedResourceNode.id);
        corresponding[task.id] = uploadedResourceNode.id;
        item.status = 'completed';
        await new Promise(resolve => setTimeout(resolve, WAIT_BETWEEN_IMPORTS_MS));
      } catch (error) {
        item.status = 'failed';
        item.error_message = String(error);
        job.value.failures++;
      }
    }
  }

  function replaceIdsInContent(node: DB_Node, corresponding: Record<string, string>) {
    for (const [oldId, newId] of Object.entries(corresponding)) {
      const regex = new RegExp(`\\b${oldId}\\b`, 'g');
      if (node.content) node.content = node.content.replace(regex, newId);
      if (node.content_compiled) node.content_compiled = node.content_compiled?.replace(regex, newId);
    }
  }

  return {
    prepareImport,
    importAllNodesAndResources,
    importAllNodes,
    updateAllNodes,
    importAllResources,
  };
});
