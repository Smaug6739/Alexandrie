<template>
  <div class="page-card">
    <header>
      <h1>{{ t('nodes.container.title') }}</h1>
      <div class="actions-row">
        <AppButton type="primary" @click="createWorkspace">{{ t('nodes.container.newWorkspace') }}</AppButton>
        <AppButton type="primary" @click="createCategory">{{ t('nodes.container.newCategory') }}</AppButton>
        <NuxtLink to="/dashboard/import"
          ><AppButton type="secondary" variant="outline">{{ t('nodes.container.import') }}</AppButton></NuxtLink
        >
      </div>
    </header>
    <div style="padding-bottom: 10px">
      <input v-model="filter" :placeholder="t('nodes.container.searchPlaceholder')" />
    </div>
    <div v-for="workspace in filteredItems" :key="workspace.id" class="workspace">
      <h3 class="wp-name">
        <NuxtLink :to="`/dashboard/categories/${workspace.id}/edit`">{{ workspace.label }}</NuxtLink>
      </h3>
      <WorkspaceTree v-for="node in workspace.children" :key="node.id" :node="node" @edit="editNode" @delete="deleteNode" />
    </div>
    <div v-if="!filteredItems.length" style="color: #6c757d; font-style: italic">{{ t('nodes.container.noWorkspaces') }}</div>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from '~/components/Node/Modals/CreateCategory.vue';
import DeleteCategoryModal from '~/components/Node/Modals/Delete.vue';
import WorkspaceTree from './_components/WorkspaceTree.vue';
import type { Node } from '~/stores';
import { filterTreeByLabel, type TreeItem } from '~/helpers/TreeBuilder';

const { t } = useI18nT();

const filter = ref('');
const nodesTree = useNodesTree();

const filteredItems = computed(() => {
  const items = nodesTree.treeUpToRole(2).value;
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
  border: var(--border) 1px solid;
  border-radius: var(--radius-lg);
  flex-direction: column;
  margin-bottom: 16px;
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
