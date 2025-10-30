<template>
  <div class="modal">
    <h3>Delete document</h3>
    <p>Are you sure you want to delete this document ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <p v-if="allChildren.length > 0" class="warn">This document has {{ allChildren.length }} child documents. They will be deleted too.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteDoc">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ documentId: string }>();

const deleteDoc = () => {
  useNodesStore()
    .delete(props.documentId)
    .then(() => {
      emit('close');
      useRouter().push('/dashboard');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
const emit = defineEmits(['close']);
const allChildren = useSidebarTree().getSubTreeById(props.documentId);
</script>

<style scoped lang="scss">
.warn {
  color: var(--red)-dark;
  opacity: 0.7;
}
</style>
