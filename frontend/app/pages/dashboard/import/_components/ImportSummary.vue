<template>
  <div class="ctn">
    <h2>Import Summary</h2>
    <div class="stats">
      <div class="stat new">
        <Icon name="plus" :size="20" />
        <span class="count">{{ toCreate }}</span>
        <span class="label">New documents</span>
      </div>
      <div class="stat update">
        <Icon name="update" :size="20" />
        <span class="count">{{ toUpdate }}</span>
        <span class="label">Documents to update</span>
      </div>
      <div class="stat unchanged">
        <Icon name="check" :size="20" />
        <span class="count">{{ unchangedCount }}</span>
        <span class="label">Unchanged</span>
      </div>
    </div>
    <div class="progess">
      <ImportProgress :import-job="importJob" :to-create="toCreate" :to-update="toUpdate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ImportProgress from './ImportProgress.vue';

import type { ImportJob } from '~/stores';
defineProps<{
  toCreate: number;
  toUpdate: number;
  unchangedCount: number;
  importJob: ImportJob;
}>();
</script>

<style scoped lang="scss">
.ctn {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  width: 200px;
  border-radius: $radius-sm;

  .count {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .label {
    font-size: 0.8rem;
    color: var(--font-color-dark);
  }

  &.new {
    background: var(--green-bg);
    color: var(--green);
  }

  &.update {
    background: var(--primary-bg);
    color: var(--primary);
  }

  &.unchanged {
    background: var(--grey-bg);
    color: var(--font-color-dark);
  }
}

.progess {
  margin-top: 1rem;
}
</style>
