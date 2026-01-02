<template>
  <div class="actions-card">
    <div class="import-options">
      <h3>Import Options</h3>
      <AppCheck v-model="preserveTimestamps"> Preserve original timestamps </AppCheck>
      <AppCheck v-model="skipExisting"> Skip documents that already exist (import new only) </AppCheck>
    </div>
    <div class="actions-buttons">
      <AppButton type="secondary" @click="resetImport">
        <Icon name="close" :size="16" />
        Cancel
      </AppButton>
      <AppButton type="primary" :disabled="isImporting || (toCreate.length === 0 && toUpdate.length === 0)" @click="importAll">
        <LoaderSpinner v-if="isImporting" :size="16" />
        <Icon v-else name="download" :size="16" />
        {{ isImporting ? `Importing... (${importProgress}/${importTotal})` : 'Import All' }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DB_Node } from '~/stores';

defineProps<{
  toCreate: DB_Node[];
  toUpdate: DB_Node[];
  isImporting: boolean;
  importProgress: number;
  importTotal: number;
  resetImport: () => void;
  importAll: () => void;
}>();
const preserveTimestamps = defineModel<boolean>('preserveTimestamps');
const skipExisting = defineModel<boolean>('skipExisting');
</script>

<style scoped lang="scss">
.actions-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);

  .import-options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
}
.actions-buttons {
  display: flex;
  gap: 0.5rem;

  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
