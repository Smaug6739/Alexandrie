<template>
  <div class="preferences">
    <h2 class="page-title">Preferences</h2>
    <p class="page-subtitle">Manage your preferences and settings.</p>

    <div v-for="(section, i) in options" :key="i" class="section">
      <h3>{{ section.label }}</h3>

      <AppPreferenceInput v-for="opt in section.options" :key="opt.key" :opt="opt" />
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
import { DOCUMENT_SIZES, DOCUMENT_THEMES, EDITOR_FONTS } from '~/helpers/constants';

const appColors = useAppColors();

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
        label: 'Choose accent color',
        type: 'color',
        key: 'primaryColor',
        // @ts-expect-error -> specific type
        onChange: (option: number) => {
          appColors.setAppColor(option);
        },
      },
      {
        label: 'Interface style',
        description: 'Glassmorphism adds transparent surfaces with blur effects for a modern glass look.',
        type: 'radio',
        key: 'style',
        tag: 'New',
        choices: [
          { label: 'Default', id: 'default' },
          { label: 'Glassmorphism', id: 'glassmorphism' },
        ],
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
        label: 'Display uncategorized resources',
        description: 'Show resources (uploads from CDN) that are not categorized at the top of the sidebar.',
        type: 'toggle',
        key: 'displayUncategorizedResources',
      },
      { label: 'Hide resources', type: 'toggle', key: 'hideSidebarResources' },
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
    label: 'Navbar',
    options: [
      {
        label: 'Which items to display in the navbar',
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
        description: 'Enable or disable editor snippets functionality.',
        type: 'toggle',
        key: 'editorSnippetsEnabled',
      },
      {
        label: 'Simplified view for mobile',
        tag: 'New',
        description: 'Enable a simplified editor view on mobile devices for better usability.',
        type: 'toggle',
        key: 'editorSimplifiedViewOnMobile',
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

label {
  font-weight: 400;
  flex: 1;
}

.description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-left: 2px;
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
