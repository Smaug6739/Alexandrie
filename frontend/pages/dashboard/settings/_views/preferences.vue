<template>
  <h1>Preferences</h1>
  <div v-for="(option, index) in options" :key="option.id" class="form-group">
    <label :for="option.id">{{ option.label }}</label>
    <AppToggle :active="option.value" @toggle="toggleOption(index)" />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const preferencesStore = usePreferencesStore();

const options = ref([
  {
    id: 'print-mode-toggle',
    label: 'Enable Print Mode',
    value: Boolean(preferencesStore.get('printMode')),
    storageKey: 'printMode' as const,
  },
  {
    id: 'dark-mode-toggle',
    label: 'Enable Dark Mode',
    value: colorMode.value === 'dark',
    storageKey: 'darkMode' as const,
    onToggle: () => (colorMode.value === 'light' ? (colorMode.preference = 'dark') : (colorMode.preference = 'light')),
  },
  {
    id: 'hide-toc',
    label: 'Hide Table of Content',
    value: Boolean(preferencesStore.get('hideTOC')),
    storageKey: 'hideTOC' as const,
  },
  {
    id: 'compact-mode',
    label: 'Enable Compact Mode',
    value: Boolean(preferencesStore.get('compactMode')),
    storageKey: 'compactMode' as const,
  },
]);

const toggleOption = (index: number) => {
  const option = options.value[index];
  if (!option) return;
  option.value = !option.value;
  preferencesStore.set({ key: option.storageKey, value: option.value });
  if (option.onToggle) option.onToggle();
};
</script>

<style scoped lang="scss">
.form-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
label {
  font-weight: 500;
}
</style>
