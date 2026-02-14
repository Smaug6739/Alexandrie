<template>
  <div>
    <h2 class="page-title">Preferences</h2>
    <p class="page-subtitle">Manage your preferences and settings.</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
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
];
</script>
