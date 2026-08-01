<template>
  <form class="modal" @submit.prevent>
    <h2>{{ role == 0 ? 'Create team' : role == 1 ? t('nodes.workspace.new') : t('nodes.category.new') }}</h2>
    <label for="name">{{ t('common.labels.name') }}</label>
    <input id="name" v-model="category.name" type="text" required :placeholder="t('common.labels.name')" />
    <template v-if="role !== 0">
      <label>{{ t('common.labels.parent') }}</label>
      <div>
        <AppSelect v-model="category.parent_id" :items="categoriesItem" nullable :placeholder="t('common.labels.parent')" />
      </div>
    </template>

    <section>
      <span class="sec-title">{{ t('nodes.modals.metadata.labelAppearance') }}</span>
      <div class="setting-row">
        <label for="order">{{ t('common.labels.order') }} <AppHint :text="t('nodes.category.orderHint')" /></label>
        <input id="order" v-model.number="category.order" type="number" placeholder="0" />
      </div>
      <div class="setting-row">
        <label for="accessibility">{{ t('common.labels.color') }}</label>
        <AppColorPicker v-model="category.color" nullable />
      </div>
    </section>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="primary" @click="createCategory">{{ t('common.actions.create') }}</AppButton>
    </div>
  </form>
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
