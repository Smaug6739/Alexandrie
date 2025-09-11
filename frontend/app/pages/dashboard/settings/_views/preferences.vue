<template>
  <div class="preferences">
    <h2 class="ctitle">Preferences</h2>
    <p class="csubtitle">Manage your preferences and settings.</p>

    <div v-for="(section, i) in options" :key="i" class="section">
      <h3>{{ section.label }}</h3>

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
      { label: 'Enable Document Auto-save', type: 'toggle', key: 'documentAutoSave', value: Boolean(preferencesStore.get('documentAutoSave')) },
      {
        label: 'Document size',
        type: 'radio',
        key: 'docSize',
        value: Number(preferencesStore.get('docSize')),
        choices: DOCUMENT_SIZES,
      },
      {
        label: 'Theme',
        type: 'select',
        key: 'theme',
        value: String(preferencesStore.get('theme')),
        choices: DOCUMENT_THEMES,
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
      },
    ],
  },
  {
    label: 'Nabvar',
    options: [
      {
        label: 'Show items in navbar',
        type: 'groupCheckbox',
        key: 'navbarItems',
        value: {
          breadcrumb: true,
          search: true,
          theme: true,
          navigation: true,
        },
        items: {
          breadcrumb: 'Breadcrumb',
          search: 'Search',
          theme: 'Theme',
          navigation: 'Navigation',
        },
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
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

label {
  font-weight: 400;
  flex: 1;
}

h3 {
  margin: 3rem 0 0.5rem;
  font-weight: 500;
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
