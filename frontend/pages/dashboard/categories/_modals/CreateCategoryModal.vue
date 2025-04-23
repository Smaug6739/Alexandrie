<template>
  <div class="modal">
    <h2>Create a new {{ role == 1 ? 'category' : 'workspace' }}</h2>
    <form>
      <label for="name">Name</label>
      <input type="text" v-model="category.name" required />
      <label for="icon">Icon <AppHint text="SVG supported" /></label>
      <input type="text" v-model="category.icon" id="icon" />
      <label for="parent">Parent</label>
      <div>
        <AppSelect v-model="category.parent_id" :items="categoriesItem" placeholder="Select a category parent" />
      </div>
      <label for="order">Order <AppHint text="Order of the category in the sidebar" /></label>
      <input type="number" v-model.number="category.order" id="order" />
    </form>
    <div class="footer">
      <AppButton @click="emit('close')" type="secondary">Cancel</AppButton>
      <AppButton type="primary" @click="createCategory">Create</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/stores';

const categoriesStore = useCategoriesStore();
const categoriesItem = new TreeStructure(useSidebarTree().categories.value).generateTree().filter(i => i.data.type === 'category' && i.data.role == 2);
const props = defineProps<{ role: number }>();

const category = ref<Partial<Category>>({
  name: '',
  type: 'category',
  role: props.role,
  id: '0',
});
const emit = defineEmits(['close']);

const createCategory = () => {
  categoriesStore
    .post(category.value)
    .then(() => {
      useNotifications().add({ title: 'Success:', message: 'Category created', type: 'success', timeout: 3000 });
      emit('close');
    })
    .catch(e => {
      useNotifications().add({ title: 'Error:', message: e, type: 'error', timeout: 3000 });
    });
};
</script>

<style scoped lang="scss">
.modal {
  min-width: 700px;
}
</style>
