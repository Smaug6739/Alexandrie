<template>
  <div class="page-card files-import">
    <header>
      <div>
        <h1>{{ t('import.files.meta.title') }} <tag class="orange">Beta</tag></h1>
        <p class="subtitle">
          {{ t('import.files.meta.description') }}
        </p>
      </div>
    </header>

    <AppDrop ref="dropComponent" multiple allow-folders @select="selectFiles" />
    <small>{{ t('import.files.importable') }}</small>

    <h3>{{ t('import.advanced.options') }}</h3>

    <div class="actions-row">
      <AppToggle v-model="options.extractFrontMatter" />
      <p>{{ t('import.actions.extractFrontMatter') }}</p>
    </div>

    <div class="actions-row">
      <AppToggle v-model="options.normalizeLineEndings" />
      <p>{{ t('import.actions.normalizeLineEndings') }}</p>
    </div>

    <div class="actions-row">
      <AppToggle v-model="options.preserveTimestamps" />
      <p>{{ t('import.actions.preserveTimestamps') }}</p>
    </div>
    <div>
      <label for="default-description">
        {{ t('import.advanced.defaultDescription') }}
      </label>
      <input id="default-description" v-model="options.defaultValues.defaultDescription" type="text" placeholder="Default description for imported nodes" />
      <label for="default-tags">
        {{ t('import.advanced.defaultTags') }}
      </label>
      <input id="default-tags" v-model="options.defaultValues.defaultTags" type="text" placeholder="tag1, tag2, tag3" />
      <label for="default-color">
        {{ t('import.advanced.defaultColor') }}
      </label>
      <AppColorPicker id="default-color" v-model="options.defaultValues.defaultColor" nullable />
      <label for="default-thumbnail">
        {{ t('import.advanced.defaultThumbnail') }}
      </label>
      <input id="default-thumbnail" v-model="options.defaultValues.defaultThumbnail" type="text" />
      <label for="default-icon">
        {{ t('import.advanced.defaultIcon') }}
      </label>
      <input id="default-icon" v-model="options.defaultValues.defaultIcon" type="text" />
      <label for="default-theme">
        {{ t('import.advanced.defaultTheme') }}
      </label>
      <AppSelect id="default-theme" v-model="options.defaultValues.defaultTheme" :items="DOCUMENT_THEMES" />
    </div>
    <section v-if="nodes.length" class="panel">
      <div class="panel-head">
        <h3>{{ t('import.files.toImport') }} ({{ nodes.length }})</h3>
        <div class="actions-row">
          <AppButton type="primary" size="sm" :disabled="selectedNodes.length === 0" @click="importSelected">
            {{ t('import.tabs.importSelected', { count: selectedNodes.length }) }}
          </AppButton>
          <AppButton type="primary" @click="importAll">
            <Icon name="download" :size="16" />
            {{ t('import.actions.importAll') }}
          </AppButton>
        </div>
      </div>
      <ImportProgress :import-job="importJob" :to-create="toCreate" />
      <div class="list">
        <NodeImportPreview
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          selectable
          :selected="selectedNodes.includes(node.id)"
          @toggle-selection="() => toggleSelection(node.id)"
          @import-single="() => importSingle(node)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ImportProgress from './_components/ImportProgress.vue';
import { Importer } from '~/helpers/backups/Importer';
import { DOCUMENT_THEMES } from '~/helpers/constants';
import type { DB_Node, ImportJob } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const user = useUserStore();
const nodesStore = useNodesStore();
const { t } = useI18nT();

const selectedNodes = ref<string[]>([]);

const toCreate = ref(0);

const files = ref<File[]>([]);
const nodes = ref<DB_Node[]>([]);

const options = ref({
  extractFrontMatter: true,
  normalizeLineEndings: true,
  preserveTimestamps: true,
  defaultValues: {
    defaultDescription: '',
    defaultTags: '',
    defaultColor: -1,
    defaultThumbnail: '',
    defaultIcon: '',
    defaultTheme: '',
  },
});

watch(
  () => options.value,
  _ => {
    // Re-process files with new options
    if (files.value.length) processImport();
  },
  { deep: true },
);

const importJob = ref<ImportJob>({
  status: 'pending',
  toCreate: 0,
  toUpdate: 0,
  created: [],
  updated: [],
  failures: 0,
});

function selectFiles(importedFiles: File | File[] | null) {
  if (!importedFiles) return;
  files.value = Array.isArray(importedFiles) ? importedFiles : [importedFiles];
  processImport();
}

async function processImport() {
  if (!files.value) return;
  const imp = new Importer({
    ...options.value,
    user_id: user.user!.id,
  });
  await imp.handleFiles(files.value);
  nodes.value = await imp.normalizedToNodes();
}

function toggleSelection(id: string) {
  const idx = selectedNodes.value.indexOf(id);
  if (idx === -1) selectedNodes.value.push(id);
  else selectedNodes.value.splice(idx, 1);
}

const importSingle = (node: DB_Node) => importNodes([node]);
const importSelected = () => {
  const toImport = nodes.value.filter(n => selectedNodes.value.includes(n.id));
  importNodes(toImport);
};
const importAll = () => importNodes(nodes.value);

async function importNodes(importNodes: DB_Node[]) {
  toCreate.value = importNodes.length;
  importJob.value.toCreate = importNodes.length;
  await nodesStore.importMultipleNodes({ toCreate: importNodes, toUpdate: [] }, importJob);
  nodes.value = nodes.value.filter(n => !importJob.value.created.includes(n.id));
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
  align-items: center;
  gap: 0.7rem;
  justify-content: space-between;
  margin-bottom: 0.65rem;
}

.list {
  display: grid;
  max-height: 250px;
  gap: 0.35rem;
  overflow: auto;
}

@media (width <= 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
