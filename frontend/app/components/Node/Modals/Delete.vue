<template>
  <div class="modal">
    <!-- Single node deletion -->
    <template v-if="props.node">
      <h3>Delete {{ nodeType }} • {{ props.node.name }}</h3>
      <p>Are you sure you want to delete this {{ nodeType }}?</p>
      <p v-if="allChildren.length > 0" class="warn">This {{ nodeType }} has {{ allChildren.length }} child documents. They will be deleted too.</p>
    </template>

    <!-- Bulk deletion -->
    <template v-else-if="props.nodes">
      <h3>Delete {{ props.nodes.length > 1 ? 'nodes' : 'node' }}</h3>
      <p>
        Are you sure you want to delete the selected {{ props.nodes.length > 1 ? 'nodes' : 'node' }}?
        <br />
        <span v-if="props.nodes.length > 1">
          This action will delete <strong>{{ props.nodes.length }}</strong> nodes.
        </span>
      </p>
    </template>

    <p class="description">This action is irreversible</p>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="handleDelete">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRoleName } from '~/helpers/node';
import type { Node } from '~/stores';

const props = defineProps<{
  node?: Node;
  nodes?: Node[];
  redirectTo?: string;
}>();

const emit = defineEmits(['close']);

const store = useNodesStore();
const tree = useSidebarTree();

const allChildren = computed(() => (props.node ? tree.getSubTreeById(props.node.id) : []));

const nodeType = computed(() => getRoleName(props.node?.role).toLowerCase());

const handleDelete = async () => {
  try {
    if (props.nodes && props.nodes.length > 0) {
      await store.bulkDelete(props.nodes);
    } else if (props.node) {
      await store.delete(props.node.id);
    }
    emit('close', 'success');
    if (props.redirectTo) {
      useRouter().push(props.redirectTo);
    }
  } catch (e) {
    useNotifications().add({ type: 'error', title: 'Error', message: String(e) });
  }
};
</script>

<style scoped lang="scss">
.description {
  opacity: 0.7;
}

.warn {
  color: var(--red-dark);
  opacity: 0.7;
}
</style>
