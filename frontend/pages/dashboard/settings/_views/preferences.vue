<template>
  <h1>Preferences</h1>
  <div v-for="(list, index) in options" :key="index">
    <h2>{{ list.label }}</h2>
    <div v-for="(option, index) in list.options" class="form-group">
      <label>{{ option.label }}</label>
      <AppToggle :active="option.value" @toggle="toggleOption(option)" />
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const preferencesStore = usePreferencesStore();

const options = ref([
  {
    label: 'General',
    options: [
      {
        label: 'Enable Dark Mode',
        value: colorMode.value === 'dark',
        storageKey: 'darkMode' as const,
        onToggle: () => (colorMode.value === 'light' ? (colorMode.preference = 'dark') : (colorMode.preference = 'light')),
      },
    ],
  },
  {
    label: 'Documents',
    options: [
      {
        label: 'Enable Print Mode',
        value: Boolean(preferencesStore.get('printMode')),
        storageKey: 'printMode' as const,
      },
      {
        label: 'Hide Table of Content',
        value: Boolean(preferencesStore.get('hideTOC')),
        storageKey: 'hideTOC' as const,
      },
    ],
  },
  {
    label: 'Sidebar',
    options: [
      {
        label: 'Enable Compact Mode',
        value: Boolean(preferencesStore.get('compactMode')),
        storageKey: 'compactMode' as const,
      },
      {
        label: 'Normalize file icons',
        value: Boolean(preferencesStore.get('normalizeFileIcons')),
        storageKey: 'normalizeFileIcons' as const,
      },
      {
        label: 'Hide ressources',
        value: Boolean(preferencesStore.get('hideSidebarRessources')),
        storageKey: 'hideSidebarRessources' as const,
      },
    ],
  },
]);
interface Option {
  label: string;
  value: boolean;
  storageKey: PreferenceKey;
  onToggle?: () => void;
}

const toggleOption = (option: Option) => {
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
