<template>
  <div class="modal">
    <h3>Delete category</h3>
    <p>Are you sure you want to delete this category ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <p v-if="allChildren.length > 0" class="warn">This category has {{ allChildren.length }} child documents/categories. They will be deleted too.</p>
    <div class="footer">
      <AppButton @click="emit('close')" type="secondary">Cancel</AppButton>
      <AppButton @click="deleteDoc" type="danger">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ categoryId: string }>();
const deleteDoc = () => {
  useCategoriesStore()
    .delete(props.categoryId)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Category successfully deleted' });
      emit('close');
    })
    .catch(e => {
      useNotifications().add({ type: 'error', title: 'Error during deletion', message: e });
    });
};
const emit = defineEmits(['close']);
const allChildren = useSidebarTree().getSubTreeById(props.categoryId);
</script>

<style scoped lang="scss">
.modal {
  min-width: 500px;
}
.warn {
  color: $red-dark;
  opacity: 0.7;
}
</style>
