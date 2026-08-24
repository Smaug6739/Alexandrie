<template>
  <div class="actions-card">
    <div class="import-options">
      <h3>{{ t('import.actions.optionsTitle') }}</h3>
      <AppCheck v-model="preserveTimestamps"> {{ t('import.actions.preserveTimestamps') }} </AppCheck>
      <AppCheck v-model="skipExisting"> {{ t('import.actions.skipExisting') }} </AppCheck>
    </div>
    <AppButton
      style=" display: flex; justify-content: center; align-items: center; gap: 0.5rem;width: 100%; margin-top: 2rem"
      type="primary"
      :disabled="isImporting || (importJob.toCreate.length === 0 && importJob.toUpdate.length === 0)"
      @click="importAll"
    >
      <Icon name="download" :size="16" />
      {{ isImporting ? t('import.actions.importing') : t('import.actions.importAll') }}
    </AppButton>
  </div>
</template>

<script setup lang="ts">
import type { ImportBackupJob } from '~/helpers/backups/Importer';

const { t } = useI18nT();
const props = defineProps<{
  importJob: ImportBackupJob;
  importAll: () => void;
}>();
const preserveTimestamps = defineModel<boolean>('preserveTimestamps');
const skipExisting = defineModel<boolean>('skipExisting');

const isImporting = computed(() => props.importJob.status === 'in_progress');
</script>

<style scoped lang="scss">
.actions-card {
  border-top: 1px solid var(--border);

  .import-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
