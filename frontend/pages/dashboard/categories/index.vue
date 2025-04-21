<template>
  <div style="padding: 24px; gap: 16px" class="card-component">
    <header>
      <h1 style="font-size: 20px">Workspaces & Categories</h1>
      <div style="display: flex; gap: 8px">
        <AppButton type="primary" @click="createWorkspace">+ Workspace</AppButton>
        <AppButton type="primary" @click="createCategory">+ Category</AppButton>
        <AppButton type="secondary" variant="outline">Importer</AppButton>
      </div>
    </header>
    <div style="padding: 10px 0; border-top: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center">
      <input placeholder="Search category..." style="width: 50%; padding: 8px; border: 1px solid #ccc; border-radius: 4px" />
    </div>
    <div v-if="custom_tree.length" class="workspace" v-for="workspace in custom_tree" :key="workspace.id">
      <h3 class="wp-name">{{ workspace.title }}</h3>
      <WorkspaceTree v-for="node in workspace.childrens" :node="node" @edit="editNode" @delete="deleteNode" />
    </div>

    <div v-else style="color: #6c757d; font-style: italic">No workspaces found</div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/stores';
import CreateCategoryModal from './_modals/CreateCategoryModal.vue';
import WorkspaceTree from './_components/WorkspaceTree.vue';
const tree = useSidebarTree().tree;

const custom_tree = tree.value.filter(i => i.data.type === 'category' && i.data.role == 2) as Item<Category>[];

function createWorkspace() {
  useModal().modals.value?.push(new Modal(shallowRef(CreateCategoryModal), '', { role: 2 }));
}
function createCategory() {
  useModal().modals.value?.push(new Modal(shallowRef(CreateCategoryModal), '', { role: 1 }));
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
