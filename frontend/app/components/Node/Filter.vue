<template>
  <div ref="root" class="filter-component">
    <div class="btn-icon" @click="toggle" @keydown.enter.prevent="toggle">
      <Icon name="filter" display="lg" />
    </div>

    <transition name="pop">
      <div v-if="localOpened" class="filter-panel" role="dialog" aria-label="Filter nodes" @keydown.esc.prevent="close">
        <div class="panel-row">
          <label class="vis-label">Search</label>
          <input ref="inputRef" v-model="query" @input="onInput" @keydown.enter.prevent="apply" />
        </div>

        <div class="panel-row two-cols">
          <div style="flex: 1">
            <label class="vis-label">Sort</label>
            <AppSelect v-model="sort" :items="SORT_OPTIONS" />
          </div>

          <div>
            <label class="vis-label">Match</label>
            <AppSelect v-model="matchMode" :items="MATCH_OPTIONS" size="125px" class="select" />
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn primary" type="button" @click="apply">Apply</button>
          <button class="btn" type="button" @click="reset">Reset</button>
        </div>

        <div v-if="nodesCount !== null" class="panel-footer">
          <small>{{ previewText }}</small>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps({
  nodes: {
    type: Array as PropType<Node[] | undefined>,
    default: undefined,
  },
  opened: {
    type: Boolean,
    default: false,
  },
});

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

const emit = defineEmits<{
  (e: 'update:opened', v: boolean): void;
  (e: 'update:nodes', v: Node[]): void; // legacy/optional — kept for backward compatibility
  (e: 'apply', payload: { query: string; sort: string; matchMode: string }): void;
  (e: 'reset'): void;
}>();

// Local reactive state so parent v-model stays in sync
const localOpened = ref<boolean>(props.opened);
watch(
  () => props.opened,
  v => (localOpened.value = !!v),
);
watch(localOpened, v => emit('update:opened', v));

const query = ref<string>('');
const sort = ref<string>('created_desc');
const matchMode = ref<string>('includes');
const inputRef = ref<HTMLInputElement | null>(null);
const root = ref<HTMLDivElement | null>(null);

let outsideHandler: ((e: MouseEvent) => void) | null = null;

const nodesCount = computed<number | null>(() => (props.nodes ? props.nodes.length : null));

const previewText = computed(() => {
  if (!props.nodes) return 'No node list provided — component will emit filter criteria.';
  const filtered = computeFiltered(props.nodes, query.value, sort.value, matchMode.value);
  return `${filtered.length} / ${props.nodes.length} nodes match`;
});

function toggle() {
  localOpened.value = !localOpened.value;
  if (localOpened.value) focusInput();
}
function close() {
  localOpened.value = false;
}

function focusInput() {
  nextTick(() => inputRef.value?.focus());
}

function onInput() {
  // optional: debounce preview only (we don't debounce final apply)
}

function apply() {
  // If parent passed nodes, we compute the filtered list and emit update:nodes (backwards compatible)
  if (props.nodes) {
    const filtered = computeFiltered(props.nodes, query.value, sort.value, matchMode.value);
    emit('update:nodes', filtered);
  }

  // Always emit generic 'apply' so parent can react however it wants
  emit('apply', { query: query.value, sort: sort.value, matchMode: matchMode.value });
  // Keep the panel open so user can tweek, or close if you prefer:
  // localOpened.value = false;
}

function reset() {
  console.log('resetting filter');
  query.value = '';
  sort.value = 'created';
  matchMode.value = 'includes';
  if (props.nodes) emit('update:nodes', props.nodes.slice());
  emit('reset');
}

function computeFiltered(nodes: Node[], q: string, s: string, m: string) {
  let out = nodes.slice();
  const qq = q.trim().toLowerCase();
  if (qq) {
    out = out.filter(n => {
      const name = String(n.name ?? '').toLowerCase();
      if (m === 'starts') return name.startsWith(qq);
      if (m === 'exact') return name === qq;
      return name.includes(qq);
    });
  }

  switch (s) {
    case 'created_asc':
      out.sort((a, b) => Number(a.created_timestamp ?? 0) - Number(b.created_timestamp ?? 0));
      break;
    case 'created_desc':
      out.sort((a, b) => Number(b.created_timestamp ?? 0) - Number(a.created_timestamp ?? 0));
      break;
    case 'modified_asc':
    case 'updated_asc':
      out.sort((a, b) => Number(a.updated_timestamp ?? 0) - Number(b.updated_timestamp ?? 0));
      break;
    case 'modified_desc':
    case 'updated_desc':
      out.sort((a, b) => Number(b.updated_timestamp ?? 0) - Number(a.updated_timestamp ?? 0));
      break;
    case 'name_asc':
      out.sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')));
      break;
    case 'name_desc':
      out.sort((a, b) => String(b.name ?? '').localeCompare(String(a.name ?? '')));
      break;
    default:
      break;
  }
  return out;
}

onMounted(() => {
  outsideHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (localOpened.value && root.value && !root.value.contains(target)) {
      close();
    }
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

.filter-panel {
  position: absolute;
  right: 0;
  top: 48px;
  width: 320px;
  background: var(--bg-color);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.2);
  border: 1px solid var(--border-color);
  z-index: 200;
}

.panel-row {
  margin-bottom: 10px;
}
.panel-row.two-cols {
  display: flex;
  gap: 8px;
}
.vis-label {
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
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
}
.btn.primary {
  background: linear-gradient(180deg, var(--primary) 0%, var(--primary-600) 100%);
  color: white;
  border: none;
}

.panel-footer {
  margin-top: 8px;
  color: var(--muted);
}

/* small pop animation */
.pop-enter-active,
.pop-leave-active {
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.pop-enter-from {
  transform: scale(0.98);
  opacity: 0;
}
.pop-enter-to {
  transform: scale(1);
  opacity: 1;
}
.pop-leave-from {
  transform: scale(1);
  opacity: 1;
}
.pop-leave-to {
  transform: scale(0.98);
  opacity: 0;
}
</style>
