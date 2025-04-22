<template>
  <div class="modal">
    <h3>Delete document</h3>
    <p>Are you sure you want to delete this document?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <AppButton @click="deleteDoc" style="float: right" type="danger">Confirm</AppButton>
    <AppButton @click="close" style="float: right" type="link">Cancel</AppButton>
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

const deleteDoc = () => {
  // categoriesStore.post(category.value)
};
// Emit close event to parent component
const emit = defineEmits(['close']);
const close = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.modal {
  background-color: var(--bg-contrast);
  padding: 0 1rem;
  border-radius: 8px;
  min-width: 700px;
}
</style>
