<template>
  <div class="page-card">
    <Teleport to="#navbar-title"><Icon name="categories" display="lg" />{{ t('nodes.container.title') }}</Teleport>

    <Teleport to="#navbar-actions">
      <AppButton type="primary" @click="createWorkspace">{{ t('nodes.container.newWorkspace') }}</AppButton>
      <AppButton type="primary" @click="createCategory">{{ t('nodes.container.newCategory') }}</AppButton>
      <NuxtLink to="/dashboard/import">
        <AppButton type="secondary" variant="outline">{{ t('nodes.container.import') }}</AppButton>
      </NuxtLink>
    </Teleport>

    <div style=" display: flex; justify-content: space-between; align-items: center;padding-bottom: 10px;">
      <input v-model="filter" :placeholder="t('nodes.container.searchPlaceholder')" />
      <ViewSelection v-model="view" :show-graph="true" />
    </div>
    
    <div v-if="view !== 'graph'">
      <div v-for="workspace in filteredItems" :key="workspace.id" class="workspace">
        <h3 class="wp-name">
          <NuxtLink :to="`/dashboard/categories/${workspace.id}/edit`">{{ workspace.label }}</NuxtLink>
        </h3>
        <WorkspaceTree v-for="node in workspace.children" :key="node.id" :node="node" @edit="editNode" @delete="deleteNode" />
      </div>
      <div v-if="!filteredItems.length" style="font-style: italic; color: #6c757d">{{ t('nodes.container.noWorkspaces') }}</div>
    </div>
    
    <div v-else>
      <GraphView :nodes="graphItems" @node-click="editNode" />
      <div v-if="!filteredItems.length" style="font-style: italic; color: #6c757d">{{ t('nodes.container.noWorkspaces') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import DeleteCategoryModal from '~/components/Node/Modals/Delete.vue';
import WorkspaceTree from './_components/WorkspaceTree.vue';
import ViewSelection, { type ViewMode } from '~/components/ViewSelection.vue';
import GraphView from '~/components/Node/GraphView.vue';
import { filterTreeByLabel, type TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

const nodesTree = useNodesTree();

const { t } = useI18nT();
const modals = useModal();
const router = useRouter();

const filter = ref('');
const view = ref<ViewMode>('list');

const filteredItems = computed(() => {
  const items = nodesTree.getTreeUpToRole(2).value;
  if (!filter.value.trim()) return items;
  return filterTreeByLabel(items, filter.value);
});

// For the graph view, we include documents (role 3) so users can see the full tree structure,
// especially useful since many workspaces only contain documents and no sub-categories.
const graphItems = computed(() => {
  const items = nodesTree.tree.value;
  if (!filter.value.trim()) return items;
  return filterTreeByLabel(items, filter.value);
});

const createWorkspace = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
const createCategory = () => modals.add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 2 } }));

function editNode(node: TreeItem<Node>) {
  router.push('/dashboard/categories/' + node.id + '/edit');
}

function deleteNode(node: TreeItem<Node>) {
  modals.add(new Modal(shallowRef(DeleteCategoryModal), { props: { categoryId: node.id } }));
}
</script>

<style scoped>
.workspace {
  display: block;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
  padding: 5px 15px;
  border: var(--border) 1px solid;
  border-radius: var(--radius-lg);
}

.wp-name {
  font-size: 15px;
  font-weight: bold;
}

input {
  max-width: 500px;
}

@media screen and (width <= 768px) {
  header {
    flex-direction: column;
  }
}
</style>
