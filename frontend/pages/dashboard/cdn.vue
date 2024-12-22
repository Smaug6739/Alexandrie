<template>
  <div class="card-component">
    <h2 style="margin: 0">CDN: File manager</h2>
    <div class="dropzone" :class="{ 'drag-over': isDragOver }" @dragover.prevent @drop.prevent="handleFileDrop" @dragenter.prevent="dragEnter" @dragleave.prevent="dragLeave">
      <input type="file" ref="fileInput" @change="handleFileSelect" />
      <div v-if="selectedFile" class="file-info">
        <span>{{ selectedFile.name }}</span>
        <div class="file-size">{{ readableFileSize(selectedFile.size) }}</div>
      </div>
      <div v-else>Drop file here or <span class="clickable" @click="triggerFileSelect">click to select from computed</span>.</div>
    </div>
    <AppButton @click="submitFile" type="primary" :disabled="!selectedFile">Upload on server</AppButton>
    <div v-if="isLoading" class="loading-spinner"></div>
    <div v-if="fileLink" class="link-section">
      <input type="text" v-model="fileLink" readonly />
      <AppButton @click="copyLink" type="primary">Copy link</AppButton>
    </div>
    <div v-if="ressourcesStore.ressources.length" class="ressources-list">
      <DataTable :headers="headers" :rows="rows">
        <template #action="{ cell }">
          <a :href="`${CDN}${cell?.data.transformed_path || cell?.data.original_path}`" target="_blank"><Icon name="view" /> </a>
          <Icon name="delete" @click="() => deleteRessource(cell?.data.id)" />
        </template>
      </DataTable>
    </div>
    <div v-else>No ressource found.</div>
  </div>
</template>
<script setup lang="ts">
import type { DB_Ressource } from '~/stores';

const ressourcesStore = useRessourcesStore();
ressourcesStore.fetch();

const selectedFile: Ref<File | null | undefined> = ref(null);
const isDragOver = ref(false);
const fileLink = ref('');
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const isLoading = ref(false);
const triggerFileSelect = () => fileInput.value!.click();
const handleFileSelect = (event: Event) => (selectedFile.value = (event.target as HTMLInputElement | null)?.files?.[0] || null);
definePageMeta({ breadcrumb: 'CDN' });

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectedFile.value = event.dataTransfer.files[0];
    isDragOver.value = false;
  }
};

const copyLink = () => navigator.clipboard.writeText(fileLink.value!);
const dragEnter = () => (isDragOver.value = true);
const dragLeave = () => (isDragOver.value = false);

const submitFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;

  const body = new FormData();
  body.append('file', selectedFile.value);
  selectedFile.value = null; // Reset selected file

  await ressourcesStore
    .post(body)
    .then(r => (fileLink.value = `${CDN}/${(r as DB_Ressource).transformed_path || (r as DB_Ressource).original_path}`))
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e, timeout: 3000 }))
    .finally(() => (isLoading.value = false));
};

const readableFileSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Size', key: 'size' },
  { label: 'Type', key: 'type' },
  { label: 'Date', key: 'date' },
  { label: 'Action', key: 'action' },
];
const color = (type: string) => (type.includes('image') ? 'green' : type.includes('video') ? 'blue' : type.includes('pdf') ? 'yellow' : 'red');
const rows: any = computed(() =>
  ressourcesStore.ressources.map(res => {
    return {
      name: { content: res.filename },
      size: { content: readableFileSize(res.file_size) },
      type: { content: `<span class="tag ${color(res.file_type)}">${res.file_type}</span>`, type: 'html' },
      date: { content: new Date(res.created_timestamp).toLocaleDateString() },
      action: { type: 'slot', data: res },
    };
  }),
);

const deleteRessource = async (id: string) => {
  if (!id) return;
  await ressourcesStore
    .delete(id)
    .then(() => useNotifications().add({ type: 'success', title: 'Success', message: 'Ressource deleted successfully', timeout: 3000 }))
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e, timeout: 3000 }));
};
</script>

<style scoped lang="scss">
.dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed #9e9e9e;
  border-radius: 4px;
  font-size: 14px;
  color: #9e9e9e;
  position: relative;
  transition: background-color $transition-duration;
  background-color: var(--dropzone-bg, transparent);

  &:hover {
    background-color: var(--bg-contrast);
  }

  input[type='file'] {
    display: none;
  }
}

.drag-over {
  background-color: #e3f2fd;
  border-color: #2196f3;
  transition: background-color $transition-duration, border-color $transition-duration;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #2196f3;
  color: #2196f3;

  .file-size {
    font-size: 0.8rem;
    color: #757575;
    margin-top: 5px;
  }
}

.link-section {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid $primary-color;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.clickable {
  color: #2196f3;
  cursor: pointer;
  text-decoration: underline;
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
  color: #2196f3;
}
</style>
