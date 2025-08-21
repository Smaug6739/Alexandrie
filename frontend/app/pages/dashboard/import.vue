<template>
  <div class="card-component">
    <header>
      <h1 style="font-size: 20px">Import documents <tag class="yellow">Beta</tag></h1>
    </header>
    <p>You can import documents from a previous export. If you don't have export, you can create a new one from the <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary)">settings</NuxtLink> page.</p>
    <AppDrop ref="dropComponent" @select="handleFileSelect" />
    <div class="submit">
      <AppButton type="primary" :disabled="!selectedFile" @click="submit">Analyse file</AppButton>
    </div>
    <div v-if="files_to_import.length">
      <h2>Files to import</h2>
      <div v-for="file in files_to_import" :key="file.id" class="card-component" style="padding: 15px">
        <div style="display: flex; align-items: center">
          <Icon name="file" />
          &nbsp;{{ file.name }}
          <div style="margin: 0 5px">
            <tag v-for="tag in file.tags?.split(',')" :key="tag" class="blue">{{ tag.trim() }}</tag>
          </div>
        </div>
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

const selectedFile: Ref<File | undefined> = ref();
const handleFileSelect = (file?: File) => (selectedFile.value = file);
const dropComponent = ref();

const files_to_import = ref<DB_Document[]>([]);
async function submit() {
  try {
    if (!selectedFile.value) return;
    const fileContent = await analyseFile(selectedFile.value);
    const valid = validateFileStructure(fileContent);
    if (!valid) useNotifications().add({ type: 'error', title: 'Invalid file structure' });
    else useNotifications().add({ type: 'success', title: 'File structure is valid' });
    files_to_import.value = compareDocumentsAndLocal(fileContent);
  } catch (e) {
    if (e instanceof Error) useNotifications().add({ type: 'error', title: 'Error while analysing file', message: e.message });
    else useNotifications().add({ type: 'error', title: 'Error while analysing file', message: 'Unknown error' });
  } finally {
    dropComponent.value.reset(); // Reset drop component
    selectedFile.value = undefined; // Reset selected file after processing
  }
}
function importDoc(file: DB_Document) {
  const fileContent = files_to_import.value.find(i => i.id === file.id);
  if (!fileContent) return useNotifications().add({ type: 'error', title: 'File not found' });
  prepareNewDocuments([fileContent]);
  uploadDocument(fileContent)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Document imported successfully' });
      files_to_import.value = files_to_import.value.filter(i => i.id !== file.id);
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error while importing document', message: e }));
}
function importAllDocs() {
  if (!files_to_import.value.length) return;
  const files = [...files_to_import.value];
  prepareNewDocuments(files);
  uploadDocuments(files)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Documents imported successfully' });
      files_to_import.value = [];
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error while importing documents', message: e }));
}
</script>

<style scoped lang="scss">
header {
  padding-bottom: 16px;

  a {
    color: var(--primary);
  }
}

.submit {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
