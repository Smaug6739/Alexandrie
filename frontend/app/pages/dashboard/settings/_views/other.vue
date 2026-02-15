<template>
  <div>
    <h2 class="page-title">Other</h2>
    <p class="page-subtitle">Manage other general settings for the application.</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
type InterfaceOption = Option & {
  tag?: string;
};

const nodesTree = useNodesTree();
const categories = nodesTree.treeUpToRole(2).value;

const options: Array<{ label: string; options: InterfaceOption[] }> = [
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
    label: 'Uploads',
    options: [
      {
        label: 'Default upload folder',
        description: 'Choose the default folder where your uploads will be stored. You can change this for each upload.',
        type: 'select',
        key: 'defaultUploadFolder',
        choices: categories,
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
