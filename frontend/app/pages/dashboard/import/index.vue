<template>
  <div class="import-page card-component">
    <!-- Step 1: File Selection -->
    <div v-if="step === 'select'">
      <header>
        <h1 style="font-size: 20px">Import documents <tag class="yellow">Beta</tag></h1>
      </header>
      <p>
        You can import documents from a previous export. If you don't have an export, you can create one from the
        <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary)">settings</NuxtLink> page.
      </p>
      <AppDrop ref="dropComponent" @select="handleFileSelect as (file: File) => void" />
      <div class="submit">
        <AppButton type="primary" :disabled="!selectedFile || isAnalyzing" @click="analyzeFile">
          {{ isAnalyzing ? 'Analyzing...' : 'Start Import' }}
        </AppButton>
      </div>
      <p v-if="analyzeError" class="error-text">{{ analyzeError }}</p>
    </div>

    <!-- Step 2: Preview & Import -->
    <template v-if="step === 'preview' && manifest">
      <!-- Backup Info Card -->
      <ImportHeader :manifest="manifest" :reset-import="resetImport" />

      <!-- Import Summary -->
      <SummaryCard :to-create="toCreate.length" :to-update="toUpdate.length" :unchanged-count="unchangedCount" />

      <!-- Tabs for New / Updates -->
      <ImportTabs
        :manifest="manifest"
        :to-create="toCreate"
        :to-update="toUpdate"
        :is-importing="isImporting"
        @import-single="importSingle"
        @import-selected="importSelected"
        @import-local-settings="importLocalSettings"
      />

      <!-- Import All Actions -->
      <ImportActions
        v-model:preserve-timestamps="importOptions.preserveTimestamps"
        v-model:skip-existing="importOptions.skipExisting"
        :to-create="toCreate"
        :to-update="toUpdate"
        :is-importing="isImporting"
        :import-progress="importProgress"
        :import-total="importTotal"
        :reset-import="resetImport"
        :import-all="importAll"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import ImportHeader from './_components/ImportHeader.vue';
import SummaryCard from './_components/ImportSummary.vue';
import ImportTabs from './_components/ImportTabs.vue';
import ImportActions from './_components/ImportActions.vue';
import { handleBackupFile } from '~/helpers/backups';
import type { Manifest } from '~/helpers/backups/types';
import type { DB_Node, Node } from '~/stores/db_strustures';

definePageMeta({ breadcrumb: 'Importations' });

const nodesStore = useNodesStore();
const notifications = useNotifications();

// State
const step = ref<'select' | 'preview'>('select');
const selectedFile = ref<File>();
const isAnalyzing = ref(false);
const analyzeError = ref('');

// Backup data
const manifest = ref<Manifest | null>(null);
const backupDocuments = ref<DB_Node[]>([]);
const toCreate = ref<DB_Node[]>([]);
const toUpdate = ref<DB_Node[]>([]);
const localData = ref<object | null>(null);

// Import state
const isImporting = ref(false);
const importProgress = ref(0);
const importTotal = ref(0);

// Options
const importOptions = reactive({
  preserveTimestamps: false,
  skipExisting: false,
});

// Computed
const unchangedCount = computed(() => {
  if (!backupDocuments.value.length) return 0;
  return backupDocuments.value.length - toCreate.value.length - toUpdate.value.length;
});

// Methods
const handleFileSelect = (file?: File) => {
  selectedFile.value = file;
  analyzeError.value = '';
};

async function analyzeFile() {
  if (!selectedFile.value) return;

  isAnalyzing.value = true;
  analyzeError.value = '';

  try {
    const result = await handleBackupFile(selectedFile.value);
    manifest.value = result.manifest;
    localData.value = result.localData;

    if (result.documents?.length) {
      backupDocuments.value = result.documents;
      const { toCreate: create, toUpdate: update } = nodesStore.prepareImport(result.documents);
      toCreate.value = create;
      toUpdate.value = update;
    } else {
      backupDocuments.value = [];
      toCreate.value = [];
      toUpdate.value = [];
    }

    step.value = 'preview';
  } catch (e) {
    analyzeError.value = e instanceof Error ? e.message : 'Failed to analyze backup file';
  } finally {
    isAnalyzing.value = false;
  }
}

function resetImport() {
  step.value = 'select';
  selectedFile.value = undefined;
  manifest.value = null;
  backupDocuments.value = [];
  toCreate.value = [];
  toUpdate.value = [];
}

function getExistingNode(id: string): Node | undefined {
  return nodesStore.nodes.get(id);
}

