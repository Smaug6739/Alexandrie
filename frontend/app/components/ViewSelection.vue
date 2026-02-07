<template>
  <div class="view-selection">
    <button v-for="option in viewOptions" :key="option.value" :class="{ active: view === option.value }" :title="option.label" @click="view = option.value">
      <Icon :name="option.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
export type ViewMode = 'list' | 'table' | 'kanban';

const props = withDefaults(
  defineProps<{
    showKanban?: boolean;
  }>(),
  {
    showKanban: false,
  },
);

const view = defineModel<ViewMode>();

const viewOptions = computed(() => {
  const options = [
    { value: 'list' as ViewMode, icon: 'table', label: 'Grid view' },
    { value: 'table' as ViewMode, icon: 'list', label: 'List view' },
  ];
  if (props.showKanban) {
    options.push({ value: 'kanban' as ViewMode, icon: 'kanban', label: 'Kanban view' });
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
  border-radius: $radius-sm;
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
  border-radius: $radius-sm;
  color: var(--text-secondary);
  background: transparent;
  transition:
    color 0.2s,
    background 0.2s;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    color: var(--text-body);
    background: var(--surface-base);
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
