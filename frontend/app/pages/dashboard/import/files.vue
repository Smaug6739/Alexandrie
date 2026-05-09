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
import type { DB_Node, ImportJob } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const user = useUserStore();
const nodesStore = useNodesStore();

const { t } = useI18nT();

const selectedNodes = ref<string[]>([]);
const toCreate = ref(0);
const nodes = ref<DB_Node[]>([]);

const importJob = ref<ImportJob>({
  status: 'pending',
  toCreate: 0,
  toUpdate: 0,
  created: [],
  updated: [],
  failures: 0,
});

async function selectFiles(files: File | File[] | null) {
  if (!files) return;
  const imp = new Importer({
    extractFrontMatter: true,
    normalizeLineEndings: true,
    preserveTimestamps: false,
    defaultValues: {
      defaultColor: 0,
      defaultDescription: '',
      defaultTags: '',
      defaultIcon: '',
      defaultTheme: '',
      defaultThumbnail: '',
    },
    user_id: user.user!.id,
  });
  await imp.handleFiles(files);
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
