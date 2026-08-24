<template>
  <div class="report-card">
    <div class="report-header">
      <h3>Import report</h3>
      <div class="summary">
        <span class="chip success">{{ t('common.status.success') }}: {{ successCount }}</span>
        <span class="chip error">{{ t('common.status.failed') }}: {{ failedCount }}</span>
        <span class="chip neutral">{{ t('common.status.skipped') }}: {{ skippedCount }}</span>
        <span class="chip pending">{{ t('common.status.pending') }}: {{ pendingCount }}</span>
      </div>
    </div>

    <p v-if="importJob.error_message" class="global-error">{{ importJob.error_message }}</p>

    <div v-if="rows.length" class="table-wrapper">
      <table class="report-table">
        <thead>
          <tr>
            <th>{{ t('common.labels.name') }}</th>
            <th>{{ t('common.labels.kind') }}</th>
            <th>{{ t('common.labels.action') }}</th>
            <th>{{ t('common.labels.status') }}</th>
            <th>{{ t('common.errors.generic') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.key">
            <td>{{ row.name }}</td>
            <td>{{ row.kind }}</td>
            <td>{{ row.action }}</td>
            <td>
              <span class="status" :class="row.statusClass">{{ row.statusLabel }}</span>
            </td>
            <td>{{ row.errorMessage || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="empty">No imported item to display.</p>

    <div class="actions">
      <AppButton type="secondary" @click="resetImport">Start a new import</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImportBackupJob, ImportItem } from '~/helpers/backups/Importer';

type ReportStatus = 'completed' | 'failed' | 'pending';
type ReportAction = 'create' | 'update';

interface ReportRow {
  key: string;
  id: string;
  name: string;
  kind: 'node' | 'resource';
  action: ReportAction;
  status: ReportStatus;
  statusClass: 'completed' | 'failed' | 'pending' | 'skipped';
  statusLabel: string;
  isSkipped: boolean;
  errorMessage?: string;
}

const props = defineProps<{
  importJob: ImportBackupJob;
  skipExisting?: boolean;
  resetImport: () => void;
}>();

const { t } = useI18nT();

const buildRow = (item: ImportItem, action: ReportAction): ReportRow => {
  const isSkipped = Boolean(props.skipExisting && action === 'update' && item.status === 'pending');

  return {
    key: `${action}-${item.id}`,
    id: item.id,
    name: item.name,
    kind: item.type,
    action,
    status: item.status,
    statusClass: isSkipped ? 'skipped' : item.status,
    statusLabel: isSkipped ? 'Skipped' : item.status === 'completed' ? 'Completed' : item.status === 'failed' ? 'Failed' : 'Pending',
    isSkipped,
    errorMessage: item.error_message,
  };
};

const rows = computed<ReportRow[]>(() => {
  const createRows = props.importJob.toCreate.map(item => buildRow(item, 'create'));
  const updateRows = props.importJob.toUpdate.map(item => buildRow(item, 'update'));
  return [...createRows, ...updateRows].sort((a, b) => {
    if (a.status !== b.status) {
      const order: Record<ReportStatus, number> = { failed: 0, pending: 1, completed: 2 };
      return order[a.status] - order[b.status];
    }
    return a.name.localeCompare(b.name);
  });
});

const successCount = computed(() => rows.value.filter(row => row.status === 'completed').length);
const failedCount = computed(() => rows.value.filter(row => row.status === 'failed').length);
const skippedCount = computed(() => rows.value.filter(row => row.isSkipped).length);
const pendingCount = computed(() => rows.value.filter(row => row.status === 'pending' && !row.isSkipped).length);

const resetImport = () => {
  props.resetImport();
};
</script>

<style scoped lang="scss">
.report-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;

  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
}

.summary {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.chip {
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-xs);
  font-size: 0.8rem;
  font-weight: 600;

  &.success {
    color: var(--green);
    background: var(--green-bg);
  }

  &.error {
    color: var(--red);
    background: var(--red-bg);
  }

  &.pending {
    color: var(--orange);
    background: var(--orange-bg);
  }

  &.neutral {
    color: var(--grey);
    background: var(--grey-bg);
  }
}

.global-error {
  margin: 0;
  color: var(--red);
}

.table-wrapper {
  overflow-x: auto;
}

.report-table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;

  th,
  td {
    padding: 0.6rem;
    border-bottom: 1px solid var(--border);
    font-size: 0.85rem;
    text-align: left;
    vertical-align: top;
  }

  th {
    color: var(--text-secondary);
  }
}

.status {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-xs);
  font-size: 0.8rem;
  font-weight: 600;

  &.completed {
    color: var(--green);
    background: var(--green-bg);
  }

  &.failed {
    color: var(--red);
    background: var(--red-bg);
  }

  &.pending {
    color: var(--orange);
    background: var(--orange-bg);
  }

  &.skipped {
    color: var(--text-secondary);
    background: var(--hover);
  }
}

.empty {
  margin: 0;
  color: var(--text-secondary);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
