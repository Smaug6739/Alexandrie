<template>
  <h1>Preferences</h1>
  <div v-for="(list, index) in options" :key="index">
    <h2>{{ list.label }}</h2>
    <div v-for="(option, index) in list.options" class="form-group">
      <label>{{ option.label }}</label>

      <!-- Toggle -->
      <AppToggle v-if="option.type === 'toggle'" :active="option.value" @toggle="toggleOption(option)" />

      <!-- Native select -->
      <select v-else-if="option.type === 'select'" v-model="option.value" @change="() => selectOption(option)">
        <option v-for="choice in option.choices" :key="choice.value" :value="choice.value">
          {{ choice.label }}
        </option>
      </select>
      <AppColorPicker v-else-if="option.type === 'color'" :selectedColor="option.value" @update:selected-color="option.onChange" />
    </div>
  </div>
  <hr />
  <div class="reset">
    <p>
      <span @click="preferencesStore.reset" style="color: var(--primary); cursor: pointer">Reset all preferences</span>
      to default. This will reset all your preferences, including the theme and settings
    </p>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const preferencesStore = usePreferences();

type OptionType = 'toggle' | 'select' | 'color';

interface BaseOption {
  label: string;
  type: OptionType;
  storageKey: PreferenceKey;
}

interface ToggleOption extends BaseOption {
  type: 'toggle';
  value: boolean;
  onToggle?: () => void;
}

interface ColorOption extends BaseOption {
  type: 'color';
  value: number;
  onChange?: (value: number) => void;
}

interface SelectOption extends BaseOption {
  type: 'select';
  value: number;
  choices: { label: string; value: number }[];
  onChange?: (value: number) => void;
}

type Option = ToggleOption | SelectOption | ColorOption;
console.log(preferencesStore.get('primaryColor'));
const options = ref<{ label: string; options: Option[] }[]>([
  {
    label: 'General',
    options: [
      {
        label: 'Enable Dark Mode',
        type: 'toggle',
        value: colorMode.value === 'dark',
        storageKey: 'darkMode',
        onToggle: () => (colorMode.value === 'light' ? (colorMode.preference = 'dark') : (colorMode.preference = 'light')),
      },
      {
        label: 'Choose primary color',
        type: 'color',
        value: Number(preferencesStore.get('primaryColor')),
        storageKey: 'primaryColor',
        onChange: (value: number) => {
          setAppColor(value);
          preferencesStore.set('primaryColor', value);
        },
      },
    ],
  },
  {
    label: 'Documents',
    options: [
      {
        label: 'Enable Print Mode',
        type: 'toggle',
        value: Boolean(preferencesStore.get('printMode')),
        storageKey: 'printMode',
      },
      {
        label: 'Hide Table of Content',
        type: 'toggle',
        value: Boolean(preferencesStore.get('hideTOC')),
        storageKey: 'hideTOC',
      },
      {
        label: 'Document size',
        type: 'select',
        value: preferencesStore.get('docSize'),
        storageKey: 'docSize',
        choices: [
          { label: 'Large', value: 0 },
          { label: 'Minimal', value: 1 },
        ],
      },
    ],
  },
  {
    label: 'Sidebar',
    options: [
      {
        label: 'Enable Compact Mode',
        type: 'toggle',
        value: Boolean(preferencesStore.get('compactMode')),
        storageKey: 'compactMode',
      },
      {
        label: 'View dock',
        type: 'toggle',
        value: Boolean(preferencesStore.get('view_dock')),
        storageKey: 'view_dock',
      },
      {
        label: 'Normalize file icons',
        type: 'toggle',
        value: Boolean(preferencesStore.get('normalizeFileIcons')),
        storageKey: 'normalizeFileIcons',
      },
      {
        label: 'Hide ressources',
        type: 'toggle',
        value: Boolean(preferencesStore.get('hideSidebarRessources')),
        storageKey: 'hideSidebarRessources',
      },
    ],
  },
  {
    label: 'Datatable',
    options: [
      {
        label: 'Default datatable items count',
        type: 'select',
        value: preferencesStore.get('datatableItemsCount'),
        storageKey: 'datatableItemsCount',
        choices: [
          { label: '10', value: 10 },
          { label: '30', value: 30 },
          { label: '50', value: 50 },
          { label: '100', value: 100 },
          { label: '250', value: 250 },
        ],
      },
    ],
  },
]);

const toggleOption = (option: ToggleOption) => {
  option.value = !option.value;
  preferencesStore.set(option.storageKey, option.value);
  option.onToggle?.();
};

const selectOption = (option: SelectOption) => {
  preferencesStore.set(option.storageKey, option.value);
  option.onChange?.(option.value);
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
  flex: 1;
}

select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: var(--bg-contrast);
  font-size: 0.95rem;
}
.reset {
  margin-top: 2rem;
}
</style>
