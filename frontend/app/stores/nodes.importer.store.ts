import type { DB_Node, Node } from './db_structures';
import type { ImportBackupJob, ImportItem, ResourceImportTask } from '~/helpers/backups/Importer';

export const useNodesImporterStore = defineStore('nodesImporter', () => {
  const nodesStore = useNodesStore();

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
      const existingNode = nodesStore.getById(backupNode.id);
      if (!existingNode) {
        toCreate.push({
          type: 'resource',
          data: backupNode,
          id: backupNode.id,
          name: backupNode.file.name,
          status: 'pending',
        });
      } else {
        toUpdate.push({
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
  async function importAllNodesAndResources(nodes: { toCreate: ImportItem[]; toUpdate: ImportItem[] }, job: Ref<ImportBackupJob>) {
    job.value.status = 'in_progress';
    job.value.failures = 0;
    nodesStore.nodes.startBulk();
    try {
      const dbNodesToCreate = nodes.toCreate.filter(n => n.type === 'node').map(n => n.data);
      const dbNodesToUpdate = nodes.toUpdate.filter(n => n.type === 'node').map(n => n.data);
      const resourceTasksToCreate = nodes.toCreate.filter(n => n.type === 'resource').map(n => n.data);

      const corresponding: Record<string, string> = {};
      await importAllNodes(dbNodesToCreate, job, corresponding);
      await updateAllNodes(dbNodesToUpdate, job);
      await importAllResources(resourceTasksToCreate, job, corresponding);
      job.value.status = 'completed';
    } catch (error) {
      job.value.status = 'failed';
      job.value.error_message = (error as Error).message;
    }
    nodesStore.nodes.endBulk();
  }
  async function importAllNodes(nodes: DB_Node[], job: Ref<ImportBackupJob>, corresponding: Record<string, string>) {
    const nodesById = new Map(nodes.map(n => [n.id, n]));

    for (const node of nodes) {
      await importNode(node, nodesById, corresponding, job);
    }
  }
  async function importNode(node: DB_Node, nodesById: Map<string, DB_Node>, corresponding: Record<string, string>, job: Ref<ImportBackupJob>): Promise<void> {
    if (corresponding[node.id]) return; // Already imported

    if (node.parent_id && !nodesStore.getById(node.parent_id)) {
      const newParentId = corresponding[node.parent_id];

      if (!newParentId) {
        const parent = nodesById.get(node.parent_id); // Parent from the backup (future import)

        if (parent) {
          await importNode(parent, nodesById, corresponding, job); // Import the parent first
        } else {
          delete node.parent_id; // Parent not found → detach
        }
      }

      if (corresponding[node.parent_id!]) node.parent_id = corresponding[node.parent_id!]; // Update parent_id after import
    }

    // Import of the node
    const res = await nodesStore.post({ ...node, user_id: undefined });
    job.value.created.push(node.id);
    //await new Promise(resolve => setTimeout(resolve, 75));
    corresponding[node.id] = res.id;
  }
  async function updateAllNodes(nodes: DB_Node[], job?: Ref<ImportBackupJob>) {
    for (const node of nodes) {
      if (!nodesStore.getById(node.id)) continue;
      await nodesStore.update({ ...(node as Node), partial: false, shared: false, permissions: [] });
      if (job) job.value.updated.push(node.id);
      await new Promise(resolve => setTimeout(resolve, 75));
    }
  }
  async function importAllResources(resources: ResourceImportTask[], job: Ref<ImportBackupJob>, corresponding: Record<string, string>) {
    const preferences = usePreferencesStore();
    const defaultUploadFolder = preferences.get('defaultUploadFolder').value;
    const resourcesStore = useResourcesStore();
    for (const task of resources) {
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

        await new Promise(resolve => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`[Import] Failed to upload resource ${task.file.name}:`, error);
      }
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
