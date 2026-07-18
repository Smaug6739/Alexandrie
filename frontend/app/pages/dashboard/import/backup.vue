<template>
  <div class="import-page page-card">
    <!-- Step 1: File Selection -->
    <div v-if="step === 'select'">
      <Teleport to="#navbar-title">{{ t('import.meta.title') }}</Teleport>
      <p>
        {{ t('import.meta.description') }}
        <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary)">{{ t('import.meta.settingsLink') }}</NuxtLink
        >.
      </p>
      <AppDrop ref="dropComponent" @select="handleFileSelect" />
      <div class="submit">
        <AppButton type="primary" :disabled="!selectedFile || isAnalyzing" @click="analyzeFile">
          {{ isAnalyzing ? t('import.steps.select.analyzing') : t('import.steps.select.startImport') }}
        </AppButton>
      </div>
      <p v-if="analyzeError" class="error-text">{{ analyzeError }}</p>
    </div>

    <!-- Step 2: Preview & Import -->
    <template v-if="step === 'preview' && manifest">
      <!-- Backup Info Card -->
      <ImportHeader :manifest="manifest" :reset-import="resetImport" />

      <!-- Import Summary -->
      <SummaryCard :unchanged-count="unchangedCount" :import-job="importJob" />

      <!-- Tabs for New / Updates -->
      <ImportTabs :manifest="manifest" :import-job="importJob" @import="importNodes" @import-local-settings="importLocalSettings" />

      <!-- Import All Actions -->
      <ImportActions
        v-model:preserve-timestamps="importJob.options.preserveTimestamps"
        v-model:skip-existing="importOptions.skipExisting"
        :reset-import="resetImport"
        :import-all="importAll"
        :import-job="importJob"
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
import type { ImportJob } from '~/helpers/backups/Importer';
import type { Manifest } from '~/helpers/backups/types';
import type { DB_Node } from '~/stores/db_structures';

definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const nodesImporterStore = useNodesImporterStore();

const { t } = useI18nT();
const notifications = useNotifications();

// State
const step = ref<'select' | 'preview'>('select');
const selectedFile = ref<File>();
const isAnalyzing = ref(false);
const analyzeError = ref('');

// Backup data
const manifest = ref<Manifest | null>(null);
const backupDocuments = ref<DB_Node[]>([]);
const localData = ref<object | null>(null);

// Import state
const importJob = ref<ImportJob>({
  status: 'pending',
  toCreate: [],
  toUpdate: [],
  created: [],
  updated: [],
  failures: 0,
  options: {
    preserveTimestamps: false,
  },
});

const importOptions = reactive({
  skipExisting: false,
});

const unchangedCount = computed(() => {
  if (!backupDocuments.value.length) return 0;
  return backupDocuments.value.length - importJob.value.toCreate.length - importJob.value.toUpdate.length;
});

// Methods
const handleFileSelect = (file?: File | File[] | null) => {
  if (!file) return;
  selectedFile.value = Array.isArray(file) ? file[0] : file;
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
      const { toCreate: create, toUpdate: update } = nodesImporterStore.prepareImport(result.documents);
      importJob.value.toCreate = create;
      importJob.value.toUpdate = update;
    } else {
      backupDocuments.value = [];
      importJob.value.toCreate = [];
      importJob.value.toUpdate = [];
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
  importJob.value.toCreate = [];
  importJob.value.toUpdate = [];

  importJob.value = {
    status: 'pending',
    toCreate: [],
    toUpdate: [],
    created: [],
    updated: [],
    failures: 0,
    options: {
      preserveTimestamps: false,
    },
  };
}

async function importNodes(type: 'create' | 'update', ids: string[]) {
  const nodes: DB_Node[] =
    type === 'create' ? importJob.value.toCreate.filter(d => ids.includes(d.id)) : importJob.value.toUpdate.filter(d => ids.includes(d.id));

  if (type === 'create') {
    await nodesImporterStore.importAllNodesAndResources({ toCreate: nodes, toUpdate: [], resources: [] }, importJob);
    importJob.value.toCreate = importJob.value.toCreate.filter(d => !importJob.value.created.includes(d.id));
  } else if (type == 'update') {
    await nodesImporterStore.importAllNodesAndResources({ toCreate: [], toUpdate: nodes, resources: [] }, importJob);
    importJob.value.toUpdate = importJob.value.toUpdate.filter(d => !importJob.value.updated.includes(d.id));
  }

  notifications.add({
    type: 'success',
    title: 'Import complete',
    message: `${importJob.value.created.length + importJob.value.updated.length} documents ${type === 'create' ? 'imported' : 'updated'}`,
  });
}

function importLocalSettings() {
  if (!manifest.value) return;

  const preferences = usePreferencesStore();
  if (localData.value) {
    preferences.importPreferences(localData.value);
    notifications.add({
      type: 'success',
      title: t('import.notifications.localImportedTitle'),
      message: t('import.notifications.localImportedMessage'),
    });
  } else {
    notifications.add({
      type: 'error',
      title: t('import.notifications.importFailedTitle'),
      message: t('import.notifications.importFailedMessage'),
    });
  }
}

async function importAll() {
  const createDocs = importJob.value.toCreate;
  const updateDocs = importOptions.skipExisting ? [] : importJob.value.toUpdate;

  await nodesImporterStore.importAllNodesAndResources({ toCreate: createDocs, toUpdate: updateDocs, resources: [] }, importJob);
  importJob.value.toCreate = importJob.value.toCreate.filter(d => !importJob.value.created.includes(d.id));
  importJob.value.toUpdate = importJob.value.toUpdate.filter(d => !importJob.value.updated.includes(d.id));

  notifications.add({
    type: 'success',
    title: t('import.notifications.importCompleteTitle'),
    message: t('import.notifications.importCompleteMessage'),
  });
}
</script>

<style scoped lang="scss">
.import-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.submit {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.error-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--red);
  text-align: center;
}
</style>
