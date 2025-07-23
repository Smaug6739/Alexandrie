<template>
  <h1>About Alexandrie</h1>
  <p>
    <strong>Alexandrie version: {{ version }}</strong>
  </p>
  <p>
    <strong>Client: {{ isPWA ? 'PWA' : 'Website' }}</strong>
  </p>
  <p>
    Alexandrie is a personal knowledge management tool designed to help you organize and retrieve your notes efficiently. <br />
    It offers a range of features including document organization, tagging, and advanced search capabilities. <br />
    If you have any questions, suggestions or if you found a bug, please feel free to reach out to us! You can create an issue on the
    <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" style="color: var(--primary); font-weight: bold">GitHub repository</NuxtLink>.
  </p>
</template>

<script setup lang="ts">
import pgk from '@/../package.json';
const version = pgk.version || 'unknown';
const isPWA = !!window.matchMedia('(display-mode: standalone)').matches;
</script>