async function importSingle(doc: DB_Node, type: 'create' | 'update') {
  isImporting.value = true;

  try {
    if (type === 'create') {
      await nodesStore.post(prepareNodeForImport(doc));
      toCreate.value = toCreate.value.filter(d => d.id !== doc.id);
      notifications.add({ type: 'success', title: 'Imported', message: `"${doc.name}" has been imported` });
    } else {
      const nodeToUpdate = prepareNodeForUpdate(doc);
      await nodesStore.update(nodeToUpdate as Node);
      toUpdate.value = toUpdate.value.filter(d => d.id !== doc.id);
      notifications.add({ type: 'success', title: 'Updated', message: `"${doc.name}" has been updated` });
    }
  } catch {
    notifications.add({ type: 'error', title: 'Error', message: `Failed to ${type} "${doc.name}"` });
  } finally {
    isImporting.value = false;
  }
}

async function importSelected(type: 'create' | 'update', ids: string[]) {
  const docs = type === 'create' ? toCreate.value.filter(d => ids.includes(d.id)) : toUpdate.value.filter(d => ids.includes(d.id));

  isImporting.value = true;
  importProgress.value = 0;
  importTotal.value = docs.length;

  for (const doc of docs) {
    try {
      if (type === 'create') {
        await nodesStore.post(prepareNodeForImport(doc));
        toCreate.value = toCreate.value.filter(d => d.id !== doc.id);
      } else {
        const nodeToUpdate = prepareNodeForUpdate(doc);
        await nodesStore.update(nodeToUpdate as Node);
        toUpdate.value = toUpdate.value.filter(d => d.id !== doc.id);
      }
      importProgress.value++;
    } catch (e) {
      console.error(`Failed to ${type} ${doc.name}:`, e);
    }
  }

  notifications.add({
    type: 'success',
    title: 'Import complete',
    message: `${importProgress.value} documents ${type === 'create' ? 'imported' : 'updated'}`,
  });

  isImporting.value = false;
}

function importLocalSettings() {
  if (!manifest.value) return;

  const preferences = usePreferences();
  if (localData.value) {
    preferences.importPreferences(localData.value);
    notifications.add({ type: 'success', title: 'Settings Imported', message: 'Local settings have been imported successfully.' });
  } else {
    notifications.add({ type: 'error', title: 'Import Failed', message: 'No local settings found in the backup.' });
  }
}

async function importAll() {
  const createDocs = importOptions.skipExisting ? toCreate.value : toCreate.value;
  const updateDocs = importOptions.skipExisting ? [] : toUpdate.value;
  const allDocs = [...createDocs, ...updateDocs];

  isImporting.value = true;
  importProgress.value = 0;
  importTotal.value = allDocs.length;

  let successCount = 0;

  // Import new documents
  for (const doc of createDocs) {
    try {
      await nodesStore.post(prepareNodeForImport(doc));
      toCreate.value = toCreate.value.filter(d => d.id !== doc.id);
      successCount++;
      importProgress.value++;
    } catch (e) {
      console.error(`Failed to create ${doc.name}:`, e);
    }
  }

  // Update existing documents
  if (!importOptions.skipExisting) {
    for (const doc of updateDocs) {
      try {
        const nodeToUpdate = prepareNodeForUpdate(doc);
        await nodesStore.update(nodeToUpdate as Node);
        toUpdate.value = toUpdate.value.filter(d => d.id !== doc.id);
        successCount++;
        importProgress.value++;
      } catch (e) {
        console.error(`Failed to update ${doc.name}:`, e);
      }
    }
  }

  notifications.add({
    type: 'success',
    title: 'Import complete',
    message: `${successCount} documents imported successfully`,
  });

  // Reset selection
  isImporting.value = false;
}

function prepareNodeForImport(doc: DB_Node): Partial<Node> {
  const prepared: Partial<Node> = {
    name: doc.name,
    description: doc.description,
    role: doc.role,
    parent_id: doc.parent_id,
    tags: doc.tags,
    color: doc.color,
    icon: doc.icon,
    accessibility: doc.accessibility,
    access: doc.access,
    content: doc.content,
    content_compiled: doc.content_compiled,
  };

  return prepared;
}

function prepareNodeForUpdate(doc: DB_Node): Partial<Node> {
  const existing = getExistingNode(doc.id);
  if (!existing) throw new Error('Node not found');

  const updated: Node = {
    ...existing,
    name: doc.name,
    description: doc.description,
    tags: doc.tags,
    color: doc.color,
    icon: doc.icon,
    accessibility: doc.accessibility,
    access: doc.access,
    content: doc.content,
    content_compiled: doc.content_compiled,
  };

  if (importOptions.preserveTimestamps) {
    updated.updated_timestamp = doc.updated_timestamp;
  }

  return updated;
}
</script>

<style scoped lang="scss">
.import-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0 auto;
}

.submit {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.error-text {
  color: var(--red);
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
