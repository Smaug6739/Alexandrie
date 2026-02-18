<template>
  <div class="page-card">
    <header>
      <h1>{{ t('cdn.edit.title') }}</h1>
      <NuxtLink :to="`/dashboard/cdn/${resource?.id}/preview`" class="btn-icon">
        <AppButton type="secondary">Preview</AppButton>
      </NuxtLink>
    </header>
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
      <div class="actions-row">
        <AppButton type="primary" class="btn primary" @click="updateCategory">{{ t('common.actions.update') }}</AppButton>
        <AppButton type="danger" @click="showDeleteModal">{{ t('common.actions.delete') }}</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import { readableFileSize } from '~/helpers/resources';

definePageMeta({ breadcrumb: {i18n: 'common.actions.edit'} });

const nodeStore = useNodesStore();
const { t } = useI18nT();
const route = useRoute();
const { resourceURL } = useApi();

const resource = computed(() => nodeStore.getById(route.params.id as string));

const nodesTree = useNodesTree().treeUpToRole(3);

const updateCategory = async () => {
  if (resource.value)
    nodeStore
      .update(resource.value)
      .then(() => {
        useNotifications().add({ title: 'Resource updated', type: 'success' });
        useRouter().push('/dashboard/cdn');
      })
      .catch(e => useNotifications().add({ message: e, title: 'Error', type: 'error' }));
};
const showDeleteModal = () => {
  useModal().add(new Modal(shallowRef(DeleteNodeModal), { props: { nodes: [resource.value], redirectTo: '/dashboard/cdn' }, size: 'small' }));
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 26px;
}

label {
  margin-top: 10px;
}

input,
textarea,
select {
  width: 100%;
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

.actions-row {
  justify-content: flex-end;
}
</style>
