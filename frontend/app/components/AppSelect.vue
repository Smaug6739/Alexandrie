<template>
  <div ref="trigger" class="app-select" :style="{ width: size || '100%' }">
    <input
      v-if="open && searchable"
      ref="searchInput"
      v-model="search"
      type="text"
      placeholder="Search..."
      class="search-input"
      @keydown="handleKeyDown"
      @click.stop
    />
    <div v-else class="app-select-trigger">
      <button style="height: 30px" @click.stop="toggleDropdown">{{ selected?.label || placeholder }}</button>
      <svg :class="{ rotated: !open }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="var(--font-color)">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>
    <Teleport to="body">
      <ul v-if="open" ref="portalList" class="dropdown" :style="dropdownStyle">
        <AppSelectNode v-if="nullable" :node="{ id: '', label: '— Remove selection —' }" :level="0" @select="clearSelection" />
        <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" :disabled="disabled" @select="handleSelect" />
        <slot name="list-footer"></slot>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    items: ANode[];
    placeholder?: string;
    modelValue?: string | number;
    // eslint-disable-next-line vue/require-default-prop
    size?: string;
    disabled?: (i: ANode) => boolean;
    nullable?: boolean;
    searchable?: boolean;
  }>(),
  {
    placeholder: 'Select an option',
    searchable: true,
    nullable: false,
    disabled: () => false,
    modelValue: '',
  },
);

const emit = defineEmits(['update:modelValue']);

const selectedId = ref<string | number>(props.modelValue ?? '');
const open = ref(false);
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);
const trigger = ref<HTMLElement | null>(null);
const portalList = ref<HTMLElement | null>(null);
const dropdownStyle = ref<Record<string, string>>({});

const selected = computed(() => {
  const findSelected = (items: ANode[]): ANode | null => {
    for (const item of items) {
      if (item.id === selectedId.value) return item;
      if (item.childrens) {
        const found = findSelected(item.childrens);
        if (found) return found;
      }
    }
    return null;
  };
  return findSelected(props.items);
});

const clearSelection = () => {
  selectedId.value = '';
  emit('update:modelValue', null);
  toggleDropdown();
};

const filteredItems = computed(() => {
  if (!search.value.trim()) return props.items;
  return filterRecursive(props.items, search);
});

function updatePosition() {
  const el = searchInput.value ?? trigger.value;
  if (!el || !portalList.value) return;

  const rect = el.getBoundingClientRect();
  const dropdownEl = portalList.value;

  const dropdownHeight = Math.min(dropdownEl.scrollHeight, 300); // choose between real height if < 300 or 300 (max height)

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  const openUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;

  dropdownStyle.value = {
    position: 'absolute',
    top: openUp ? `${rect.top + window.scrollY - dropdownHeight}px` : `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
    zIndex: '1000',
  };
}

function toggleDropdown() {
  open.value = !open.value;
  if (open.value) {
    search.value = '';
    nextTick(() => {
      updatePosition();
      searchInput.value?.focus();
    });
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
  } else if (event.key === 'Enter') {
    const firstItem = filteredItems.value[0];
    if (firstItem) handleSelect(firstItem);
  }
}

function handleSelect(node: ANode) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
}

function handleClickOutside(e: MouseEvent) {
  // use composedPath for shadow-dom-safe detection
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const path = (e.composedPath && e.composedPath()) || (e as any).path || [];
  const targetIsInsideTrigger = trigger.value && (path.length ? path.includes(trigger.value) : trigger.value.contains(e.target as Node));
  const targetIsInsidePortal = portalList.value && (path.length ? path.includes(portalList.value) : portalList.value.contains(e.target as Node));

  if (!targetIsInsideTrigger && !targetIsInsidePortal) {
    open.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', updatePosition);
  // capture scroll on ancestors too
  window.addEventListener('scroll', updatePosition, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', updatePosition);
  window.removeEventListener('scroll', updatePosition, true);
});
</script>

<style scoped lang="scss">
.app-select {
  position: relative;
  width: 100%;
  margin: 0;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: Inter;
  font-size: 1rem;
  color: var(--font-color);
  background: var(--bg-color);

  &:focus {
    outline: 1px solid var(--primary);
  }
}

.app-select-trigger {
  display: flex;
  padding: 2px;
  align-items: center;
  justify-content: space-between;
}

button,
.search-input {
  height: 34px;
  width: 100%;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
}

.search-input {
  padding: 7px 10px;
  border: none;
  cursor: text;
}

/* Teleported element : attention au scoped styles + teleport.
   :deep permet d'appliquer les règles même si l'élément est rendu hors-DOM parent */
.dropdown {
  max-height: 300px;
  margin: 0;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  list-style: none;
  overflow-y: auto;
}
</style>
