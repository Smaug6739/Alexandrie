<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Workspaces & Categories <tag class="blue">New</tag></h1>
      <div style="display: flex; gap: 8px">
        <AppButton type="primary" @click="createWorkspace">+ Workspace</AppButton>
        <AppButton type="primary" @click="createCategory">+ Category</AppButton>
        <NuxtLink to="/dashboard/import"><AppButton type="secondary" variant="outline">Import</AppButton></NuxtLink>
      </div>
    </header>
    <div style="padding: 10px 0; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center">
      <input placeholder="Search for workspace..." v-model="filter" style="width: 50%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px" />
    </div>
    <div v-if="tree.length" class="workspace" v-for="workspace in filteredItems" :key="workspace.id">
      <h3 class="wp-name">{{ workspace.label }}</h3>
      <WorkspaceTree v-for="node in workspace.childrens" :node="node" @edit="editNode" @delete="deleteNode" />
    </div>

    <div v-else style="color: #6c757d; font-style: italic">No workspaces found</div>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from './_modals/CreateCategoryModal.vue';
import DeleteCategoryModal from './_modals/DeleteCategoryModal.vue';
import WorkspaceTree from './_components/WorkspaceTree.vue';
import type { Category } from '~/stores';

const filter = ref('');
const tree = computed(() => new TreeStructure(useSidebarTree().categories.value).generateTree() as Item<Category>[]);

const filteredItems = computed(() => {
  if (!filter.value.trim()) return tree.value;

  const filterRecursive = (items: Item<Category>[]): Item<Category>[] => {
    return items
      .map(item => {
        const matches = item.label.toLowerCase().includes(filter.value.toLowerCase());
        const filteredChildren = item.childrens ? filterRecursive(item.childrens) : [];
        if (matches || filteredChildren.length > 0) {
          return { ...item, childrens: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as Item<Category>[];
  };

  return filterRecursive(tree.value);
});

const createWorkspace = () => useModal().add(new Modal(shallowRef(CreateCategoryModal), { role: 2 }));
const createCategory = () => useModal().add(new Modal(shallowRef(CreateCategoryModal), { role: 1 }));

function editNode(node: Item) {
  useRouter().push('/dashboard/categories/' + node.id + '/edit');
}

function deleteNode(node: Item) {
  useModal().add(new Modal(shallowRef(DeleteCategoryModal), { categoryId: node.id }));
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 16px;
}
.workspace {
  display: flex;
  flex-direction: column;
  padding: 5px 15px;
  border-radius: 10px;
  border: var(--border-color) 1px solid;
  width: 100%;
  display: block;
  margin-bottom: 16px;
}

.wp-name {
  font-size: 15px;
  font-weight: bold;
}
@media screen and (max-width: 768px) {
  header {
    flex-direction: column;
  }
}
</style>
