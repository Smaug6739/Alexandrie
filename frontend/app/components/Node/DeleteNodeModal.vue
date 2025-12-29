<template>
  <div class="modal">
    <h3>Delete {{ nodeType }}</h3>
    <p>Are you sure you want to delete this {{ nodeType }} ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <p v-if="allChildren.length > 0" class="warn">This {{ nodeType }} has {{ allChildren.length }} child documents. They will be deleted too.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteDoc">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps<{ node: Node }>();
const emit = defineEmits(['close']);

const allChildren = useSidebarTree().getSubTreeById(props.node.id);
const nodeType = computed(() => {
  switch (props.node.role) {
    case 1:
      return 'workspace';
    case 2:
      return 'category';
    case 3:
      return 'document';
    case 4:
      return 'resource';
    default:
      return 'node';
  }
});
const deleteDoc = () => {
  useNodesStore()
    .delete(props.node.id)
    .then(() => {
      emit('close');
      useRouter().push('/dashboard');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>

<style scoped lang="scss">
.warn {
  color: var(--red-dark);
  opacity: 0.7;
}
</style>
