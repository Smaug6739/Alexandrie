<!-- Category creation modal -->
<!-- Should be like folder creation on linux or mac -->
<template>
  <div class="modal">
    <h2>Create a new {{ role == 1 ? 'category' : 'workspace' }}</h2>
    <form @submit.prevent="createCategory">
      <label for="name">Name</label>
      <input type="text" v-model="category.name" id="name" required />
      <label for="icon">Icon <AppHint text="SVG supported" /></label>
      <input type="text" v-model="category.icon" id="icon" />
      <label for="parent">Parent</label>
      <select v-model="category.parent_id" id="parent">
        <option :value="null">None</option>
        <option v-for="pc in categoriesStore.getParents.filter(c => c.role == 1)" :key="pc.id" :value="pc.id">{{ pc.name }}</option>
      </select>
      <label>Workspace <AppHint text="Only for root categories" /></label>
      <select v-model="category.workspace_id">
        <option :value="null">None</option>
        <option v-for="wp in categoriesStore.getAll.filter(a => a.role == 2)" :key="wp.id" :value="wp.id">{{ wp.name }}</option>
      </select>
      <label for="order">Order</label>
      <input type="number" v-model.number="category.order" id="order" />
      <AppButton type="primary">Create</AppButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/stores';

const categoriesStore = useCategoriesStore();
const props = defineProps<{ role: number }>();

const category = ref<Category>({
  name: '',
  type: 'category',
  id: '',
  role: props.role,
});

const createCategory = () => {
  // categoriesStore.post(category.value)
};
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--bg-contrast);
  padding: 1rem;
  border-radius: 8px;
  min-width: 700px;
}
</style>
