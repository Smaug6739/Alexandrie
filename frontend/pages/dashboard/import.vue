<template>
  <div style="padding: 24px; gap: 16px" class="card-component">
    <header>
      <h1 style="font-size: 20px">Import documents <tag class="yellow">Beta</tag></h1>

      <p>You can import documents from a previous export. If you don't have export, you can create a new one from the <NuxtLink to="/dashboard/settings?p=backup">settings</NuxtLink> page.</p>
    </header>
    <div class="dropzone" :class="{ 'drag-over': isDragOver }" @dragover.prevent @drop.prevent="handleFileDrop" @dragenter.prevent="dragEnter" @dragleave.prevent="dragLeave">
      <input type="file" ref="fileInput" @change="handleFileSelect" />
      <div v-if="selectedFile" class="file-info">
        <span>{{ selectedFile.name }}</span>
        <div class="file-size">{{ readableFileSize(selectedFile.size) }}</div>
      </div>
      <div v-else>Drop file here or <span class="clickable" @click="triggerFileSelect">click to select from computer</span>.</div>
    </div>
    <div class="submit">
      <AppButton @click="submit" type="primary" :disabled="!selectedFile">Analyse file</AppButton>
    </div>
    <div v-if="files_to_import.length">
      <h2>Files to import</h2>
      <div v-for="file in files_to_import" :key="file.id" class="card-component" style="padding: 15px">
        <p style="display: flex">
          <Icon name="file" />
          &nbsp;{{ file.name }}
          <tag v-if="file.tags" v-for="tag in file.tags?.split(',')" :key="tag" class="blue">{{ tag.trim() }}</tag>
        </p>
        <p>Created at: {{ new Date(file.created_timestamp).toLocaleDateString() }}</p>
        <p>Updated at: {{ new Date(file.updated_timestamp).toLocaleDateString() }}</p>
        <AppButton type="success" @click="importDoc(file)">Import single</AppButton>
      </div>
      <p style="display: flex; justify-content: flex-end">
        <AppButton type="primary" @click="importAllDocs()">Import all documents</AppButton>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { analyseFile, validateFileStructure, compareDocumentsAndLocal, prepareNewDocuments, uploadDocument, uploadDocuments } from '~/helpers/importations';
import type { DB_Document } from '~/stores';
definePageMeta({ breadcrumb: 'Importations' });

const selectedFile: Ref<File | null | undefined> = ref(null);
const isDragOver = ref(false);
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const triggerFileSelect = () => fileInput.value!.click();
const handleFileSelect = (event: Event) => (selectedFile.value = (event.target as HTMLInputElement | null)?.files?.[0] || null);

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectedFile.value = event.dataTransfer.files[0];
    isDragOver.value = false;
  }
};

const dragEnter = () => (isDragOver.value = true);
const dragLeave = () => (isDragOver.value = false);
const readableFileSize = (size: number): string => {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

const files_to_import = ref<DB_Document[]>([]);
async function submit() {
  try {
    if (!selectedFile.value) return;
    const file = selectedFile.value;
    const fileContent = await analyseFile(file);
    const valid = validateFileStructure(fileContent);
    if (!valid) useNotifications().add({ type: 'error', title: 'Invalid file structure', timeout: 3000 });
    else useNotifications().add({ type: 'success', title: 'File structure is valid', timeout: 3000 });
    files_to_import.value = compareDocumentsAndLocal(fileContent);
  } catch (e) {
    if (e instanceof Error) useNotifications().add({ type: 'error', title: 'Error while analysing file', message: e.message, timeout: 3000 });
    else useNotifications().add({ type: 'error', title: 'Error while analysing file', message: 'Unknown error', timeout: 3000 });
    selectedFile.value = null;
  }
}
function importDoc(file: DB_Document) {
  const fileContent = files_to_import.value.find(i => i.id === file.id);
  if (!fileContent) {
    useNotifications().add({ type: 'error', title: 'File not found', timeout: 3000 });
    return;
  }
  prepareNewDocuments([fileContent]);
  uploadDocument(fileContent)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Document imported successfully', timeout: 3000 });
      files_to_import.value = files_to_import.value.filter(i => i.id !== file.id);
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error while importing document', message: e, timeout: 3000 }));
}
function importAllDocs() {
  if (!files_to_import.value.length) return;
  const files = [...files_to_import.value];
  prepareNewDocuments(files);
  uploadDocuments(files)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Documents imported successfully', timeout: 3000 });
      files_to_import.value = [];
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error while importing documents', message: e, timeout: 3000 }));
}
</script>

<style scoped lang="scss">
header {
  padding-bottom: 16px;
  a {
    color: $primary-color;
  }
}
.card-component {
  display: block;
  margin: 2px 0;
  width: 100%;
}

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
.submit {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
