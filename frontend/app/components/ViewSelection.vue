<template>
  <div class="view-selection">
    <button v-for="option in viewOptions" :key="option.value" :class="{ active: view === option.value }" @click="view = option.value">
      <Icon :name="option.icon" />
      <p class="hint-tooltip">{{ option.label }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
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
  if (newView) localStorage.setItem('viewSelection', newView);
});

onMounted(() => {
  const storedView = localStorage.getItem('viewSelection');
  const list = ['table', 'list'];
  if (props.showKanban) list.push('kanban');
  if (storedView && list.includes(storedView)) view.value = storedView as ViewMode;
  else view.value = 'table';
});
</script>

<style scoped lang="scss">
.view-selection {
  display: flex;
  padding: 3px;
  border-radius: var(--radius-sm);
  background: var(--surface-raised);
  align-items: center;
  gap: 2px;
}

button {
  display: flex;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  background: transparent;
  transition:
    color $transition-fast,
    background $transition-fast;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  position: relative;

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
