<template>
  <div>
    <div class="tabs">
      <button :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">{{ t('import.tabs.newDocuments') }} ({{ toCreate.length }})</button>
      <button :class="{ active: activeTab === 'update' }" @click="activeTab = 'update'">{{ t('import.tabs.updates') }} ({{ toUpdate.length }})</button>
      <button :class="{ active: activeTab === 'local' }" @click="activeTab = 'local'">
        {{ t('import.tabs.localSettings') }} ({{ manifest?.options.include_settings ? 1 : 0 }})
      </button>
    </div>

    <!-- Tab: New Documents -->
    <div v-if="activeTab === 'create'" class="tab-content">
      <div v-if="toCreate.length === 0" class="empty-state">
        <Icon name="folder" :size="32" />
        <p>{{ t('import.tabs.noNewDocuments') }}</p>
      </div>
      <template v-else>
        <div class="list-header">
          <AppCheck v-model="selectAllCreate" @update:model-value="toggleSelectAllCreate"> {{ t('import.tabs.selectAll') }} </AppCheck>
          <AppButton type="primary" size="sm" :disabled="selectedCreate.length === 0 || isImporting" @click="importSelected('create')">
            {{ t('import.tabs.importSelected', { count: selectedCreate.length }) }}
          </AppButton>
        </div>
        <div class="documents-list">
          <NodeImportPreview
            v-for="doc in toCreate"
            :key="doc.id"
            :node="doc"
            selectable
            :selected="selectedCreate.includes(doc.id)"
            :is-importing="isImporting"
            @toggle-selection="() => toggleSelection(doc.id, 'create')"
            @import-single="() => importSingle(doc, 'create')"
          />
        </div>
      </template>
    </div>

    <!-- Tab: Updates -->
    <div v-if="activeTab === 'update'" class="tab-content">
      <div v-if="toUpdate.length === 0" class="empty-state">
        <Icon name="update" :size="32" />
        <p>{{ t('import.tabs.noUpdates') }}</p>
      </div>
      <template v-else>
        <div class="list-header">
          <AppCheck v-model="selectAllUpdate" @update:model-value="toggleSelectAllUpdate"> {{ t('import.tabs.selectAll') }} </AppCheck>
          <AppButton type="primary" size="sm" :disabled="selectedUpdate.length === 0 || isImporting" @click="importSelected('update')">
            <LoaderSpinner v-if="isImporting" :size="14" />
            {{ t('import.tabs.updateSelected', { count: selectedUpdate.length }) }}
          </AppButton>
        </div>
        <div class="documents-list">
          <NodeImportPreview
            v-for="doc in toUpdate"
            :key="doc.id"
            :node="doc"
            selectable
            :selected="selectedUpdate.includes(doc.id)"
            :is-importing="isImporting"
            @toggle-selection="() => toggleSelection(doc.id, 'update')"
            @import-single="() => importSingle(doc, 'update')"
          />
        </div>
      </template>
    </div>

    <!-- Tab: Local Settings -->
    <div v-if="activeTab === 'local'" class="tab-content">
      <div v-if="!manifest.options.include_settings" class="empty-state">
        <Icon name="settings" :size="32" />
        <p>{{ t('import.tabs.noLocalSettings') }}</p>
      </div>
      <div v-else class="empty-state">
        <Icon name="settings" :size="32" />
        <p>{{ t('import.tabs.localSettingsAvailable') }}</p>
        <p>{{ t('import.tabs.replaceLocalSettings') }}</p>
        <p class="warning"><Icon name="warning" :size="14" /> {{ t('import.tabs.localSettingsWarning') }}</p>
        <AppButton type="primary" size="md" :disabled="isImporting" @click="importLocalSettings"> {{ t('import.tabs.importLocalSettings') }} </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DB_Node, ImportJob } from '~/stores';
import type { Manifest } from '~/helpers/backups/types';

const { t } = useI18nT();
const props = defineProps<{ manifest: Manifest; toCreate: DB_Node[]; toUpdate: DB_Node[]; importJob: ImportJob }>();
const emit = defineEmits<{
  (e: 'import', type: 'create' | 'update', nodeIds: string[]): void;
  (e: 'importLocalSettings'): void;
}>();

// Selection
const activeTab = ref<'create' | 'update' | 'local'>('create');
const selectedCreate = ref<string[]>([]);
const selectedUpdate = ref<string[]>([]);
const selectAllCreate = ref(false);
const selectAllUpdate = ref(false);

const isImporting = computed(() => props.importJob.status === 'in_progress');

function toggleSelectAllCreate(value: boolean) {
  if (value) {
    selectedCreate.value = props.toCreate.map(d => d.id);
  } else {
    selectedCreate.value = [];
  }
}

function toggleSelection(id: string, type: 'create' | 'update') {
  const arr = type === 'create' ? selectedCreate : selectedUpdate;
  const idx = arr.value.indexOf(id);
  if (idx === -1) {
    arr.value.push(id);
  } else {
    arr.value.splice(idx, 1);
  }
}

function toggleSelectAllUpdate(value: boolean) {
  if (value) {
    selectedUpdate.value = props.toUpdate.map(d => d.id);
  } else {
    selectedUpdate.value = [];
  }
}

function importSingle(doc: DB_Node, type: 'create' | 'update') {
  emit('import', type, [doc.id]);
}
function importSelected(type: 'create' | 'update') {
  const ids = type === 'create' ? selectedCreate.value : selectedUpdate.value;
  emit('import', type, ids);
}
function importLocalSettings() {
  emit('importLocalSettings');
}
</script>

<style scoped lang="scss">
// Documents Card
.tabs {
  display: flex;
  width: 100%;
  padding: 0 1.5rem;
  border-bottom: 1px solid var(--border);
  gap: 0;
  margin-bottom: 2rem;

  button {
    padding: 1rem 1.5rem;
    border: none;
    font-size: 15px;
    color: var(--text-primary);
    background: none;
    transition:
      color $transition-fast ease,
      border-bottom-color $transition-fast ease;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    flex: 1;

    &:hover {
      color: var(--text-body);
    }

    &.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }
  }
}

.tab-content {
  min-height: 200px;
}

.empty-state {
  display: flex;
  padding: 3rem;
  color: var(--text-primary);
  align-items: center;
  flex-direction: column;
  justify-content: center;

  p {
    margin-top: 0.5rem;
  }
}

.list-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
}

.documents-list {
  display: flex;
  max-height: 400px;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
}

.warning {
  display: flex;
  color: var(--red);
  align-items: center;
}
</style>
