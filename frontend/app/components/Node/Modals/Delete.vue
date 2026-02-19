<template>
  <div class="modal">
    <!-- Single node deletion -->
    <template v-if="props.node">
      <h3>{{ t('nodes.modals.delete.title', { type: nodeType }) }} • {{ props.node.name }}</h3>
      <p>{{ t('nodes.modals.delete.confirm', { type: nodeType }) }}</p>
      <p v-if="allChildren.length > 0" class="warn">{{ t('nodes.modals.delete.hasChildren', { type: nodeType, count: allChildren.length }) }}</p>
    </template>

    <!-- Bulk deletion -->
    <template v-else-if="props.nodes">
      <h3>{{ t('nodes.modals.delete.titleBulk') }}</h3>
      <p>
        {{ t('nodes.modals.delete.confirmBulk') }}
        <br />
        <span v-if="props.nodes.length > 1">
          {{ t('nodes.modals.delete.bulkCount', { count: props.nodes.length }) }}
        </span>
      </p>
    </template>

    <p class="description">{{ t('nodes.modals.delete.irreversible') }}</p>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="danger" @click="handleDelete">{{ t('common.actions.confirm') }}</AppButton>
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
const { t } = useI18nT();

const store = useNodesStore();
const nodesTree = useNodesTree();

const allChildren = computed(() => (props.node ? nodesTree.getSubtreeAsArray(props.node.id) : []));

const nodeType = computed(() => getRoleName(props.node?.role).toLowerCase());

const handleDelete = async () => {
  try {
    if (props.nodes && props.nodes.length > 0) {
      await store.bulkDelete(props.nodes);
    } else if (props.node) {
      await store.delete(props.node.id);
    }
    emit('close');
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
