<template>
  <div class="pro-tip"><Icon name="tip" fill="var(--primary)" />{{ tips[Math.floor(Math.random() * tips.length)] }}</div>
</template>

<script setup lang="ts">
const tips = [
  'Open command center (Ctrl + K) to navigate quickly.',
  'Organize your notes with workspaces for better productivity.',
  'Directly paste or drop files into the editor.',
  'Customize the app display or behavior in the settings.',
  'Add custom snippets in the settings for productivity.',
  'Use HTML and CSS for advanced formatting.',
  'Export instantly your data in settings to create backups.',
];
</script>

<style scoped lang="scss">
.pro-tip {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  gap: 6px;
}
</style>
