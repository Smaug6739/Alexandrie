<template>
  <div class="card-component">
    <header>
      <h1>Workspaces & Categories</h1>
      <div class="actions-row">
        <AppButton type="primary" @click="createWorkspace">+ Workspace</AppButton>
        <AppButton type="primary" @click="createCategory">+ Category</AppButton>
        <NuxtLink to="/dashboard/import"><AppButton type="secondary" variant="outline">Import</AppButton></NuxtLink>
      </div>
    </header>
    <div style="padding-bottom: 10px">
      <input
        v-model="filter"
        placeholder="Search for workspace..."
        style="width: 50%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px"
      />
    </div>
    <div v-for="workspace in filteredItems" :key="workspace.id" class="workspace">
      <h3 class="wp-name">
        <NuxtLink :to="`/dashboard/categories/${workspace.id}/edit`">{{ workspace.label }}</NuxtLink>
      </h3>
      <WorkspaceTree v-for="node in workspace.children" :key="node.id" :node="node" @edit="editNode" @delete="deleteNode" />
    </div>
    <div v-if="!filteredItems.length" style="color: #6c757d; font-style: italic">No workspaces or category found</div>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import DeleteCategoryModal from '~/components/Node/Modals/Delete.vue';
import WorkspaceTree from './_components/WorkspaceTree.vue';
import type { Node } from '~/stores';
import { filterTreeByLabel, type TreeItem } from '~/helpers/TreeBuilder';

const filter = ref('');
const nodesTree = useNodesTree();

const filteredItems = computed(() => {
  const items = nodesTree.categoriesTree.value;
  if (!filter.value.trim()) return items;
  return filterTreeByLabel(items, filter.value);
});

const createWorkspace = () => useModal().add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 1 } }));
const createCategory = () => useModal().add(new Modal(shallowRef(CreateCategoryModal), { props: { role: 2 } }));

function editNode(node: TreeItem<Node>) {
  useRouter().push('/dashboard/categories/' + node.id + '/edit');
}

function deleteNode(node: TreeItem<Node>) {
  useModal().add(new Modal(shallowRef(DeleteCategoryModal), { props: { categoryId: node.id } }));
}
</script>

<style scoped>
.workspace {
  display: block;
  width: 100%;
  padding: 5px 15px;
  border: var(--border-color) 1px solid;
  border-radius: 10px;
  flex-direction: column;
  margin-bottom: 16px;
}

.wp-name {
  font-size: 15px;
  font-weight: bold;
}

@media screen and (width <= 768px) {
  header {
    flex-direction: column;
  }
}
</style>
