<template>
  <div class="category-form-container">
    <h2>Update category & workspace</h2>
    <form @submit.prevent="updateCategory">
      <label>ID</label>
      <input type="text" v-model="category.id" id="id" disabled />
      <label>Role</label>
      <select v-model="category.role">
        <option :value="1">Category</option>
        <option :value="2">Workspace</option>
      </select>
      <label>Name</label>
      <input type="text" v-model="category.name" id="name" required />
      <label>Icon (svg supported)</label>
      <textarea type="text" v-model="category.icon" rows="5"></textarea>
      <label>Workspace (for top categories)</label>
      <select v-model="category.workspace_id">
        <option :value="null">None</option>
        <option v-for="wp in categoriesStore.getAll.filter(a => a.id != categoryId && a.role == 2)" :value="wp.id">{{ wp.name }}</option>
      </select>
      <label>Parent</label>
      <select v-model="category.parent_id">
        <option :value="null">None</option>
        <option v-for="cp in categoriesStore.getParents.filter(a => a.id != categoryId && a.role == 1)" :value="cp.id">{{ cp.name }}</option>
      </select>
      <label for="order">Order</label>
      <input type="number" v-model.number="category.order" id="order" />
      <div style="display: flex; justify-content: flex-end">
        <AppButton type="danger" @click="deleteCategory()">Delete</AppButton>
        <AppButton type="primary" class="btn primary">Update</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
const categoriesStore = useCategoriesStore();
const categoryId = useRoute().query.category;
const category = computed(() => categoriesStore.getById(categoryId as string) || { id: '', role: 1, name: '', icon: '', workspace_id: '', parent_id: '', order: 0, type: 'category' as const });

definePageMeta({ breadcrumb: 'Edit' });

const updateCategory = async () => {
  if (category.value)
    categoriesStore
      .update(category.value)
      .then(() => {
        useNotifications().add({ title: 'Success:', message: 'Category updated', type: 'success', timeout: 5000 });
        useRouter().push('/dashboard/categories');
      })
      .catch(e => useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 5000 }));
};
const deleteCategory = async () => {
  if (category.value)
    categoriesStore
      .delete(category.value.id)
      .then(() => {
        useNotifications().add({ title: 'Success:', message: 'Category deleted', type: 'success', timeout: 5000 });
        useRouter().push('/dashboard/categories');
      })
      .catch(e => useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 5000 }));
};
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
