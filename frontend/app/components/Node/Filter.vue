<template>
  <div ref="root" class="filter-component">
    <div class="btn-icon" @click="toggle" @keydown.enter.prevent="toggle">
      <Icon name="filter" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.filter.title') }}</p>
      <span v-if="filtered.length != nodes?.length" class="bubble"></span>
    </div>

    <Transition name="pop">
      <div v-if="opened" class="filter-panel" role="dialog" :aria-label="t('nodes.filter.title')" @keydown.esc.prevent="close">
        <!-- Search -->
        <div>
          <label>{{ t('common.actions.search') }}</label>
          <input ref="inputRef" v-model="options.query" />
        </div>

        <!-- Sort & Match -->
        <div class="row">
          <label class="row">
            <input v-model="options.sortType" type="radio" value="ascending" />
            <span>{{ t('common.filter.ascending') }}</span>
          </label>
          <label class="row">
            <input v-model="options.sortType" type="radio" value="descending" />
            <span>{{ t('common.filter.descending') }}</span>
          </label>
        </div>
        <div class="row">
          <div style="flex: 1">
            <label>{{ t('common.filter.sort') }}</label>
            <AppSelect v-model="options.sortBy" :items="SORT_OPTIONS" />
          </div>

          <div>
            <label>{{ t('common.filter.match') }}</label>
            <AppSelect v-model="options.matchMode" :items="MATCH_OPTIONS" size="125px" class="select" />
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn" type="button" @click="reset">{{ t('common.actions.reset') }}</button>
        </div>

        <div class="panel-footer">
          <small>{{ t('nodes.filter.footer', { count: filtered.length, total: props.nodes.length }) }}</small>
          <small>• <kbd>esc</kbd> {{ t('nodes.filter.toClose') }}</small>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useNodesStore } from '~/stores';
import type { Node, SearchOptions } from '~/stores';

const props = defineProps<{ nodes: Node[] }>();
const emit = defineEmits<{ (e: 'update:nodes', v: Node[]): void }>();

const defaultOptions: SearchOptions = {
  query: '',
  sortType: 'descending',
  sortBy: 'created',
  matchMode: 'includes',
};
const { t } = useI18nT();
const store = useNodesStore();
const options = ref({ ...defaultOptions });
const opened = ref<boolean>(false);
const inputRef = ref<HTMLInputElement | null>(null);
const root = ref<HTMLDivElement | null>(null);

const SORT_OPTIONS = [
  { id: 'created', label: 'Created' },
  { id: 'modified', label: 'Modified' },
  { id: 'name', label: 'Name' },
];

const MATCH_OPTIONS = [
  { id: 'includes', label: 'Contains' },
  { id: 'starts', label: 'Starts with' },
  { id: 'exact', label: 'Exact' },
];

let outsideHandler: ((e: MouseEvent) => void) | null = null;

const filtered = computed(() => store.search(options.value, props.nodes));

function toggle() {
  opened.value = !opened.value;
  if (opened.value) focusInput();
}
const close = () => (opened.value = false);
const reset = () => (options.value = { ...defaultOptions });
const focusInput = () => nextTick(() => inputRef.value?.focus());

watchEffect(() => {
  if (props.nodes) emit('update:nodes', filtered.value);
});

onMounted(() => {
  outsideHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (opened.value && root.value && !root.value.contains(target)) close();
  };
  document.addEventListener('click', outsideHandler);
});

onBeforeUnmount(() => {
  if (outsideHandler) document.removeEventListener('click', outsideHandler);
});
</script>

<style scoped lang="scss">
.filter-component {
  position: relative;
  display: inline-block;
}

.btn-icon {
  position: relative;

  &:hover > .hint-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

.bubble {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border: 3px solid var(--primary);
  border-radius: 50%;
  background: var(--primary-bg);
}

.filter-panel {
  position: absolute;
  top: 48px;
  right: 0;
  z-index: 200;
  width: 320px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  box-shadow: var(--shadow-lg);
}

.row {
  display: flex;
  margin: 4px 0;
  gap: 8px;
  justify-content: space-around;
}

kbd {
  padding: 2px 4px;
}

label {
  font-size: 13px;
  margin-bottom: 6px;
}

.panel-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 6px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: transparent;
  cursor: pointer;
}

.btn.primary {
  border: none;
  color: white;
  background: linear-gradient(180deg, var(--primary) 0%, var(--primary-600) 100%);
}

.panel-footer {
  color: var(--muted);
  margin-top: 8px;
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
