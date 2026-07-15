<template>
  <div class="view-selection">
    <button v-for="option in viewOptions" :key="option.value" :class="{ active: view === option.value }" @click="view = option.value">
      <Icon :name="option.icon" />
      <p class="hint-tooltip">{{ option.label }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import localForage from 'localforage';
export type ViewMode = 'kanban' | 'list' | 'table';

const props = withDefaults(
  defineProps<{
    showKanban?: boolean;
  }>(),
  {
    showKanban: false,
  },
);

const { t } = useI18nT();
const view = defineModel<ViewMode>();

const viewOptions = computed(() => {
  const options = [
    { icon: 'table', label: t('components.viewSelection.list'), value: 'list' as ViewMode },
    { icon: 'list', label: t('components.viewSelection.table'), value: 'table' as ViewMode },
  ];
  if (props.showKanban) {
    options.push({ icon: 'kanban', label: t('components.viewSelection.kanban'), value: 'kanban' as ViewMode });
  }
  return options;
});

watch(view, newView => {
  if (newView) localForage.setItem('viewSelection', newView);
});

onMounted(async () => {
  const storedView = await localForage.getItem<ViewMode>('viewSelection');
  const list = ['table', 'list'];
  if (props.showKanban) list.push('kanban');
  if (storedView && list.includes(storedView)) view.value = storedView as ViewMode;
  else view.value = 'table';
});
</script>

<style scoped lang="scss">
.view-selection {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
}

button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  transition:
    color $transition-fast,
    background $transition-fast;

  &:hover {
    color: var(--text-body);
    background: var(--surface-base);

    .hint-tooltip {
      opacity: 1;
      visibility: visible;
    }
  }

  &.active > svg {
    color: var(--primary) !important;
  }

  :deep(svg) {
    width: 18px;
    height: 18px;
    fill: currentcolor;
  }
}
</style>
