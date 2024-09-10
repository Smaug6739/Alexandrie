<template>
  <div class="category-form-container">
    <h2>Add new category</h2>
    <form @submit.prevent="createCategory">
      <label for="name">Name</label>
      <input type="text" v-model="category.name" id="name" required />
      <label>Role</label>
      <select v-model="category.role">
        <option :value="1">Category</option>
        <option :value="2">Workspace</option>
      </select>
      <label for="icon">Icon (svg supported)</label>
      <input type="text" v-model="category.icon" id="icon" />
      <label for="parent">Parent</label>
      <select v-model="category.parent_id" id="parent">
        <option :value="null">None</option>
        <option v-for="pc in categoriesStore.getParents.filter(c => c.role == 1)" :key="pc.id" :value="pc.id">{{ pc.name }}</option>
      </select>
      <label>Workspace (for top categories)</label>
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

<script lang="ts" setup>
import type { Category } from '~/stores';

const categoriesStore = useCategoriesStore();
const category = ref<Category>({ id: '', role: 1, name: '', icon: '', parent_id: '', order: 0, type: 'category' });
definePageMeta({ breadcrumb: 'New' });

function createCategory() {
  categoriesStore
    .post(category.value)
    .then(() => {
      useNotifications().add({ title: 'Success:', message: 'Category posted', type: 'success', timeout: 5000 });
      useRouter().push('/dashboard/categories');
    })
    .catch(e => useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 5000 }));
}
</script>

<style scoped lang="scss">
.category-form-container {
  padding: 25px;
  margin: 40px auto;
  background-color: var(--bg-color);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  min-width: 40%;
  max-width: 800px;
}

h2 {
  font-size: 26px;
  text-align: center;
}
label {
  margin-top: 10px;
}

input,
textarea,
select {
  width: 100%;
  background-color: var(--bg-contrast);
}
</style>
