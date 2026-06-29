<template>
  <div class="actions-card">
    <div class="import-options">
      <h3>{{ t('import.actions.optionsTitle') }}</h3>
      <AppCheck v-model="preserveTimestamps"> {{ t('import.actions.preserveTimestamps') }} </AppCheck>
      <AppCheck v-model="skipExisting"> {{ t('import.actions.skipExisting') }} </AppCheck>
    </div>
    <div class="actions-row">
      <AppButton type="secondary" @click="resetImport">
        <Icon name="close" :size="16" />
        {{ t('import.actions.cancel') }}
      </AppButton>
      <AppButton type="primary" :disabled="isImporting || (importJob.toCreate.length === 0 && importJob.toUpdate.length === 0)" @click="importAll">
        <Icon name="download" :size="16" />
        {{ isImporting ? t('import.actions.importing') : t('import.actions.importAll') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImportJob } from '~/helpers/backups/Importer';

const { t } = useI18nT();
const props = defineProps<{
  importJob: ImportJob;
  resetImport: () => void;
  importAll: () => void;
}>();
const preserveTimestamps = defineModel<boolean>('preserveTimestamps');
const skipExisting = defineModel<boolean>('skipExisting');

const isImporting = computed(() => props.importJob.status === 'in_progress');
</script>

<style scoped lang="scss">
.actions-card {
  display: flex;
  padding: 1rem;
  align-items: center;
  border-top: 1px solid var(--border);
  justify-content: space-between;

  .import-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
