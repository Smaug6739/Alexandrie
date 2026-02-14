<template>
  <div class="page-card">
    <header>
      <h1>Update resource</h1>
      <NuxtLink :to="`/dashboard/cdn/${resource?.id}/preview`" class="btn-icon">
        <AppButton type="secondary">Preview</AppButton>
      </NuxtLink>
    </header>
    <p>Manage resources and files on the server. You can edit metadata and delete file from the server.</p>
    <form v-if="resource" @submit.prevent>
      <div class="form-row">
        <div class="form-column">
          <label>ID</label>
          <input id="id" type="text" :value="resource.id" disabled />
        </div>
        <div class="form-column">
          <label>Size</label>
          <input id="size" type="text" :value="readableFileSize(resource.size ?? 0)" disabled />
        </div>
      </div>
      <label>Name</label>
      <input id="name" v-model="resource.name" type="text" required />
      <label style="display: flex; align-items: center">Parent <AppHint text="To organize your uploads" /></label>
      <AppSelect v-model="resource.parent_id" :items="tree" :disabled="i => (i as TreeItem<Node>).data?.role !== 3" placeholder="Select a resource parent" />
      <label>Type</label>
      <input id="id" type="text" :value="resource.metadata?.filetype" disabled />
      <label>Original path</label>
      <input id="content" type="text" :value="resource.content" disabled />
      <label>Path</label>
      <input id="path" type="text" :value="resource.metadata?.transformed_path" disabled />
      <p style="overflow-wrap: break-word">
        Resource:
        <a :href="resourceURL(resource)" target="_blank">{{ resourceURL(resource) }}</a>
      </p>
      <div class="actions-row">
        <AppButton type="primary" class="btn primary" @click="updateCategory">Update</AppButton>
        <AppButton type="danger" @click="showDeleteModal">Delete</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import { readableFileSize } from '~/helpers/resources';
import type { TreeItem } from '~/helpers/TreeBuilder';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Edit' });

const nodeStore = useNodesStore();
const route = useRoute();
const { resourceURL } = useApi();

const resource = computed(() => nodeStore.getById(route.params.id as string));

const defaultItem: ANode = {
  id: '',
  label: 'None',
  parentId: '',
  children: [],
};
const nodesTree = useNodesTree();
const tree = computed(() => [defaultItem, ...nodesTree.tree.value]);

const updateCategory = async () => {
  if (resource.value)
    nodeStore
      .update(resource.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: 'Resource updated' });
        useRouter().push('/dashboard/cdn');
      })
      .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
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
