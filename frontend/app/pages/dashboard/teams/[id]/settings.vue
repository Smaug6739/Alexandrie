<template>
  <div class="page-card">
    <Teleport to="#navbar-title">{{ t('components.sidebar.nav.settings') }}</Teleport>
    <Teleport to="#navbar-bottom"><NodeTeamNavbar :team-id="nodeId" /></Teleport>
    <form v-if="node" @submit.prevent>
      <Teleport to="#navbar-actions">
        <AppBtnIcon nav icon="save" :tooltip="t('common.actions.update')" @click="updateCategory" />
      </Teleport>
      <div class="form-row">
        <label>{{ t('common.labels.name') }}</label>
        <input id="name" v-model="node.name" type="text" required />
      </div>

      <div class="form-row">
        <label>{{ t('common.labels.description') }}</label>
        <input id="description" v-model="node.description" type="text" />
      </div>

      <div class="form-row">
        <label>{{ t('common.labels.tags') }}</label>
        <AppTagInput id="tags" v-model="node.tags" type="text" style="width: 100%" />
      </div>

      <div class="form-row">
        <div class="form-column">
          <label>{{ t('common.labels.parent') }}</label>
          <AppSelect
            v-model="node.parent_id"
            :items="categoriesItem"
            :placeholder="t('common.placeholder.parent')"
            nullable
            :disabled="i => i.id == node!.id || nodesStore.isDescendant(node!, i.id as string)"
          />
        </div>
        <div class="form-column">
          <label for="order">{{ t('common.labels.order') }}</label>
          <input id="order" v-model.number="node.order" type="number" />
        </div>
      </div>
      <label style="display: flex; align-items: center">{{ t('common.labels.icon') }} <AppHint :text="t('nodes.category.iconHint')" /></label>
      <textarea v-model="node.icon" type="text" rows="5" />

      <label for="color">{{ t('common.labels.color') }}</label>
      <AppColorPicker v-model="node.color" name="color" nullable />
    </form>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ breadcrumb: { i18n: 'common.actions.edit' } });

const nodesStore = useNodesStore();

const { t } = useI18nT();
const nodesTree = useNodesTree();
const notifications = useNotifications();
const route = useRoute();
const router = useRouter();

const nodeId = route.params.id as string;
const node = computed(() => nodesStore.getById(nodeId));
const categoriesItem = nodesTree.getTreeUpToRole(2);

// Actions
const updateCategory = async () => {
  if (node.value)
    nodesStore
      .update(node.value)
      .then(() => {
        notifications.add({ title: t('nodes.category.notifications.updated'), type: 'success' });
        router.push(`/dashboard/teams/${nodeId}`);
      })
      .catch(e => notifications.add({ message: e, title: t('common.status.error'), type: 'error' }));
};
</script>

<style scoped lang="scss">
label {
  margin-top: 10px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0 20px;
}

.form-column {
  min-width: 200px;
  flex: 1;
}
</style>
