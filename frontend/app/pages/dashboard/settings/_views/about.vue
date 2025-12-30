<template>
  <div>
    <h2 class="app-title">About Alexandrie</h2>
    <IconApp width="150px" height="150px" style="float: right" />
    <p class="app-subtitle">Information about the application.</p>
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
      <NuxtLink to="https://github.com/Smaug6739/Alexandrie" target="_blank" style="font-weight: bold; color: var(--primary)">GitHub repository</NuxtLink>.
    </p>
    <h3>Changelog v8.3.0</h3>
    <ul>
      <li>Improved search functionality with body search (open command center -> advanced tab)</li>
      <li>New dashboard home page to enhance user experience and continue working on your documents</li>
      <li>New modern interface and mobile experience improved</li>
      <li>New Kanban view for categories and workspaces</li>
      <li>Fixed various bugs and improved overall stability</li>
      <li>New snippets system to enhance note-taking and organization</li>
    </ul>
    <p style="display: flex; gap: 5px">
      See the full changelog on
      <span style="display: flex; align-items: center">
        <NuxtLink to="https://github.com/Smaug6739/Alexandrie/releases/tag/v8.3.0" target="_blank" style="font-weight: bold; color: var(--primary)"
          >GitHub</NuxtLink
        ><Icon name="new_tab" display="sm" /></span
      >.
    </p>
  </div>
</template>

<script setup lang="ts">
import pgk from '~/../package.json';
const version = pgk.version || 'unknown';
const isPWA = !!window.matchMedia('(display-mode: standalone)').matches;
</script>
