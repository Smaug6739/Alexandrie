<template>
  <div class="app-select" :style="{ width: size || '100%' }">
    <div v-if="!open" style="display: flex; justify-content: space-between; align-items: center; padding: 1px">
      <button @click.stop="toggleDropdown">{{ selected?.label || placeholder }}</button
      ><svg :class="{ rotated: !open }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </div>
    <div v-else>
      <input ref="searchInput" v-model="search" type="text" placeholder="Search..." class="search-input" @keydown="handleKeyDown" />
      <div class="dropdown">
        <ul>
          <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" :disabled="disabled" @select="handleSelect" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: ANode[];
  placeholder?: string;
  modelValue?: string | number;
  size?: string;
  disabled?: (i: ANode) => boolean;
}>();

const selectedId = ref<string | number>(props.modelValue ?? '');
const open = ref(false);
const search = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits(['update:modelValue']);

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

const filteredItems = computed(() => {
  if (!search.value.trim()) return props.items;
  return filterRecursive(props.items, search);
});

function toggleDropdown() {
  open.value = true;
  search.value = '';
  nextTick(() => {
    searchInput.value?.focus();
  });
}
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
  } else if (event.key === 'Enter') {
    // Optionnel : sélectionner si 1 seul résultat ?
    const firstItem = filteredItems.value[0];
    if (firstItem) {
      handleSelect(firstItem);
    }
  }
}

function handleSelect(node: ANode) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
}

function handleClickOutside(_: MouseEvent) {
  open.value = false;
}

onMounted(() => window.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside));
</script>

<style scoped lang="scss">
.app-select {
  position: relative;
  width: 200px;
  border: 1px solid var(--border-color);
  margin: 0;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--font-color);
  border-radius: 6px;
  font-size: 1rem;
  font-family: Inter;
  &:focus {
    outline: 1px solid var(--primary);
  }
}

button,
.search-input {
  width: 100%;
  padding: 8px 10px;
  text-align: left;
  font-size: 1rem;
  font-size: 16px;
  cursor: pointer;
  border-radius: 6px;
}

.search-input {
  cursor: text;
  border: none;
  padding: 6px 10px;
  border: none;
  cursor: text;
}

}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: 1000;
  max-height: 300px;
  padding: 2px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  margin-top: 4px;
  overflow-y: auto;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
