<template>
  <div class="preferences">
    <h2 class="ctitle">Preferences</h2>
    <p class="csubtitle">Manage your preferences and settings.</p>

    <div v-for="(section, i) in options" :key="i" class="section">
      <h3>{{ section.label }}</h3>

      <div v-for="opt in section.options" :key="opt.key" class="form-group">
        <div>
          <label
            >{{ opt.label }} <tag v-if="opt.tag" class="blue">{{ opt.tag }}</tag></label
          >

          <p class="description">{{ opt.description }}</p>
        </div>
        <!-- Toggle -->
        <AppToggle v-if="opt.type === 'toggle'" v-model="p(opt.key).value" class="entry" @update:model-value="opt.onChange?.(p(opt.key).value)" />

        <!-- Select -->
        <AppSelect
          v-else-if="opt.type === 'select'"
          v-model="p(opt.key).value"
          :items="opt.choices!"
          size="40%"
          class="entry"
          :searchable="false"
          @update:model-value="opt.onChange?.(p(opt.key).value)"
        />

        <!-- Radio -->
        <AppRadio
          v-else-if="opt.type === 'radio'"
          v-model="p(opt.key).value"
          :items="opt.choices!"
          class="entry"
          @update:model-value="opt.onChange?.(p(opt.key).value)"
        />

        <!-- Color -->
        <AppColorPicker v-else-if="opt.type === 'color'" v-model="p(opt.key).value" class="entry" @update:model-value="opt.onChange?.(p(opt.key).value)" />

        <!-- Group Checkbox -->
        <div v-else-if="opt.type === 'groupCheckbox'" class="group-checkbox">
          <div class="checkbox-grid">
            <label v-for="[key, label] of Object.entries(opt.items)" :key="key">
              <AppCheck v-model="p(opt.key).value[key]" @change="opt.onChange?.(p(opt.key).value)">{{ label }}</AppCheck>
            </label>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="reset">
      <p>
        You can reset your preferences in the
        <NuxtLink to="/dashboard/settings?p=advanced">advanced page</NuxtLink> settings. Be careful, this action cannot be undone.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const preferencesStore = usePreferences();
// @ts-expect-error unknown type
const p = preferencesStore.get as <K extends PreferenceKey>(key: K) => ReturnType<unknown>;

type InterfaceOption = Option & {
  tag?: string;
};

const colorMode = useColorMode();
const options: Array<{ label: string; options: InterfaceOption[] }> = [
  {
    label: 'General',
    options: [
      {
        label: 'Enable Dark Mode',
        type: 'toggle',
        key: 'darkMode',
        // @ts-expect-error -> specific type
        onChange: (option: boolean) => {
          colorMode.preference = option ? 'dark' : 'light';
          document.body.style.colorScheme = colorMode.preference;
        },
      },
      {
        label: 'Choose primary color',
        type: 'color',
        key: 'primaryColor',
        // @ts-expect-error -> specific type
        onChange: (option: number) => {
          setAppColor(option);
        },
      },
    ],
  },
  {
    label: 'Documents',
    options: [
      {
        label: 'Enable Print Mode',
        description: 'Simplify the header of printed documents (remove the thumbnail, tags, description and keep only the title)',
        type: 'toggle',
        key: 'printMode',
      },
      { label: 'Hide Table of Content', type: 'toggle', key: 'hideTOC' },
      { label: 'Enable Document auto-save', type: 'toggle', key: 'documentAutoSave' },
      {
        label: 'Document size',
        type: 'radio',
        key: 'docSize',
        choices: DOCUMENT_SIZES,
      },
      {
        label: 'Theme',
        description: 'Default theme used for documents. You can override it for each document individually.',
        type: 'select',
        key: 'theme',
        choices: DOCUMENT_THEMES,
      },
    ],
  },
  {
    label: 'Sidebar',
    options: [
      {
        label: 'Enable Compact Mode',
        description: 'Reduce the size of the sidebar items to show more content on the screen.',
        type: 'toggle',
        key: 'compactMode',
      },
      {
        label: 'View dock',
        description: 'Show the dock on the right side of the sidebar to access to the different apps quickly.',
        type: 'toggle',
        key: 'view_dock',
      },
      {
        label: 'Normalize file icons',
        description: 'Display file parents with the same icon as classic files (not in green)',
        type: 'toggle',
        key: 'normalizeFileIcons',
      },
      {
        label: 'Display uncategorized ressources',
        description: 'Show resources (uploads from CDN) that are not categorized at the top of the sidebar.',
        type: 'toggle',
        key: 'displayUncategorizedRessources',
      },
      { label: 'Hide ressources', type: 'toggle', key: 'hideSidebarRessources' },
      {
        label: 'Show items in Sidebar',
        type: 'groupCheckbox',
        key: 'sidebarItems',
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
    label: 'Editor',
    options: [
      {
        label: 'Editor font family',
        type: 'select',
        key: 'editorFontFamily',
        choices: EDITOR_FONTS,
      },
      {
        label: 'Editor font size',
        type: 'select',
        key: 'editorFontSize',
        choices: [
          { label: '12', id: 12 },
          { label: '14', id: 14 },
          { label: '16', id: 16 },
          { label: '18', id: 18 },
          { label: '20', id: 20 },
          { label: '22', id: 22 },
          { label: '24', id: 24 },
        ],
      },
      {
        label: 'Enable Spell Check',
        description: 'Enable spell check of browser in the editor. Changes may require a page reload to take effect.',
        type: 'toggle',
        key: 'editorSpellCheck',
      },
      {
        label: 'Display statistics bar',
        description: 'Show a small statistics bar at the top of the editor with word count, characters, and lines.',
        type: 'toggle',
        key: 'editorDisplayStats',
      },
      {
        label: 'Enable Snippets',
        tag: 'New',
        description: 'Enable or disable editor snippets functionality.',
        type: 'toggle',
        key: 'editorSnippetsEnabled',
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
  {
    label: 'Other',
    options: [
      {
        label: 'Developer Mode',
        description: 'Enable additional debugging features and options like "Copy ID" in context menus.',
        type: 'toggle',
        key: 'developerMode',
      },
    ],
  },
];
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

label {
  font-weight: 400;
  flex: 1;
}

.description {
  font-size: 0.9rem;
  color: var(--font-color-light);
  margin-top: 0.25rem;
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

  a {
    color: var(--primary);
    cursor: pointer;
    text-decoration: underline;
  }
}
</style>
