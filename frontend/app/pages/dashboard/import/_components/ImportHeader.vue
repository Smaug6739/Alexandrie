<template>
  <div>
    <Teleport to="#navbar-title">{{ t('import.header.title') }}</Teleport>

    <Teleport to="#navbar-actions">
      <AppButton type="secondary" size="sm" class="btn-close" @click="resetImport">
        <Icon name="close" :size="14" />
        {{ t('import.header.changeFile') }}
      </AppButton>
    </Teleport>

    <div class="info-grid">
      <div class="info-item">
        <span class="label">{{ t('import.header.created') }}</span>
        <span class="value">{{ numericDate(manifest.created_at) }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ t('import.header.version') }}</span>
        <span class="value">{{ manifest.version }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ t('import.header.totalDocuments') }}</span>
        <span class="value">{{ manifest.statistics.total_documents }}</span>
      </div>
      <div class="info-item">
        <span class="label">{{ t('import.header.totalSize') }}</span>
        <span class="value">{{ readableFileSize(manifest.statistics.total_size_bytes) }}</span>
      </div>
    </div>

    <!-- Backup options used -->
    <div class="backup-options">
      <span class="badge" :class="{ active: manifest.options.include_documents }">
        <Icon name="folder" :size="14" />
        {{ t('import.header.documents') }}
      </span>
      <span class="badge" :class="{ active: manifest.options.include_files }">
        <Icon name="image" :size="14" />
        {{ t('import.header.files') }}
      </span>
      <span class="badge" :class="{ active: manifest.options.include_metadata }">
        <Icon name="layers" :size="14" />
        {{ t('import.header.metadata') }}
      </span>
      <span class="badge" :class="{ active: manifest.options.include_settings }">
        <Icon name="settings" :size="14" />
        {{ t('import.header.settings') }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readableFileSize } from '~/helpers/resources';
import type { Manifest } from '~/helpers/backups/types';

defineProps<{ manifest: Manifest; resetImport: () => void }>();

const { t } = useI18nT();
const { numericDate } = useDateFormatters();
</script>

<style scoped lang="scss">
.btn-close {
  display: flex;
  align-items: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.75rem;
    color: var(--text-primary);
    text-transform: uppercase;
  }

  .value {
    font-weight: 600;
    color: var(--text-body);
  }
}

.backup-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    color: var(--text-primary);
    opacity: 0.5;

    &.active {
      color: var(--primary);
      background: var(--primary-bg);
      opacity: 1;
    }
  }
}
</style>
