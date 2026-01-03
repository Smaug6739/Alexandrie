<template>
  <div class="container">
    <div class="progress-header">
      <span class="status">
        <strong>Status</strong><span class="status-badge" :class="importJob.status"> {{ statusLabel }} </span>
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

const progress = computed(() => Math.floor(((props.importJob.created.length + props.importJob.updated.length) * 100) / (props.toCreate + props.toUpdate)));
const statusLabel = computed(() => {
  switch (props.importJob.status) {
    case 'pending':
      return 'Pending';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Unknown';
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
  border-radius: $radius-sm;
  font-size: 0.875rem;
  font-weight: 500;

  &.pending {
    background: var(--yellow-bg);
    color: var(--yellow);
  }

  &.in_progress {
    background: var(--primary-bg);
    color: var(--primary);
  }

  &.completed {
    background: var(--green-bg);
    color: var(--green);
  }

  &.failed {
    background: var(--red-bg);
    color: var(--red);
  }
}

.progress-percent {
  font-weight: 600;
  color: var(--primary);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}
</style>
