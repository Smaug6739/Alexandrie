<!-- preferences.vue -->
<template>
  <div class="preferences">
    <h1>Preferences</h1>

    <div v-for="(section, i) in options" :key="i" class="section">
      <h2>{{ section.label }}</h2>

      <div v-for="opt in section.options" :key="opt.key" class="form-group">
        <label>{{ opt.label }}</label>
        <!-- Toggle -->
        <AppToggle
          v-if="opt.type === 'toggle'"
          v-model="prefs[opt.key] as boolean"
          class="entry"
          @update:model-value="opt.onChange?.(prefs[opt.key] as boolean)"
        />

        <!-- Select -->
        <AppSelect
          v-else-if="opt.type === 'select'"
          v-model="prefs[opt.key] as string | number"
          :items="opt.choices!"
          size="40%"
          class="entry"
          @update:model-value="opt.onChange?.(prefs[opt.key] as string | number)"
        />

        <!-- Radio -->
        <AppRadio
          v-else-if="opt.type === 'radio'"
          v-model="prefs[opt.key] as string | number"
          :items="opt.choices!"
          class="entry"
          @update:model-value="opt.onChange?.(prefs[opt.key] as string | number)"
        />

        <!-- Color -->
        <AppColorPicker
          v-else-if="opt.type === 'color'"
          v-model="prefs[opt.key] as number"
          class="entry"
          @update:model-value="opt.onChange?.(prefs[opt.key] as number)"
        />

        <div v-else-if="opt.type === 'groupCheckbox'" class="group-checkbox">
          <div class="checkbox-grid">
            <label v-for="(label, key) in opt.items" :key="key">
              <AppCheck
                v-model="(prefs[opt.key] as Record<string, boolean>)[key] as boolean"
                @change="opt.onChange?.(prefs[opt.key] as Record<string, boolean>)"
                >{{ label }}</AppCheck
              >
            </label>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="reset">
      <p>
        <span style="color: var(--primary); cursor: pointer" @click="preferencesStore.reset"> Reset all preferences </span>
        to default.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const preferencesStore = usePreferences();
const prefs = preferencesStore.all;
const colorMode = useColorMode();
// --- Définition déclarative des options ---
const options = ref<{ label: string; options: Option[] }[]>([
  {
    label: 'General',
    options: [
      {
        label: 'Enable Dark Mode',
        type: 'toggle',
        value: Boolean(preferencesStore.get('darkMode')),
        key: 'darkMode',
        onChange: (option: boolean) => {
          colorMode.preference = option ? 'dark' : 'light';
        },
      },
      {
        label: 'Choose primary color',
        type: 'color',
        key: 'primaryColor',
        value: Number(preferencesStore.get('primaryColor')),
        onChange: (option: number) => {
          console.log('Primary color changed to:', option);
          setAppColor(option);
        },
      },
    ],
  },
  {
    label: 'Documents',
    options: [
      { label: 'Enable Print Mode', type: 'toggle', key: 'printMode', value: Boolean(preferencesStore.get('printMode')) },
      { label: 'Hide Table of Content', type: 'toggle', key: 'hideTOC', value: Boolean(preferencesStore.get('hideTOC')) },
      {
        label: 'Document size',
        type: 'radio',
        key: 'docSize',
        value: Number(preferencesStore.get('docSize')),
        choices: [
          { label: 'Large', id: 0 },
          { label: 'Minimal', id: 1 },
        ],
      },
      {
        label: 'Theme',
        type: 'select',
        key: 'theme',
        value: String(preferencesStore.get('theme')),
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
      { label: 'Enable Compact Mode', type: 'toggle', key: 'compactMode', value: Boolean(preferencesStore.get('compactMode')) },
      { label: 'View dock', type: 'toggle', key: 'view_dock', value: Boolean(preferencesStore.get('view_dock')) },
      { label: 'Normalize file icons', type: 'toggle', key: 'normalizeFileIcons', value: Boolean(preferencesStore.get('normalizeFileIcons')) },
      { label: 'Hide ressources', type: 'toggle', key: 'hideSidebarRessources', value: Boolean(preferencesStore.get('hideSidebarRessources')) },
      {
        label: 'Show items in Sidebar',
        type: 'groupCheckbox',
        key: 'sidebarItems',
        value: {
          manageCategories: true,
          cdn: true,
          settings: true,
          home: true,
          importation: false,
          documents: true,
          newPage: false,
        },
        items: {
          manageCategories: 'Manage Categories',
          importation: 'Importation',
          cdn: 'CDN',
          documents: 'Documents',
          settings: 'Settings',
          home: 'Home',
          newPage: 'New Page',
        },
        onChange: val => console.log('Sidebar items changed', val),
      },
    ],
  },
  {
    label: 'Datatable',
    options: [
      {
        label: 'Default datatable items count',
        type: 'select',
        key: 'datatableItemsCount',
        value: Number(preferencesStore.get('datatableItemsCount')),
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
</script>

<style scoped lang="scss">
.preferences {
  margin: auto;
}

.section {
  width: 100%;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.2em;
  margin-bottom: 1rem;
}

label {
  font-weight: 700;
  flex: 1;
}

.entry {
  max-width: 400px;
  margin-left: auto;
}

.group-checkbox {
  .checkbox-grid {
    display: grid;
    gap: 0.5rem 3rem;
    grid-template-columns: repeat(2, 1fr);
  }
}

.reset {
  margin-top: 2rem;
}
</style>
