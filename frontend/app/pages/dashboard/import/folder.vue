<template>
  <div class="page-card files-import">
    <Teleport to="#navbar-title">{{ t('import.categories.folder.title') }} <tag v-if="displayFeatureTags" class="orange">Beta v2</tag></Teleport>
    <p class="subtitle">
      {{ t('import.categories.folder.description') }}
    </p>

    <AppDrop ref="dropComponent" multiple allow-folders :max-files="200" @select="selectFiles" />
    <small>{{ t('import.files.importable') }}</small>

    <AppCollapse :title="t('import.folder.options')">
      <div class="actions-row">
        <AppToggle v-model="importJob.options.extractFrontMatter" />
        <p>{{ t('import.actions.extractFrontMatter') }}</p>
      </div>

      <div class="actions-row">
        <AppToggle v-model="importJob.options.normalizeLineEndings" />
        <p>{{ t('import.actions.normalizeLineEndings') }}</p>
      </div>

      <div class="actions-row">
        <AppToggle v-model="importJob.options.preserveTimestamps" />
        <p>{{ t('import.actions.preserveTimestamps') }}</p>
      </div>
      <div>
        <div>
          <label for="default-parent">{{ t('import.folder.defaultParent') }}</label>
          <AppSelect
            v-model="importJob.options.defaultValues!!.defaultParent"
            class="entry"
            :items="categoriesItem"
            nullable
            :placeholder="t('common.labels.parent')"
          />
        </div>
        <label for="default-description">
          {{ t('import.folder.defaultDescription') }}
        </label>
        <input
          id="default-description"
          v-model="importJob.options.defaultValues!.defaultDescription"
          type="text"
          placeholder="Default description for imported nodes"
        />
        <label for="default-tags">
          {{ t('import.folder.defaultTags') }}
        </label>
        <input id="default-tags" v-model="importJob.options.defaultValues!.defaultTags" type="text" placeholder="tag1, tag2, tag3" />
        <label for="default-color">
          {{ t('import.folder.defaultColor') }}
        </label>
        <AppColorPicker id="default-color" v-model="importJob.options.defaultValues!.defaultColor" nullable />
        <label for="default-thumbnail">
          {{ t('import.folder.defaultThumbnail') }}
        </label>
        <input id="default-thumbnail" v-model="importJob.options.defaultValues!.defaultThumbnail" type="text" />
        <label for="default-icon">
          {{ t('import.folder.defaultIcon') }}
        </label>
        <input id="default-icon" v-model="importJob.options.defaultValues!.defaultIcon" type="text" />
        <label for="default-theme">
          {{ t('import.folder.defaultTheme') }}
        </label>
        <AppSelect id="default-theme" v-model="importJob.options.defaultValues!.defaultTheme" :items="DOCUMENT_THEMES" />
      </div>
    </AppCollapse>
    <h3>{{ t('import.progress.title') }}</h3>
    <ImportJobStatus :import-job="importJob" />
    <section v-if="totalItemsToImport && importJob.status === 'pending'" class="panel">
      <div class="panel-head">
        <h3>{{ t('import.files.toImport') }} ({{ totalItemsToImport }})</h3>

        <AppButton type="primary" @click="importNodes">
          <Icon name="download" :size="16" />
          {{ t('import.actions.importAll') }}
        </AppButton>
      </div>
      <div class="list">
        <NodeImportPreview
          v-for="item in importJob.toCreate.filter(i => i.type === 'node')"
          :key="item.id"
          :node="item.data"
          :selectable="false"
          :allow-single-import="false"
        />
        <FileInline v-for="item in importJob.toCreate.filter(i => i.type === 'resource')" :key="item.id" :file="item.data.file" :remove-file="() => false" />
      </div>
    </section>
    <ImportReport v-if="importJob.status === 'completed' || importJob.status === 'failed'" :import-job="importJob" :reset-import="() => {}" />
  </div>
</template>
<script setup lang="ts">
import { Importer, type ImportJob, type ImportItem } from '~/helpers/backups/Importer';
import { DOCUMENT_THEMES } from '~/helpers/constants';
import ImportReport from './_components/ImportReport.vue';

definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const nodesImporterStore = useNodesImporterStore();
const preferences = usePreferencesStore();

const nodesTree = useNodesTree();
const { t } = useI18nT();

const categoriesItem = nodesTree.getTreeUpToRole(2);
const displayFeatureTags = preferences.get('displayFeatureTags');

const files = ref<File[]>([]);

const totalItemsToImport = computed(() => importJob.value.toCreate.length);

const importJob = ref<ImportJob<ImportItem>>({
  status: 'pending',
  toCreate: [],
  toUpdate: [],
  created: [],
  updated: [],
  failures: 0,
  options: {
    extractFrontMatter: true,
    normalizeLineEndings: true,
    preserveTimestamps: true,
    defaultValues: {
      defaultParent: undefined,
      defaultDescription: '',
      defaultTags: '',
      defaultColor: -1,
      defaultThumbnail: '',
      defaultIcon: '',
      defaultTheme: '',
    },
  },
});

watch(
  () => importJob.value.options,
  _ => {
    // Re-process files with new options
    if (files.value.length) processImport();
  },
  { deep: true },
);

function selectFiles(importedFiles: File | File[] | null) {
  if (!importedFiles) return;
  files.value = Array.isArray(importedFiles) ? importedFiles : [importedFiles];
  processImport();
}

async function processImport() {
  if (!files.value) return;
  const imp = new Importer(importJob.value.options);
  await imp.handleFiles(files.value);
  const result = await imp.normalizedToNodes();
  importJob.value.toCreate = [];
  importJob.value.toCreate.push(
    ...(result.nodesToCreate.map(node => ({
      type: 'node',
      data: node,
      id: node.id,
      name: node.name,
      status: 'pending',
    })) as ImportItem[]),
  );
  importJob.value.toCreate.push(
    ...(result.resourcesToUpload.map(resource => ({
      type: 'resource',
      data: resource,
      id: resource.id,
      name: resource.file.name,
      status: 'pending',
    })) as ImportItem[]),
  );
}

async function importNodes() {
  await nodesImporterStore.importAllNodesAndResources({ toCreate: importJob.value.toCreate, toUpdate: importJob.value.toUpdate }, importJob);
}
</script>

<style scoped lang="scss">
.files-import {
  display: grid;
  gap: 1rem;
}

.actions-row > p {
  margin: 0.1rem;
}

label {
  margin-top: 0.5rem;
}

.panel {
  padding: 0.85rem;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.panel h3 {
  margin: 0 0 0.65rem;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.65rem;
}

.list {
  display: grid;
  gap: 0.35rem;
  max-height: 250px;
  overflow: auto;
}
</style>
