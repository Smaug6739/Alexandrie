<template>
  <div class="card-component">
    <h1 style="font-size: 20px">Update category & workspace</h1>
    <form @submit.prevent v-if="category">
      <div class="form-row">
        <div class="form-column">
          <label>ID</label>
          <input type="text" v-model="category.id" id="id" disabled />
        </div>
        <div class="form-column">
          <label for="order">Order</label>
          <input type="number" v-model.number="category.order" id="order" />
        </div>
      </div>
      <label>Name</label>
      <input type="text" v-model="category.name" id="name" required />
      <label>Role</label>
      <select v-model="category.role">
        <option :value="1">Category</option>
        <option :value="2">Workspace</option>
      </select>
      <label style="display: flex; align-items: center">Icon <AppHint text="SVG supported" /></label>
      <textarea type="text" v-model="category.icon" rows="5"></textarea>

      <label>Parent</label>
      <AppSelect v-model="category.parent_id" :items="categoriesItem" placeholder="Select a category parent" />

      <label for="color">Color</label>
      <AppColorPicker v-model:selectedColor="category.color" name="color" :nullable="true" />

      <div style="display: flex; justify-content: flex-end">
        <AppButton type="danger" @click="deleteCategory()">Delete</AppButton>
        <AppButton type="primary" class="btn primary" @click="updateCategory">Update</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteModal from '../_modals/DeleteCategoryModal.vue';

const categoriesStore = useCategoriesStore();
const route = useRoute();
const category = computed(() => categoriesStore.getById(route.params.id as string));
const categoriesItem = new TreeStructure(useSidebarTree().categories.value).generateTree().filter(i => i.data.type === 'category' && i.data.role == 2);

definePageMeta({ breadcrumb: 'Edit' });

const updateCategory = async () => {
  if (category.value)
    categoriesStore
      .update(category.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: 'Category updated' });
        useRouter().push('/dashboard/categories');
      })
      .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
const deleteCategory = async () => {
  useModal().add(new Modal(shallowRef(DeleteModal), { categoryId: category.value?.id || '' }));
};
</script>

<style scoped lang="scss">
label {
  margin-top: 10px;
}

input,
textarea,
select {
  width: 100%;
}
.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-column {
  flex: 1;
  min-width: 200px;
}
</style>
