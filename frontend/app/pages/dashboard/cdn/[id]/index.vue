<template>
  <div class="card-component">
    <header>
      <h3>Update ressource&nbsp;<tag blue>New</tag></h3>
    </header>
    <p>Manage ressources and files on the server. You can edit metadata and delete file from the server.</p>
    <form v-if="ressource" @submit.prevent>
      <div class="form-row">
        <div class="form-column">
          <label>ID</label>
          <input id="id" type="text" :value="ressource.id" disabled />
        </div>
        <div class="form-column">
          <label>Size</label>
          <input id="size" type="text" :value="readableFileSize(ressource.size ?? 0)" disabled />
        </div>
      </div>
      <label>Name</label>
      <input id="name" v-model="ressource.name" type="text" required />
      <label style="display: flex; align-items: center">Parent <AppHint text="To organize your uploads" /></label>
      <AppSelect v-model="ressource.parent_id" :items="tree" :disabled="(i) => (i as Item).data?.role !== 3" placeholder="Select a ressource parent" />
      <label>Type</label>
      <input id="id" type="text" :value="ressource.metadata?.filetype" disabled />
      <label>Original path</label>
      <input id="content" type="text" :value="ressource.content" disabled />
      <label>Path</label>
      <input id="path" type="text" :value="ressource.metadata?.transformed_path" disabled />
      <p style="overflow-wrap: break-word">
        Ressource:
        <a :href="`${CDN}/${ressource.user_id}/${ressource.metadata?.transformed_path || ressource.content}`" target="_blank">{{
          `${CDN}/${ressource.user_id}/${ressource.metadata?.transformed_path || ressource.content}`
        }}</a>
      </p>
      <div style="display: flex; justify-content: flex-end">
        <AppButton type="primary" class="btn primary" @click="updateCategory">Update</AppButton>
        <AppButton type="danger" @click="showDeleteModal">Delete</AppButton>
      </div>
      <h4>Preview</h4>
      <div class="preview">
        <img
          v-if="(ressource.metadata?.filetype as string)?.startsWith('image/')"
          :src="`${CDN}/${ressource.user_id}/${ressource.metadata?.transformed_path || ressource.content}`"
          alt="Preview"
        />
        <p v-else>Preview not available for this file type.</p>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import DeleteRessourceModal from '../_modals/DeleteRessourceModal.vue';
import { readableFileSize } from '~/helpers/ressources';
definePageMeta({ breadcrumb: 'Edit' });
const nodeStore = useNodesStore();
const route = useRoute();
const ressource = computed(() => nodeStore.getById(route.params.id as string));
const { CDN } = useApi();

const defaultItem: ANode = {
  id: '',
  label: 'None',
  parent_id: '',
  childrens: [],
};
const tree = computed(() => [defaultItem, ...useSidebarTree().tree.value]);

const updateCategory = async () => {
  if (ressource.value)
    nodeStore
      .update(ressource.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: 'Ressource updated' });
        useRouter().push('/dashboard/cdn');
      })
      .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
const showDeleteModal = () => {
  useModal().add(new Modal(shallowRef(DeleteRessourceModal), { props: { ressources: [ressource.value?.id] } }));
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

.preview {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>
