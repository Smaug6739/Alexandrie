<template>
  <div>
    <header>
      <h2>Backup Information <tag yellow>Beta</tag></h2>
      <AppButton type="secondary" size="sm" class="btn-close" @click="resetImport">
        <Icon name="close" :size="14" />
        Change file
      </AppButton>
    </header>

    <div class="info-grid">
      <div class="info-item">
        <span class="label">Created</span>
        <span class="value">{{ numericDate(manifest.created_at) }}</span>
      </div>
      <div class="info-item">
        <span class="label">Version</span>
        <span class="value">{{ manifest.version }}</span>
      </div>
      <div class="info-item">
        <span class="label">Total Documents</span>
        <span class="value">{{ manifest.statistics.total_documents }}</span>
      </div>
      <div class="info-item">
        <span class="label">Total Size</span>
        <span class="value">{{ readableFileSize(manifest.statistics.total_size_bytes) }}</span>
      </div>
    </div>

    <!-- Backup options used -->
    <div class="backup-options">
      <span class="badge" :class="{ active: manifest.options.include_documents }">
        <Icon name="folder" :size="14" />
        Documents
      </span>
      <span class="badge" :class="{ active: manifest.options.include_files }">
        <Icon name="image" :size="14" />
        Files
      </span>
      <span class="badge" :class="{ active: manifest.options.include_metadata }">
        <Icon name="layers" :size="14" />
        Metadata
      </span>
      <span class="badge" :class="{ active: manifest.includeSettings }">
        <Icon name="settings" :size="14" />
        Settings
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ManifestExtended } from '~/helpers/backups/types';
import { readableFileSize } from '~/helpers/resources';
defineProps<{ manifest: ManifestExtended; resetImport: () => void }>();

const { numericDate } = useDateFormatters();
</script>

<style scoped lang="scss">
h2 {
  border-bottom: none;
}

.btn-close {
  display: flex;
  align-items: center;
}

.info-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  .label {
    font-size: 0.75rem;
    color: var(--text-color-primary);
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
    padding: 0.25rem 0.5rem;
    border-radius: $radius-sm;
    font-size: 0.75rem;
    color: var(--text-color-primary);
    background: var(--bg-color-2);
    opacity: 0.5;
    align-items: center;
    gap: 0.25rem;

    &.active {
      color: var(--primary);
      background: var(--primary-bg);
      opacity: 1;
    }
  }
}
</style>
