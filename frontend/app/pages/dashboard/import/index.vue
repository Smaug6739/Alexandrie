<template>
  <div class="import-page page-card">
    <Teleport to="#navbar-title">{{ t('import.meta.title') }}</Teleport>

    <p class="page-subtitle">
      {{ t('import.meta.description') }}
      <NuxtLink to="/dashboard/settings?p=backup" class="settings-link">{{ t('import.meta.settingsLink') }}</NuxtLink>
    </p>

    <section class="cards-grid">
      <NuxtLink class="import-card" to="/dashboard/import/backup">
        <h3>{{ t('import.categories.backup.title') }}</h3>
        <IconApp class="icon-app" />
        <p>{{ t('import.categories.backup.description') }}</p>
        <span class="cta">{{ t('common.actions.open') }}</span>
      </NuxtLink>

      <NuxtLink class="import-card" to="/dashboard/import/files">
        <h3>{{ t('import.categories.files.title') }}</h3>
        <Icon name="files" display="xxl" />
        <p>{{ t('import.categories.files.description') }}</p>
        <span class="cta">{{ t('common.actions.open') }}</span>
      </NuxtLink>

      <NuxtLink class="import-card" to="/dashboard/import/folder">
        <h3>{{ t('import.categories.folder.title') }}</h3>
        <Icon name="folder" display="xxl" />
        <p>{{ t('import.categories.folder.description') }}</p>
        <span class="cta">{{ t('common.actions.open') }}</span>
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const { t } = useI18nT();
</script>

<style scoped lang="scss">
.import-page {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-link {
  color: var(--primary);
  cursor: pointer;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.import-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-height: 185px;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-raised);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  h3 {
    margin: 0;
    font-size: 0.98rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.45;
    color: var(--text-secondary);
  }

  .cta {
    margin-top: auto;
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--primary);
  }

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 18px rgb(0 0 0 / 8%);
    transform: translateY(-2px);
  }

  .icon-app {
    width: 46px;
  }
}

@media (width <= 850px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
