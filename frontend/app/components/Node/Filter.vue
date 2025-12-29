<template>
  <div ref="root" class="filter-component">
    <div class="btn-icon" @click="toggle" @keydown.enter.prevent="toggle">
      <Icon name="filter" display="lg" />
      <span v-if="filtered.length != nodes?.length" class="bubble"></span>
    </div>

    <Transition name="pop">
      <div v-if="opened" class="filter-panel" role="dialog" aria-label="Filter nodes" @keydown.esc.prevent="close">
        <!-- Search -->
        <div>
          <label>Search</label>
          <input ref="inputRef" v-model="options.query" />
        </div>

        <!-- Sort & Match -->
        <div class="row">
          <label class="row">
            <input v-model="options.sortType" type="radio" value="ascending" />
            <span>Ascending</span>
          </label>
          <label class="row">
            <input v-model="options.sortType" type="radio" value="descending" />
            <span>Descending</span>
          </label>
        </div>
        <div class="row">
          <div style="flex: 1">
            <label>Sort</label>
            <AppSelect v-model="options.sortBy" :items="SORT_OPTIONS" />
          </div>

          <div>
            <label>Match</label>
            <AppSelect v-model="options.matchMode" :items="MATCH_OPTIONS" size="125px" class="select" />
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn" type="button" @click="reset">Reset</button>
        </div>

        <div class="panel-footer">
          <small>{{ filtered.length }} / {{ nodes?.length }} nodes match</small> <small>• <kbd>esc</kbd> to close</small>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useNodesStore } from '~/stores';
import type { Node, SearchOptions } from '~/stores';

const props = defineProps<{ nodes: Node[] }>();

const defaultOptions: SearchOptions = {
  query: '',
  sortType: 'descending',
  sortBy: 'created',
  matchMode: 'includes',
};
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

const emit = defineEmits<{ (e: 'update:nodes', v: Node[]): void }>();

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
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  box-shadow: 0 10px 30px rgb(2 6 23 / 20%);
}

.row {
  display: flex;
  margin: 4px 0;
  gap: 8px;
  justify-content: space-around;
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
  border: 1px solid var(--border-color);
  border-radius: 8px;
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
  transition: transform 0.15s ease, opacity 0.15s ease;
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
