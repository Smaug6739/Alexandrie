<template>
  <div style="width: 100%">
    <div class="category-form-container">
      <h2>Modifier la catégorie</h2>
      <form @submit.prevent="updateCategory">
        <div class="input-group">
          <label for="id">ID</label>
          <input type="text" v-model="category.id" id="id" disabled />
        </div>
        <div class="input-group">
          <label for="name">Nom</label>
          <input type="text" v-model="category.name" id="name" required />
        </div>
        <div class="input-group">
          <label for="icon">Icône</label>
          <textarea type="text" v-model="category.icon" id="icon" rows="5"></textarea>
        </div>
        <div class="input-group">
          <label for="parent">Parent</label>
          <select v-model="category.parent_id" id="parent">
            <option value="">Aucun</option>
            <option v-for="mainCategory in categoriesStore.getParents" :key="mainCategory.id" :value="mainCategory.id">
              {{ mainCategory.name }}
            </option>
          </select>
        </div>
        <div class="input-group">
          <label for="order">Ordre</label>
          <input type="number" v-model.number="category.order" id="order" />
        </div>
        <div style="display: flex">
          <button class="btn danger" @click="deleteCategory()">Delete</button>
          <button type="submit" class="btn primary">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const categoriesStore = useCategoriesStore();
const category = computed(() => categoriesStore.getById(categoryId as string) || { id: '', name: '', icon: '', parent_id: '', order: 0, type: 'category' as const });
const categoryId = route.query.category;

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
  background-color: var(--bg-contrast);
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  min-width: 30%;
  max-width: 600px;
}

h2 {
  font-size: 26px;
  text-align: center;
}

.input-group {
  margin-bottom: 20px;
}

input,
textarea {
  width: 100%;
}
</style>
