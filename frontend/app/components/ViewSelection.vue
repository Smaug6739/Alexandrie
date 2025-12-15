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
</script>

<style scoped lang="scss">
.view-selection {
  display: flex;
  align-items: center;
  background: var(--bg-contrast);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  color: var(--font-color-light);
  cursor: pointer;
  transition: all $transition-duration $transition-duration;

  &:hover {
    color: var(--font-color);
    background: var(--bg-color);
  }

  &.active > svg {
    color: var(--primary) !important;
  }

  :deep(svg) {
    width: 18px;
    height: 18px;
    fill: currentColor;
  }
}
</style>
