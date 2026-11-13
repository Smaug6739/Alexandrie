<template>
  <div class="view-selection">
    <button v-for="option in viewOptions" :key="option.value" :class="{ active: view === option.value }" @click="selectView(option.value)">
      <Icon :name="option.icon" />
      <p class="hint-tooltip">{{ option.label }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import localForage from 'localforage';
export type ViewMode = 'kanban' | 'list' | 'table' | 'advanced';

const props = withDefaults(
  defineProps<{
    showKanban?: boolean;
    /** View configured on the parent node; takes precedence over the user's last selection */
    defaultView?: string;
  }>(),
  {
    showKanban: false,
    defaultView: undefined,
  },
);

const { t } = useI18nT();
const preferences = usePreferencesStore();
const view = defineModel<ViewMode>();

const viewOptions = computed(() => {
  const options = [
    { icon: 'table', label: t('components.viewSelection.list'), value: 'list' as ViewMode },
    { icon: 'list', label: t('components.viewSelection.table'), value: 'table' as ViewMode },
  ];
  if (preferences.get('advancedView').value) {
    options.push({ icon: 'grid', label: 'Advanced', value: 'advanced' as ViewMode });
  }
  if (props.showKanban) {
    options.push({ icon: 'kanban', label: t('components.viewSelection.kanban'), value: 'kanban' as ViewMode });
  }
  return options;
});

// Keep the user's saved choice even when this container cannot display it.
const knownViews: ViewMode[] = ['table', 'list', 'advanced', 'kanban'];
const isKnownView = (value: unknown): value is ViewMode => typeof value === 'string' && knownViews.includes(value as ViewMode);

const preferredView = ref<ViewMode>(isKnownView(props.defaultView) ? props.defaultView : 'table');
let userSelectedView = false;
const effectiveView = computed<ViewMode>(() =>
  viewOptions.value.some(option => option.value === preferredView.value) ? preferredView.value : 'table',
);

watch(effectiveView, newView => (view.value = newView), { immediate: true });

function selectView(newView: ViewMode) {
  userSelectedView = true;
  preferredView.value = newView;
  localForage.setItem('viewSelection', newView);
}

// A view configured on the parent node wins over the user's last selection, also when it is changed while the page is open.
watch(
  () => props.defaultView,
  newDefault => {
    if (isKnownView(newDefault)) preferredView.value = newDefault;
  },
);

onMounted(async () => {
  const storedView = await localForage.getItem<unknown>('viewSelection');
  if (!userSelectedView && !isKnownView(props.defaultView) && isKnownView(storedView)) {
    preferredView.value = storedView;
  }
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
