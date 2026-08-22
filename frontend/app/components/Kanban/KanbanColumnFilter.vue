<template>
  <div ref="root" class="filter-component">
    <AppBtnIcon ref="trigger" display="md" nav icon="filter" :tooltip="t('nodes.filter.title')" @click="toggle">
      <span v-if="filtered.length != nodes?.length" class="bubble"></span>
    </AppBtnIcon>

    <Teleport to="body">
      <Transition name="pop">
        <div
          v-if="opened"
          ref="panel"
          class="filter-panel"
          role="dialog"
          :aria-label="t('nodes.filter.title')"
          :style="panelStyle"
          @keydown.esc.prevent="close"
        >
          <!-- Search -->
          <div>
            <label>{{ t('common.actions.search') }}</label>
            <input ref="inputRef" v-model="options.query" />
          </div>

          <div>
            <label>Status</label>
            <AppSelect v-model="options.kanbanAssignStatus" :items="STATUS_OPTIONS" />
          </div>

          <!-- Sort & Match -->
          <div class="row">
            <label class="row">
              <input v-model="sortOrder" type="radio" value="ascending" />
              <span>{{ t('components.filter.ascending') }}</span>
            </label>

            <label class="row">
              <input v-model="sortOrder" type="radio" value="descending" />
              <span>{{ t('components.filter.descending') }}</span>
            </label>
          </div>

          <div class="panel-actions">
            <button class="btn" type="button" @click="reset">
              {{ t('common.actions.reset') }}
            </button>
          </div>

          <div class="panel-footer">
            <small>
              {{ t('nodes.filter.footer', { count: filtered.length, total: props.nodes.length }) }}
            </small>
            <small>• <kbd>esc</kbd> {{ t('nodes.filter.toClose') }}</small>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { Node, SearchOptions } from '~/stores';

const props = defineProps<{ nodes: Node[]; boardId: string }>();
const emit = defineEmits<{ (e: 'update:nodes', v: Node[]): void }>();

const preferencesStore = usePreferencesStore();

const sortOrder = preferencesStore.get('sortOrder');

const DEFAULT_OPTIONS: SearchOptions = {
  query: '',
  matchMode: 'includes',
  kanbanAssignStatus: 'all',
  boardId: props.boardId,
};

const { t } = useI18nT();
const store = useNodesStore();
const route = useRoute();
const router = useRouter();

const options = ref<SearchOptions>({ ...DEFAULT_OPTIONS });
const opened = ref(false);

const inputRef = ref<HTMLInputElement | null>(null);
const root = ref<HTMLDivElement | null>(null);
const panelStyle = ref<Record<string, string>>({});

const STATUS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'unassigned', label: 'Unassigned' },
];

const filtered = computed(() => store.search(options.value, props.nodes));

const updatePanelPosition = () => {
  if (!root.value) return;

  const button = root.value.querySelector('button');
  if (!button) return;

  const rect = button.getBoundingClientRect();

  panelStyle.value = {
    top: `${rect.bottom + 4}px`,
    right: `${window.innerWidth - rect.right - 200}px`,
  };
};

const toggle = () => {
  opened.value = !opened.value;

  if (opened.value) {
    nextTick(() => {
      updatePanelPosition();
      inputRef.value?.focus();
    });
  }
};

const close = () => (opened.value = false);

const reset = () => {
  options.value = { ...DEFAULT_OPTIONS, tags: [] };

  if (route.query.tags) {
    router.replace({
      query: {
        ...route.query,
        tags: undefined,
      },
    });
  }
};

watchEffect(() => {
  if (props.nodes) {
    emit('update:nodes', filtered.value);
  }
});

function outsideHandler(e: MouseEvent) {
  const target = e.target as HTMLElement;

  if (root.value && !root.value.contains(target)) {
    const panel = document.querySelector('.filter-panel');

    if (!panel?.contains(target)) close();
  }
}

watch(opened, isOpened => {
  if (isOpened) {
    document.addEventListener('click', outsideHandler);
    window.addEventListener('resize', updatePanelPosition);
    window.addEventListener('scroll', updatePanelPosition, true);
  } else {
    document.removeEventListener('click', outsideHandler);
    window.removeEventListener('resize', updatePanelPosition);
    window.removeEventListener('scroll', updatePanelPosition, true);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', outsideHandler);
  window.removeEventListener('resize', updatePanelPosition);
  window.removeEventListener('scroll', updatePanelPosition, true);
});
</script>

<style scoped lang="scss">
.filter-component {
  position: relative;
  display: inline-block;
}

.filter-panel {
  position: fixed;
  z-index: 10;
  width: 320px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  box-shadow: var(--shadow-lg);
}

.row {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin: 4px 0;
}

kbd {
  padding: 2px 4px;
}

label {
  margin-bottom: 6px;
  font-size: 13px;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
}

.panel-footer {
  margin-top: 8px;
  color: var(--muted);
}

/* small pop animation */
.pop-enter-active,
.pop-leave-active {
  transition:
    transform $transition-fast ease,
    opacity $transition-fast ease;
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.pop-enter-to {
  opacity: 1;
  transform: scale(1);
}

.pop-leave-from {
  opacity: 1;
  transform: scale(1);
}

.pop-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
