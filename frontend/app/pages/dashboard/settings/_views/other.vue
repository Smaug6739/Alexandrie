<template>
  <div>
    <h2 class="page-title">{{ t('settings.other.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.other.subtitle') }}</p>

    <AppPreferenceInputSection :options="options" />
  </div>
</template>

<script setup lang="ts">
type InterfaceOption = Option & {
  tag?: string;
};

const { t } = useI18nT();
const nodesTree = useNodesTree();
const categories = nodesTree.treeUpToRole(2).value;

const options = computed<Array<{ label: string; options: InterfaceOption[] }>>(() => [
  {
    label: t('settings.other.datatable'),
    options: [
      {
        label: t('settings.other.defaultItemsCount'),
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
    label: t('settings.other.uploads'),
    options: [
      {
        label: t('settings.other.defaultUploadFolder'),
        description: t('settings.other.defaultUploadFolderDesc'),
        type: 'select',
        key: 'defaultUploadFolder',
        choices: categories,
      },
    ],
  },
  {
    label: t('settings.other.otherSection'),
    options: [
      {
        label: t('settings.other.developerMode'),
        description: t('settings.other.developerModeDesc'),
        type: 'toggle',
        key: 'developerMode',
      },
    ],
  },
]);
</script>
