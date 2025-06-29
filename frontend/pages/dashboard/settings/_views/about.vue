<template>
  <h1>About Alexandrie</h1>
  <p>
    <strong>Alexandrie version: {{ version }}</strong>
  </p>
  <p>
    <strong>Client: {{ isPWA ? 'PWA' : 'Website' }}</strong>
  </p>
</template>

<script setup lang="ts">
import pgk from '~/package.json';
const version = pgk.version || 'unknown';
const isPWA = !!window.matchMedia('(display-mode: standalone)').matches;
</script>
