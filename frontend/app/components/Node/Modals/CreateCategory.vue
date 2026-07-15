<template>
  <div class="modal">
    <h2>{{ role == 0 ? 'Create team' : role == 1 ? t('nodes.workspace.new') : t('nodes.category.new') }}</h2>
    <label for="name">{{ t('common.labels.name') }}</label>
    <input id="name" v-model="category.name" class="entry" type="text" required :placeholder="t('common.labels.name')" />
    <template v-if="role !== 0">
      <label>{{ t('common.labels.parent') }}</label>
      <div>
        <AppSelect v-model="category.parent_id" class="entry" :items="categoriesItem" nullable :placeholder="t('common.labels.parent')" />
      </div>
    </template>
    <div style="display: flex; flex-wrap: wrap">
      <div class="col" style="margin-right: 10px">
        <label for="order">{{ t('common.labels.order') }} <AppHint :text="t('nodes.category.orderHint')" /></label>
        <input id="order" v-model.number="category.order" class="entry" type="number" placeholder="0" />
      </div>
      <div class="col" style="margin-left: 10px">
        <label for="color">{{ t('common.labels.color') }}</label>
        <AppColorPicker id="color" v-model="category.color" class="entry" nullable />
      </div>
    </div>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="primary" @click="createCategory">{{ t('common.actions.create') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps<{ role: 0 | 1 | 2; parentId?: string }>();
const emit = defineEmits(['close']);

const categoriesStore = useNodesStore();

const nodesTree = useNodesTree();
const sidebar = useSidebar();
const { t } = useI18nT();

const categoriesItem = nodesTree.getTreeUpToRole(2);

function getDefaultParentId() {
  const activeId = sidebar.active_id.value;
  if (activeId) {
    const activeNode = nodesTree.getClosestCategoryAncestor(activeId);
    if (activeNode) return activeNode.id;
  }
  const workspaceId = sidebar.workspaceId.value;
  if (workspaceId == 'shared') return undefined;
  return workspaceId;
}

const category = ref<Partial<Node>>({
  accessibility: 1,
  name: '',
  parent_id: props.role === 0 ? undefined : (props.parentId ?? getDefaultParentId()),
  role: props.role,
});

const createCategory = () => {
  categoriesStore
    .post(category.value)
    .then(() => {
      useNotifications().add({ title: t('nodes.category.notifications.created'), type: 'success' });
      emit('close');
    })
    .catch(e => useNotifications().add({ message: e, title: t('nodes.category.notifications.creationError'), type: 'error' }));
};
</script>

<style scoped lang="scss">
label {
  margin: 5px 0;
}

.entry {
  background: var(--surface-base);
}

.col {
  flex: 1;
  min-width: 200px;
}
</style>
