<template>
  <div ref="root" class="filter-component">
    <AppBtnIcon ref="trigger" nav icon="filter" :tooltip="t('nodes.filter.title')" @click="toggle">
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

          <!-- Tags -->
          <div>
            <label>{{ t('components.filter.tags') }}</label>
            <AppTagInput :model-value="(options.tags || []).join(',')" @update:model-value="options.tags = parseTags($event)" />
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

          <div class="row">
            <div style="flex: 1">
              <label>{{ t('components.filter.sort') }}</label>
              <AppSelect v-model="sortKey" :items="SORT_OPTIONS" />
            </div>

            <div>
              <label>{{ t('components.filter.match') }}</label>
              <AppSelect v-model="options.matchMode" :items="MATCH_OPTIONS" size="125px" class="select" />
            </div>
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
import { parseTags } from '~/helpers/node';
import type { Node, SearchOptions } from '~/stores';

const props = defineProps<{ nodes: Node[] }>();
const emit = defineEmits<{ (e: 'update:nodes', v: Node[]): void }>();

const preferencesStore = usePreferencesStore();

const sortKey = preferencesStore.get('sortKey');
const sortOrder = preferencesStore.get('sortOrder');

const DEFAULT_OPTIONS: SearchOptions = {
  query: '',
  tags: [],
  matchMode: 'includes',
};

const { t } = useI18nT();
const store = useNodesStore();
const route = useRoute();
const router = useRouter();

const options = ref<SearchOptions>({ ...DEFAULT_OPTIONS, tags: [] });
const opened = ref(false);

const inputRef = ref<HTMLInputElement | null>(null);
const root = ref<HTMLDivElement | null>(null);
const panelStyle = ref<Record<string, string>>({});

const SORT_OPTIONS = [
  { id: 'created', label: t('components.filter.created') },
  { id: 'modified', label: t('components.filter.modified') },
  { id: 'name', label: t('common.labels.name') },
];

const MATCH_OPTIONS = [
  { id: 'includes', label: t('components.filter.contains') },
  { id: 'starts', label: t('components.filter.startsWith') },
  { id: 'exact', label: t('components.filter.exact') },
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

watch(
  () => route.query.tags,
  queryTags => {
    if (!queryTags) return;

    const raw = Array.isArray(queryTags) ? queryTags.filter(Boolean).map(String) : String(queryTags).split(',');

    options.value.tags = raw.map(tag => tag.trim()).filter(Boolean);
  },
  { immediate: true },
);

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
  z-index: 9999;
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
