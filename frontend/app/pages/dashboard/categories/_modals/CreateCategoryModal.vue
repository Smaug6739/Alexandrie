<template>
  <div class="modal">
    <h2>New {{ role == 1 ? 'category' : 'workspace' }}</h2>
    <label for="name">Name</label>
    <input class="entry" type="text" v-model="category.name" required id="name" placeholder="Display name" />
    <label for="icon">Icon <AppHint text="SVG supported" /></label>
    <input class="entry" type="text" v-model="category.icon" id="icon" />
    <label for="color">Color</label>
    <AppColorPicker class="entry" v-model:selectedColor="category.color" id="color" :nullable="true" />
    <label>Parent</label>
    <div>
      <AppSelect class="entry" v-model="category.parent_id" :items="categoriesItem" placeholder="Select a category parent" />
    </div>
    <label for="order">Order <AppHint text="Order of the category in the sidebar" /></label>
    <input class="entry" type="number" v-model.number="category.order" id="order" placeholder="0" />
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
      useNotifications().add({ type: 'success', title: 'Category successfully created' });
      emit('close');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error during creation ', message: e }));
};
</script>

<style scoped lang="scss">
.modal {
  min-width: 700px;
}
label {
  margin: 5px 0;
}
.entry {
  background: var(--bg-color);
}
</style>
