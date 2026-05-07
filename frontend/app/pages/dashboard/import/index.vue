<template>
  <div class="import-page page-card">
    <header>
      <h1 style="font-size: 20px">{{ t('import.meta.title') }} <tag class="orange">Beta</tag></h1>
    </header>
    <p>
      {{ t('import.meta.description') }}
      <NuxtLink to="/dashboard/settings?p=backup" style="color: var(--primary)">{{ t('import.meta.settingsLink') }}</NuxtLink
      >.
    </p>
    <div class="container">
      <NuxtLink class="import-card" to="/dashboard/import/backup">
        <h3>Alexandrie</h3>
        <IconApp style="width: 100px" />
        <p>Import your backup files to restore your data.</p>
      </NuxtLink>
      <NuxtLink class="import-card" to="/dashboard/import/files">
        <h3>Markdown</h3>
        <span v-html="icons.markdown"></span>
        <p>Import your Markdown files to add them to the knowledge base.</p>
      </NuxtLink>
      <NuxtLink class="import-card" to="/dashboard/import/files">
        <h3>Other</h3>
        <span v-html="icons.other"></span>
        <p>Import other file types.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const { t } = useI18nT();

const icons = {
  markdown: `<svg xmlns="http://www.w3.org/2000/svg"  width="75" height="100" viewBox="0 0 471 289.85"><path fill="currentColor" d="M437,289.85H34a34,34,0,0,1-34-34V34A34,34,0,0,1,34,0H437a34,34,0,0,1,34,34V255.88A34,34,0,0,1,437,289.85ZM34,22.64A11.34,11.34,0,0,0,22.64,34V255.88A11.34,11.34,0,0,0,34,267.2H437a11.34,11.34,0,0,0,11.33-11.32V34A11.34,11.34,0,0,0,437,22.64Z"/><path fill="currentColor" d="M67.93,221.91v-154h45.29l45.29,56.61L203.8,67.93h45.29v154H203.8V133.6l-45.29,56.61L113.22,133.6v88.31Zm283.06,0-67.94-74.72h45.29V67.93h45.29v79.26h45.29Z"/></svg>`,
  other: `<svg xmlns="http://www.w3.org/2000/svg" width="75" height="100" viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,9V3.5L18.5,9H13M6,4H12V10H18V20H6V4Z"/></svg>`,
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  gap: 1rem;
}

.import-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0.5rem;
  p {
    margin: 0 0.5rem;
    text-align: center;
  }
  &:hover {
    border-color: var(--primary);
    background-color: var(--surface-raised);
  }
}
</style>
