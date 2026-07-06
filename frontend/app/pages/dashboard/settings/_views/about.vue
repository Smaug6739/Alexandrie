<template>
  <div>
    <h2 class="page-title">{{ t('settings.about.title') }}</h2>
    <IconApp width="150px" height="150px" style="float: right" />
    <p class="page-subtitle">{{ t('settings.about.subtitle') }}</p>
    <p>
      <strong>{{ t('settings.about.version') }}: {{ version }}</strong>
    </p>
    <p>
      <strong>{{ t('settings.about.client') }}: {{ isPWA ? t('settings.about.pwa') : t('settings.about.website') }}</strong>
    </p>
    <p>
      {{ t('settings.about.description') }} <br />
      {{ t('settings.about.features') }} <br />
      {{ t('settings.about.contact') }}
      <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" style="font-weight: bold; color: var(--primary)">{{
        t('settings.about.githubRepo')
      }}</NuxtLink
      >.
    </p>
    <h3>{{ t('settings.about.changelog') }} v8.10.0</h3>
    <ul>
      <li>Support full offline mode 🎉</li>
      <li>New UI design, more options and performances improvments 🎉</li>
      <li>New team structure to manage projects, organisations etc. with improved collaboration features 🎉</li>
      <li>Support 2FA authentication</li>
      <li>Import full folders from your device</li>
    </ul>
    <p style="display: flex; gap: 5px">
      {{ t('settings.about.seeFullChangelog') }}
      <span style="display: flex; align-items: center">
        <NuxtLink to="https://github.com/Smaug6739/Alexandrie/releases/tag/v8.10.0" target="_blank" style="font-weight: bold; color: var(--primary)"
          >GitHub</NuxtLink
        >
        <Icon name="new_tab" display="sm" /></span
      >.
    </p>
  </div>
</template>

<script setup lang="ts">
import pgk from '~/../package.json';
const version = pgk.version || 'unknown';
const isPWA = !!window.matchMedia('(display-mode: standalone)').matches;
const { t } = useI18nT();
</script>
