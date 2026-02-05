<template>
  <div class="actions-card">
    <div class="import-options">
      <h3>Import Options</h3>
      <AppCheck v-model="preserveTimestamps"> Preserve original timestamps </AppCheck>
      <AppCheck v-model="skipExisting"> Skip documents that already exist (import new only) </AppCheck>
    </div>
    <div class="actions-row">
      <AppButton type="secondary" @click="resetImport">
        <Icon name="close" :size="16" />
        Cancel
      </AppButton>
      <AppButton type="primary" :disabled="isImporting || (toCreate.length === 0 && toUpdate.length === 0)" @click="importAll">
        <Icon name="download" :size="16" />
        {{ isImporting ? 'Importing...' : 'Import All' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DB_Node, ImportJob } from '~/stores';

const props = defineProps<{
  toCreate: DB_Node[];
  toUpdate: DB_Node[];
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
  border-top: 1px solid var(--border-color);
  justify-content: space-between;

  .import-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
