<template>
  <div style="padding: 24px; gap: 16px">
    <header>
      <h1 style="font-size: 20px; font-weight: bold">Workspaces & Categories</h1>

      <div style="display: flex; gap: 8px">
        <AppButton type="primary" @click="createWorkspace">+ Workspace</AppButton>
        <AppButton type="primary" @click="createCategory">+ Category</AppButton>
        <AppButton type="secondary" variant="outline">Importer</AppButton>
      </div>
    </header>
    <div style="padding: 10px 0; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center">
      <input v-model="search" placeholder="Search category..." style="width: 50%; padding: 8px; border: 1px solid #ccc; border-radius: 4px" />
    </div>
    <div v-if="workspaces.length" class="workspace" v-for="workspace in workspaces" :key="workspace.id">
      <h3 class="wp-name">{{ workspace.title }}</h3>
      <WorkspaceTree v-for="node in workspace.childrens" :node="node" @edit="editNode" @delete="deleteNode" />
    </div>

    <div v-else style="color: #6c757d; font-style: italic">No workspaces</div>
  </div>
</template>

<script setup lang="ts">
import CreateCategoryModal from './_modals/CreateCategoryModal.vue';
import type { Category } from '~/stores';

const categories = useCategoriesStore().getAll;
const tree = new ItemsManager(
  categories.map((c: Category) => {
    return {
      id: c.id,
      title: c.name,
      type: 'category',
      route: `/categories/${c.id}`,
      parent_id: c.parent_id || '',
      data: c,
      show: ref(true),
    } as Item<Category>;
  }),
).generateTree() as Item<Category>[];
console.log(tree);
const workspaces = tree.filter((i: Item<Category>) => i.data.role === 2);
console.log(workspaces);
const search = ref('');

function createWorkspace() {
  // logique de création de workspace
  useModal().modals.value?.push({
    component: shallowRef(CreateCategoryModal),
    name: '',
    props: undefined,
  });
}

function createCategory() {
  // logique de création de catégorie
}

function editNode(node: Item) {
  // ouvrir modal ou formulaire d'édition
}

function deleteNode(node: Item) {
  // confirmation + suppression
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
  background-color: #fff;
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
.card-component {
  display: block;
  margin: 2px 0;
}
</style>
