<template>
  <div class="page-card">
    <Teleport to="#navbar-title">{{ t('cdn.edit.title') }}</Teleport>
    <Teleport to="#navbar-actions">
      <AppBtnIcon nav icon="eye" :tooltip="t('common.actions.preview')" :to="`/dashboard/cdn/${resource?.id}/preview`" />
      <AppBtnIcon nav icon="save" :tooltip="t('common.actions.update')" @click="updateCategory" />
      <AppBtnIcon nav icon="delete" :tooltip="t('common.actions.delete')" @click="openDeleteModal" />
    </Teleport>
    <p>{{ t('cdn.edit.description') }}</p>
    <form v-if="resource" @submit.prevent>
      <div class="form-row">
        <div class="form-column">
          <label>{{ t('common.labels.id') }}</label>
          <input id="id" type="text" :value="resource.id" disabled />
        </div>
        <div class="form-column">
          <label>{{ t('common.labels.size') }}</label>
          <input id="size" type="text" :value="readableFileSize(resource.size ?? 0)" disabled />
        </div>
      </div>
      <label>{{ t('common.labels.name') }}</label>
      <input id="name" v-model="resource.name" type="text" required />
      <label style="display: flex; align-items: center">{{ t('common.labels.parent') }} <AppHint text="To organize your uploads" /></label>
      <AppSelect v-model="resource.parent_id" nullable :items="nodesTree" placeholder="Select a resource parent" />
      <label>{{ t('common.labels.type') }}</label>
      <input id="id" type="text" :value="resource.metadata?.filetype" disabled />
      <label>{{ t('cdn.labels.originalPath') }}</label>
      <input id="content" type="text" :value="resource.content" disabled />
      <label>{{ t('cdn.labels.path') }}</label>
      <input id="path" type="text" :value="resource.metadata?.transformed_path" disabled />
      <p style="overflow-wrap: break-word">
        Resource:
        <a :href="resourceURL(resource)" target="_blank">{{ resourceURL(resource) }}</a>
      </p>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import { readableFileSize } from '~/helpers/resources';

definePageMeta({ breadcrumb: { i18n: 'common.actions.edit' } });

const nodeStore = useNodesStore();

const { t } = useI18nT();
const { resourceURL } = useApi();
const modals = useModal();
const notifications = useNotifications();
const route = useRoute();
const router = useRouter();

const nodesTree = useNodesTree().getTreeUpToRole(3);
const resource = computed(() => nodeStore.getById(route.params.id as string));

// Actions
const updateCategory = async () => {
  if (!resource.value) return;
  nodeStore
    .update(resource.value)
    .then(() => {
      notifications.add({ title: 'Resource updated', type: 'success' });
      router.push('/dashboard/cdn');
    })
    .catch(e => notifications.add({ message: e, title: 'Error', type: 'error' }));
};

const openDeleteModal = () => {
  if (!resource.value) return;
  modals.add(new Modal(shallowRef(DeleteNodeModal), { props: { nodes: [resource.value], redirectTo: '/dashboard/cdn' }, size: 'small' }));
};

// Shortcuts
function handleKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault();
    updateCategory();
  } else if (event.key === 'Delete') {
    event.preventDefault();
    openDeleteModal();
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
label {
  margin-top: 10px;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.form-column {
  min-width: 200px;
  flex: 1;
}

a {
  color: var(--primary);
  text-decoration: underline;
}
</style>
