<template>
  <div class="container">
    <div class="progress-header">
      <span class="status">
        <strong>{{ t('common.labels.status') }}</strong
        ><span class="status-badge" :class="importJob.status"> {{ statusLabel }} </span>
      </span>
      <span v-if="importJob.status === 'in_progress'" class="progress-percent"> {{ progress }}% </span>
    </div>

    <div v-if="importJob.status === 'in_progress'" class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImportJob } from '~/stores';

const props = defineProps<{ importJob: ImportJob; toCreate: number; toUpdate: number }>();

const { t } = useI18nT();

const progress = computed(() => Math.floor(((props.importJob.created.length + props.importJob.updated.length) * 100) / (props.toCreate + props.toUpdate)));
const statusLabel = computed(() => {
  switch (props.importJob.status) {
    case 'pending':
      return t('common.status.pending');
    case 'in_progress':
      return t('common.status.processing');
    case 'completed':
      return t('common.status.completed');
    case 'failed':
      return t('common.status.failed');
    default:
      return t('common.status.unknown');
  }
});
</script>

<style scoped lang="scss">
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;

  &.pending {
    color: var(--yellow);
    background: var(--yellow-bg);
  }

  &.in_progress {
    color: var(--primary);
    background: var(--primary-bg);
  }

  &.completed {
    color: var(--green);
    background: var(--green-bg);
  }

  &.failed {
    color: var(--red);
    background: var(--red-bg);
  }
}

.progress-percent {
  font-weight: 600;
  color: var(--primary);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-xs);
  background: var(--border);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-xs);
  background: var(--primary);
  transition: width $transition-medium ease;
}
</style>
