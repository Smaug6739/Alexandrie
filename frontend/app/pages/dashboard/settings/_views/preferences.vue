<template>
  <div>
    <h1>Preferences</h1>
    <div v-for="(list, index) in options" :key="index">
      <h2>{{ list.label }}</h2>
      <div v-for="option in list.options" :key="option.label" class="form-group">
        <label>{{ option.label }}</label>

        <!-- Toggle -->
        <AppToggle v-if="option.type === 'toggle'" :active="option.value" @toggle="toggleOption(option)" />

        <!-- Native select -->
        <AppSelect v-else-if="option.type === 'select'" v-model="option.value" :items="option.choices" size="40%" @update:model-value="o => selectOption({ ...option, value: o })" />
        <AppColorPicker v-else-if="option.type === 'color'" :selected-color="option.value" @update:selected-color="option.onChange" />
      </div>
    </div>
    <hr />
    <div class="reset">
      <p>
        <span style="color: var(--primary); cursor: pointer" @click="preferencesStore.reset">Reset all preferences</span>
        to default. This will reset all your preferences, including the theme and settings
      </p>
    </div>
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
  value: number | string;
  choices: ANode[];
  onChange?: (value: number | string) => void;
}

type Option = ToggleOption | SelectOption | ColorOption;
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
        value: preferencesStore.get('docSize') as number,
        storageKey: 'docSize',
        choices: [
          { label: 'Large', id: 0 },
          { label: 'Minimal', id: 1 },
        ],
      },
      {
        label: 'Theme',
        type: 'select',
        value: preferencesStore.get('theme') as string,
        storageKey: 'theme',
        choices: [
          { label: 'Alexandrie', id: 'alexandrie' },
          { label: 'Latex style', id: 'latex' },
          { label: 'Latex colored', id: 'latex-colored' },
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
        value: preferencesStore.get('datatableItemsCount') as number,
        storageKey: 'datatableItemsCount',
        choices: [
          { label: '10', id: 10 },
          { label: '30', id: 30 },
          { label: '50', id: 50 },
          { label: '100', id: 100 },
          { label: '250', id: 250 },
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
h2 {
  font-size: 1.2em;
}
label {
  font-weight: 700;
  flex: 1;
}

.reset {
  margin-top: 2rem;
}
</style>
