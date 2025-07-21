<template>
  <div class="card-component">
    <header>
      <h1>File manager</h1>
      <ViewSelection v-model="view" />
    </header>
    <AppDrop ref="dropComponent" @select="selectFile" />
    <div style="padding: 12px 0; width: 100%; display: flex; align-items: center; gap: 10px; flex-direction: column">
      <AppButton @click="submitFile" type="primary" :disabled="!selectedFile">Upload on server</AppButton>
      <div v-if="isLoading" class="loading-spinner"></div>
    </div>
    <div v-if="fileLink" class="link-section">
      <input type="text" v-model="fileLink" readonly />
      <AppButton @click="copyLink" type="primary">Copy link</AppButton>
    </div>
    <div v-if="ressourcesStore.ressources.length" class="ressources-list">
      <DataTable :headers="headers" :rows="rows">
        <template #action="{ cell }">
          <a :href="`${CDN}/${cell?.data.author_id}/${cell?.data.transformed_path || cell?.data.original_path}`" target="_blank" style="margin-right: 10px"><Icon name="view" /> </a>
          <NuxtLink :to="`/dashboard/cdn/${cell?.data.id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
          <Icon name="delete" @click="() => deleteRessource(cell?.data.id)" />
        </template>
      </DataTable>
    </div>
    <div v-else>No ressource found.</div>
  </div>
</template>
<script setup lang="ts">
import DeleteRessourceModal from './_modals/DeleteRessourceModal.vue';
import type { DB_Ressource } from '~/stores';
definePageMeta({ breadcrumb: 'Upload' });
const ressourcesStore = useRessourcesStore();
const view = ref<'table' | 'list'>('list');
const selectedFile: Ref<File | undefined> = ref();
const fileLink = ref('');
const isLoading = ref(false);
const selectFile = (file?: File) => (selectedFile.value = file);
const copyLink = () => navigator.clipboard.writeText(fileLink.value!);
const dropComponent = ref();
const submitFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;

  const body = new FormData();
  body.append('file', selectedFile.value);
  selectedFile.value = undefined; // Reset selected file
  dropComponent.value.reset(); // Reset drop component
  await ressourcesStore
    .post(body)
    .then(r => (fileLink.value = `${CDN}/${(r as DB_Ressource).author_id}/${(r as DB_Ressource).transformed_path}`))
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }))
    .finally(() => (isLoading.value = false));
};

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Size', key: 'size' },
  { label: 'Type', key: 'type' },
  { label: 'Parent doc', key: 'parent' },
  { label: 'Date', key: 'date' },
  { label: 'Action', key: 'action' },
];
const color = (type: string) => (type.includes('image') ? 'green' : type.includes('video') ? 'blue' : type.includes('pdf') ? 'yellow' : 'red');
const rows: any = computed(() =>
  ressourcesStore.ressources.map(res => {
    const parent = res.parent_id ? useDocumentsStore().getById(res.parent_id) : null;
    const category = parent ? useCategoriesStore().getById(parent.category || '') : null;
    return {
      name: { content: res.filename },
      size: { content: readableFileSize(res.filesize) },
      type: { content: `<tag class="${color(res.filetype)}">${res.filetype}</tag>`, type: 'html' },
      parent: { content: category ? `<tag class="${getAppColor(category.color)}">${parent?.name}</tag>` : '', type: 'html' },
      date: { content: new Date(res.created_timestamp).toLocaleDateString() },
      action: { type: 'slot', data: res },
    };
  }),
);

const deleteRessource = async (id: string) => {
  useModal().add(new Modal(shallowRef(DeleteRessourceModal), { ressourceId: id }));
};
</script>

<style scoped lang="scss">
.link-section {
  margin: 6px 0;
  display: flex;
  gap: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.ressources-list {
  width: 100%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.file-info {
  color: var(--primary);
}
</style>
