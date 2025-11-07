<template>
  <div class="modal">
    <h2>New {{ role == 1 ? 'workspace' : 'category' }}</h2>
    <label for="name">Name</label>
    <input id="name" v-model="category.name" class="entry" type="text" required placeholder="Display name" />
    <label>Parent</label>
    <div>
      <AppSelect v-model="category.parent_id" :nullable="true" class="entry" :items="categoriesItem" placeholder="Select a category parent" />
    </div>
    <div style="display: flex; flex-wrap: wrap">
      <div style="min-width: 200px; flex: 1; margin-right: 10px">
        <label for="order">Category order <AppHint text="Order of the category in the sidebar" /></label>
        <input id="order" v-model.number="category.order" class="entry" type="number" placeholder="0" />
      </div>
      <div style="min-width: 200px; flex: 1; margin-left: 10px">
        <label for="color">Color</label>
        <AppColorPicker id="color" v-model="category.color" class="entry" :nullable="true" />
      </div>
    </div>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="primary" @click="createCategory">Create</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const categoriesStore = useNodesStore();
const sidebarTree = useSidebarTree();
const sidebar = useSidebar();
const categoriesItem = computed(() => new TreeStructure(sidebarTree.nodes.value.filter(c => c.data.role == 1 || c.data.role == 2)).generateTree());
const props = defineProps<{ role: 1 | 2 }>();

const category = ref<Partial<Node>>({
  name: '',
  role: props.role,
  accessibility: 1,
  parent_id: sidebarTree.getCategoryFromNode(sidebar.active_id.value)?.id || sidebar.workspaceId.value,
});
const emit = defineEmits(['close']);

const createCategory = () => {
  categoriesStore
    .post(category.value)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Category successfully created' });
      emit('close');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error during creation ', message: e }));
};
</script>

<style scoped lang="scss">
label {
  margin: 5px 0;
}

.entry {
  background: var(--bg-color);
}
</style>
