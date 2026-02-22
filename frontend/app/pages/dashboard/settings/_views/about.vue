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
    <h3>{{ t('settings.about.changelog') }} v8.7.0</h3>
    <ul>
      <li>Support french interface 🎉</li>
      <li>Save preferences and snippets in database 🎉</li>
      <li>Improve editor with new plugins and colorization</li>
      <li>Improve uploads management across the app</li>
      <li>Add text layer support for PDF viewer</li>
      <li>Fix various bugs, improve stability and accessibility</li>
    </ul>
    <p style="display: flex; gap: 5px">
      {{ t('settings.about.seeFullChangelog') }}
      <span style="display: flex; align-items: center">
        <NuxtLink to="https://github.com/Smaug6739/Alexandrie/releases/tag/v8.7.0" target="_blank" style="font-weight: bold; color: var(--primary)"
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
