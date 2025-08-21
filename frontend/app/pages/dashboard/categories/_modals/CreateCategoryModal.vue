<template>
  <div class="modal">
    <h2>New {{ role == 1 ? 'category' : 'workspace' }}</h2>
    <label for="name">Name</label>
    <input id="name" v-model="category.name" class="entry" type="text" required placeholder="Display name" >

    <label>Parent</label>
    <div>
      <AppSelect v-model="category.parent_id" class="entry" :items="categoriesItem" placeholder="Select a category parent" />
    </div>
    <div style="display: flex">
      <div style="flex: 1; margin-right: 10px">
        <label for="order">Order <AppHint text="Order of the category in the sidebar" /></label>
        <input id="order" v-model.number="category.order" class="entry" type="number" placeholder="0" >
      </div>
      <div style="flex: 1; margin-left: 10px">
        <label for="color">Color</label>
        <AppColorPicker id="color" v-model:selected-color="category.color" class="entry" :nullable="true" />
      </div>
    </div>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
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
  order: 0,
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
