<template>
  <div class="import-page page-card">
    <header>
      <div>
        <h1>{{ t('import.meta.title') }} <tag class="orange">Beta</tag></h1>
        <p class="subtitle">
          {{ t('import.meta.description') }}
          <NuxtLink to="/dashboard/settings?p=backup">{{ t('import.meta.settingsLink') }}</NuxtLink
          >.
        </p>
      </div>
    </header>

    <section class="cards-grid">
      <NuxtLink class="import-card" to="/dashboard/import/backup">
        <div class="top">
          <h3>{{ t('import.categories.backup.title') }}</h3>
          <tag class="green">{{ t('common.labels.basic') }}</tag>
        </div>
        <IconApp class="icon-app" />
        <p>{{ t('import.categories.backup.description') }}</p>
        <span class="cta">{{ t('common.actions.open') }}</span>
      </NuxtLink>

      <NuxtLink class="import-card" to="/dashboard/import/files">
        <div class="top">
          <h3>{{ t('import.categories.files.title') }}</h3>
          <tag class="green">{{ t('common.labels.basic') }}</tag>
        </div>
        <Icon name="files" display="xxl" />
        <p>{{ t('import.categories.files.description') }}</p>
        <span class="cta">{{ t('common.actions.open') }}</span>
      </NuxtLink>

      <NuxtLink class="import-card" to="/dashboard/import/advanced">
        <div class="top">
          <h3>{{ t('import.categories.advanced.title') }}</h3>
          <tag class="orange">{{ t('common.labels.advanced') }}</tag>
        </div>
        <Icon name="advanced" display="xxl" />
        <p>{{ t('import.categories.advanced.description') }}</p>
        <span class="cta">{{ t('common.actions.preview') }}</span>
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

.cards-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.import-card {
  display: flex;
  min-height: 185px;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface-raised);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  flex-direction: column;
  gap: 0.65rem;

  .top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    justify-content: space-between;
  }

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
    font-size: 0.84rem;
    font-weight: 600;
    color: var(--primary);
    margin-top: auto;
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
