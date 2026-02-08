<template>
  <div>
    <div class="tabs">
      <button :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">New Documents ({{ toCreate.length }})</button>
      <button :class="{ active: activeTab === 'update' }" @click="activeTab = 'update'">Updates ({{ toUpdate.length }})</button>
      <button :class="{ active: activeTab === 'local' }" @click="activeTab = 'local'">
        Local settings and preferences ({{ manifest?.includeSettings ? 1 : 0 }})
      </button>
    </div>

    <!-- Tab: New Documents -->
    <div v-if="activeTab === 'create'" class="tab-content">
      <div v-if="toCreate.length === 0" class="empty-state">
        <Icon name="folder" :size="32" />
        <p>No new documents to import</p>
      </div>
      <template v-else>
        <div class="list-header">
          <AppCheck v-model="selectAllCreate" @update:model-value="toggleSelectAllCreate"> Select all </AppCheck>
          <AppButton type="primary" size="sm" :disabled="selectedCreate.length === 0 || isImporting" @click="importSelected('create')">
            Import selected ({{ selectedCreate.length }})
          </AppButton>
        </div>
        <div class="documents-list">
          <div v-for="doc in toCreate" :key="doc.id" class="document-item">
            <AppCheck :checked="selectedCreate.includes(doc.id)" @change="toggleSelection(doc.id, 'create')" />
            <div class="doc-info">
              <Icon :name="resolveIcon(doc)" :size="18" />
              <div class="doc-details">
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-meta">
                  {{ getRoleName(doc.role) }}
                  <span v-if="doc.description" class="separator">•</span>
                  {{ doc.description || '' }}
                </span>
              </div>
            </div>
            <div class="doc-actions">
              <AppButton type="primary" size="sm" :disabled="isImporting" @click="importSingle(doc, 'create')"> Import </AppButton>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Tab: Updates -->
    <div v-if="activeTab === 'update'" class="tab-content">
      <div v-if="toUpdate.length === 0" class="empty-state">
        <Icon name="update" :size="32" />
        <p>No documents to update</p>
      </div>
      <template v-else>
        <div class="list-header">
          <AppCheck v-model="selectAllUpdate" @update:model-value="toggleSelectAllUpdate"> Select all </AppCheck>
          <AppButton type="primary" size="sm" :disabled="selectedUpdate.length === 0 || isImporting" @click="importSelected('update')">
            <LoaderSpinner v-if="isImporting" :size="14" />
            Update selected ({{ selectedUpdate.length }})
          </AppButton>
        </div>
        <div class="documents-list">
          <div v-for="doc in toUpdate" :key="doc.id" class="document-item update-item">
            <AppCheck :checked="selectedUpdate.includes(doc.id)" @change="toggleSelection(doc.id, 'update')" />
            <div class="doc-info">
              <Icon :name="resolveIcon(doc)" :size="18" />
              <div class="doc-details">
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-meta">
                  {{ getRoleName(doc.role) }}
                </span>
              </div>
            </div>
            <div class="comparison">
              <div class="version current">
                <span class="version-label">Current</span>
                <span class="version-date">{{ numericDate(getExistingNode(doc.id)?.updated_timestamp) }}</span>
              </div>
              <Icon name="arrow-right" :size="14" class="arrow" />
              <div class="version backup">
                <span class="version-label">Backup</span>
                <span class="version-date">{{ numericDate(doc.updated_timestamp) }}</span>
              </div>
            </div>
            <div class="doc-actions">
              <AppButton type="primary" size="sm" :disabled="isImporting" @click="importSingle(doc, 'update')"> Imprort from backup </AppButton>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Tab: Local Settings -->
    <div v-if="activeTab === 'local'" class="tab-content">
      <div v-if="!manifest.includeSettings" class="empty-state">
        <Icon name="settings" :size="32" />
        <p>No local settings and preferences found in the backup</p>
      </div>
      <div v-else class="empty-state">
        <Icon name="settings" :size="32" />
        <p>Local settings and preferences can be imported</p>
        <p>Do you want to replace your local settings and preferences with those from the backup?</p>
        <p class="warning">
          <Icon name="warning" :size="14" /> This will overwrite your current local settings and preferences including <strong>your snippets</strong>
        </p>
        <AppButton type="primary" size="md" :disabled="isImporting" @click="importLocalSettings"> Import Local Settings </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getRoleName, resolveIcon } from '~/helpers/node';
import type { DB_Node, ImportJob } from '~/stores';
import type { ManifestExtended } from '~/helpers/backups/types';

const props = defineProps<{ manifest: ManifestExtended; toCreate: DB_Node[]; toUpdate: DB_Node[]; importJob: ImportJob }>();
const emit = defineEmits<{
  (e: 'import', type: 'create' | 'update', nodeIds: string[]): void;
  (e: 'importLocalSettings'): void;
}>();

const store = useNodesStore();

const { numericDate } = useDateFormatters();

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
function getExistingNode(id: string): DB_Node | undefined {
  return store.getById(id);
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
    transition: all 0.2s ease;
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

.document-item {
  display: flex;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  align-items: center;
  gap: 1rem;

  .doc-info {
    display: flex;
    min-width: 0;
    align-items: center;
    flex: 1;
    gap: 0.75rem;
  }

  .doc-details {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }

  .doc-name {
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .doc-meta {
    font-size: 0.75rem;
    color: var(--text-primary);

    .separator {
      margin: 0 0.25rem;
    }
  }

  .doc-actions {
    display: flex;
    flex-shrink: 0;
    gap: 0.5rem;
  }

  &.update-item {
    flex-wrap: wrap;

    .comparison {
      display: flex;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      background: var(--surface-base);
      align-items: center;
      gap: 0.5rem;

      .version {
        display: flex;
        align-items: center;
        flex-direction: column;

        .version-label {
          font-size: 0.65rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .version-date {
          color: var(--text-primary);
        }

        &.backup .version-date {
          color: var(--primary);
        }
      }

      .arrow {
        color: var(--text-primary);
      }
    }
  }
}

.warning {
  color: var(--red);
}
</style>
