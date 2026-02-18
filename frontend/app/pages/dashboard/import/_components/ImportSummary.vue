<template>
  <div class="ctn">
    <h2>{{ t('import.summary.title') }}</h2>
    <div class="stats">
      <div class="stat new">
        <Icon name="plus" :size="20" />
        <span class="count">{{ toCreate }}</span>
        <span class="label">{{ t('import.summary.newDocuments') }}</span>
      </div>
      <div class="stat update">
        <Icon name="update" :size="20" />
        <span class="count">{{ toUpdate }}</span>
        <span class="label">{{ t('import.summary.documentsToUpdate') }}</span>
      </div>
      <div class="stat unchanged">
        <Icon name="check" :size="20" />
        <span class="count">{{ unchangedCount }}</span>
        <span class="label">{{ t('import.summary.unchanged') }}</span>
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

const { t } = useI18nT();
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
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-around;
}

.stat {
  display: flex;
  width: 200px;
  padding: 1rem;
  border-radius: var(--radius-sm);
  align-items: center;
  flex-direction: column;
  gap: 0.25rem;

  .count {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .label {
    font-size: 0.8rem;
    color: var(--text-primary);
  }

  &.new {
    color: var(--green);
    background: var(--green-bg);
  }

  &.update {
    color: var(--primary);
    background: var(--primary-bg);
  }

  &.unchanged {
    color: var(--text-primary);
    background: var(--grey-bg);
  }
}

.progess {
  margin-top: 1rem;
}
</style>
