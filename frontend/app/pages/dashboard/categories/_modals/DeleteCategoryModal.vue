<template>
  <div class="modal">
    <h3>Delete category</h3>
    <p>Are you sure you want to delete this category ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <p v-if="allChildren.length > 0" class="warn">This category has {{ allChildren.length }} child documents/categories. They will be deleted too.</p>
    <p v-else class="warn">If this category has children, they will be deleted too.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteDoc">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ categoryId: string }>();
const emit = defineEmits(['close']);

const deleteDoc = () => {
  useNodesStore()
    .delete(props.categoryId)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Category successfully deleted' });
      emit('close');
      useRouter().push('/dashboard/categories');
    })
    .catch(e => {
      useNotifications().add({ type: 'error', title: 'Error during deletion', message: e });
    });
};
const allChildren = useSidebarTree().getSubTreeById(props.categoryId);
</script>

<style scoped lang="scss">
.warn {
  color: var(--red)-dark;
  opacity: 0.7;
}
</style>
