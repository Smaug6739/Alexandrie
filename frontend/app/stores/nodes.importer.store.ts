import type { DB_Node, Node } from './db_structures';
import type { ImportJob, ResourceImportTask } from '~/helpers/backups/Importer';

export const useNodesImporterStore = defineStore('nodesImporter', () => {
  const nodesStore = useNodesStore();

  // Prepare nodes for import by checking which nodes need to be created or updated
  function prepareImport(nodesToImport: DB_Node[]): { toCreate: DB_Node[]; toUpdate: DB_Node[] } {
    const toCreate: DB_Node[] = [];
    const toUpdate: DB_Node[] = [];
    for (const backupNode of nodesToImport) {
      const existingNode = nodesStore.getById(backupNode.id);
      if (!existingNode) {
        toCreate.push(backupNode);
      } else {
        if (backupNode.updated_timestamp !== existingNode.updated_timestamp) {
          toUpdate.push(backupNode);
        }
      }
    }
    return { toCreate, toUpdate };
  }
  async function importAllNodesAndResources(nodes: { toCreate: DB_Node[]; toUpdate: DB_Node[]; resources: ResourceImportTask[] }, job: Ref<ImportJob>) {
    job.value.status = 'in_progress';
    job.value.failures = 0;
    nodesStore.nodes.startBulk();
    try {
      const corresponding: Record<string, string> = {};
      await importAllNodes(nodes.toCreate, job, corresponding);
      await updateAllNodes(nodes.toUpdate, job);
      await importAllResources(nodes.resources, job, corresponding);
      job.value.status = 'completed';
    } catch (error) {
      job.value.status = 'failed';
      job.value.error_message = (error as Error).message;
    }
    nodesStore.nodes.endBulk();
  }
  async function importAllNodes(nodes: DB_Node[], job: Ref<ImportJob>, corresponding: Record<string, string>) {
    const nodesById = new Map(nodes.map(n => [n.id, n]));

    for (const node of nodes) {
      await importNode(node, nodesById, corresponding, job);
    }
  }
  async function importNode(node: DB_Node, nodesById: Map<string, DB_Node>, corresponding: Record<string, string>, job: Ref<ImportJob>): Promise<void> {
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
  async function updateAllNodes(nodes: DB_Node[], job?: Ref<ImportJob>) {
    for (const node of nodes) {
      if (!nodesStore.getById(node.id)) continue;
      await nodesStore.update({ ...(node as Node), partial: false, shared: false, permissions: [] });
      if (job) job.value.updated.push(node.id);
      await new Promise(resolve => setTimeout(resolve, 75));
    }
  }
  async function importAllResources(resources: ResourceImportTask[], job: Ref<ImportJob>, corresponding: Record<string, string>) {
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
