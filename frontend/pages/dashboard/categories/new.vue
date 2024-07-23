<template>
  <div style="width: 100%">
    <div class="category-form-container">
      <h2>Ajouter une nouvelle catégorie</h2>
      <form @submit.prevent="createCategory">
        <div class="input-group">
          <label for="name">Nom</label>
          <input type="text" v-model="category.name" id="name" required />
        </div>
        <div class="input-group">
          <label for="icon">Icône</label>
          <input type="text" v-model="category.icon" id="icon" />
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
        <button type="submit" class="btn primary">Create</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Category } from '~/stores';

const categoriesStore = useCategoriesStore();
const category = ref<Category>({ id: '', name: '', icon: '', parent_id: '', order: 0, type: 'category' });
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
  background-color: var(--bg-contrast);
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  margin: 40px auto;
  border-radius: 12px;
  min-width: 30%;
  max-width: 600px;
}

h2 {
  font-size: 26px;
  margin-bottom: 30px;
  color: var(--font-color);

  text-align: center;
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}
</style>
