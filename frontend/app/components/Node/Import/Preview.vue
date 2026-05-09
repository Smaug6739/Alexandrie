<template>
  <div class="node-item">
    <AppCheck v-if="selectable" :checked="selected" @change="toggleSelection" />
    <div class="doc-info">
      <Icon :name="resolveIcon(node)" display="xl" :class="['icon', getAppAccent(node.color, true)]" />
      <div class="doc-details">
        <span class="doc-name">{{ node.name }}</span>
        <span class="doc-meta">
          {{ getRoleName(node.role) }}
          <span v-if="node.description" class="separator">•</span>
          {{ node.description || '' }}
        </span>
      </div>
    </div>
    <div class="comparison">
      <div v-if="existingNode" class="version current">
        <span class="version-label">{{ t('import.tabs.current') }}</span>
        <span class="version-date">{{ numericDate(existingNode?.updated_timestamp) }}</span>
      </div>
      <div class="version backup">
        <span class="version-label">{{ t('import.tabs.backup') }}</span>
        <span class="version-date">{{ numericDate(node.updated_timestamp) }}</span>
      </div>
    </div>
    <div class="doc-actions">
      <AppButton type="primary" size="sm" :disabled="isImporting" @click="importSingle">
        {{ t('import.tabs.importFromBackup') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { resolveIcon, getRoleName } from '~/helpers/node';
import type { DB_Node } from '~/stores';

const props = defineProps<{ node: DB_Node; selectable: boolean; selected?: boolean; isImporting?: boolean }>();

const emit = defineEmits<{
  (e: 'toggleSelection' | 'importSingle'): void;
}>();

const store = useNodesStore();
const { t } = useI18nT();
const { numericDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

const existingNode = computed(() => store.getById(props.node.id));

const toggleSelection = () => emit('toggleSelection');
const importSingle = () => emit('importSingle');
</script>

<style scoped lang="scss">
.node-item {
  display: flex;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.doc-info {
  display: flex;
  min-width: 0;
  align-items: center;
  flex: 1;
  gap: 0.75rem;
}

.icon {
  padding: 4px;
  border-radius: var(--radius-md);
  margin-right: 10px;
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
}
</style>
