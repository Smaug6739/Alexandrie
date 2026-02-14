<template>
  <div class="modal">
    <h3>Remove this document</h3>
    <p>Are you sure you want to remove this document?</p>
    <p style="opacity: 0.7">After this action, you will no longer have access to this document.</p>
    <p v-if="allChildren.length > 0" class="warn">This document has {{ allChildren.length }} child documents. They will be removed too.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="removeDoc">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ nodeId: string }>();
const emit = defineEmits(['close']);

const nodesTree = useNodesTree();
const allChildren = nodesTree.getSubtreeAsArray(props.nodeId);

const removeDoc = () => {
  useNodesStore()
    .removePermission(props.nodeId, useUserStore().user!.id)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Document removed' });
      emit('close');
      useRouter().push('/dashboard');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>

<style scoped lang="scss">
.warn {
  color: var(--red)-dark;
  opacity: 0.7;
}
</style>
