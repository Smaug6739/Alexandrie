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
  gap: 0;
  border-bottom: 1px solid var(--border-color);
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  button {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    color: var(--font-color-dark);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    flex: 1;
    font-size: 15px;

    &:hover {
      color: var(--font-color);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--font-color-dark);

  p {
    margin-top: 0.5rem;
  }
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: var(--bg-color-2);
  border-radius: $radius-sm;
  transition: background 0.2s;

  &:hover {
    background: var(--bg-color-3);
  }

  .doc-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }

  .doc-details {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .doc-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .doc-meta {
    font-size: 0.75rem;
    color: var(--font-color-dark);

    .separator {
      margin: 0 0.25rem;
    }
  }

  .doc-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &.update-item {
    flex-wrap: wrap;

    .comparison {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: var(--bg-color);
      border-radius: $radius-sm;
      font-size: 0.75rem;

      .version {
        display: flex;
        flex-direction: column;
        align-items: center;

        .version-label {
          font-weight: 500;
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .version-date {
          color: var(--font-color-dark);
        }

        &.backup .version-date {
          color: var(--primary);
        }
      }

      .arrow {
        color: var(--font-color-dark);
      }
    }
  }
}

.warning {
  color: var(--red);
}
</style>
