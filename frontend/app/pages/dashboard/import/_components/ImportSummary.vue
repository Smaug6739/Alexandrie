<template>
  <div class="ctn">
    <h2>{{ t('import.summary.title') }}</h2>
    <div class="stats">
      <div class="stat new">
        <Icon name="plus" :size="20" />
        <span class="count">{{ importJob.toCreate.length }}</span>
        <span class="label">{{ t('import.summary.newDocuments') }}</span>
      </div>
      <div class="stat update">
        <Icon name="update" :size="20" />
        <span class="count">{{ importJob.toUpdate.length }}</span>
        <span class="label">{{ t('import.summary.documentsToUpdate') }}</span>
      </div>
      <div class="stat unchanged">
        <Icon name="check" :size="20" />
        <span class="count">{{ unchangedCount }}</span>
        <span class="label">{{ t('import.summary.unchanged') }}</span>
      </div>
    </div>
    <div class="progess">
      <ImportProgress :import-job="importJob" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ImportProgress from './ImportProgress.vue';
import type { ImportJob } from '~/helpers/backups/Importer';

defineProps<{
  unchangedCount: number;
  importJob: ImportJob;
}>();

const { t } = useI18nT();
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
  justify-content: space-around;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 200px;
  padding: 1rem;
  border-radius: var(--radius-sm);

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
