<template>
  <div class="category-select" :style="{ width: size || '100%' }">
    <div v-if="!open">
      <button @click="toggleDropdown">{{ selected?.label || placeholder }}</button>
    </div>
    <div v-else>
      <input type="text" v-model="search" placeholder="Search..." class="search-input" ref="searchInput" @blur="handleBlur" @keydown="handleKeyDown" />
      <div class="dropdown">
        <ul>
          <AppSelectNode v-for="item in filteredItems" :key="item.id" :node="item" :level="0" @select="handleSelect" :disabled="disabled" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue';

const props = defineProps<{
  items: ANode[];
  placeholder?: string;
  modelValue?: string | number;
  size?: string;
  disabled?: (i: ANode) => boolean;
}>();

const selectedId = ref<string | number>(props.modelValue || '');
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

  const filterRecursive = (items: ANode[]): ANode[] => {
    return items
      .map(item => {
        const matches = item.label.toLowerCase().includes(search.value.toLowerCase());
        const filteredChildren = item.childrens ? filterRecursive(item.childrens) : [];
        if (matches || filteredChildren.length > 0) {
          return { ...item, childrens: filteredChildren };
        }
        return null;
      })
      .filter(Boolean) as ANode[];
  };

  return filterRecursive(props.items);
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
  // Ne PAS fermer sur Tab
}

function handleSelect(node: ANode) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
}

function handleBlur(event: FocusEvent) {
  setTimeout(() => {
    const relatedTarget = (event.relatedTarget || document.activeElement) as HTMLElement;
    if (!relatedTarget?.closest('.category-select')) {
      open.value = false;
    }
  }, 100);
}
</script>

<style scoped lang="scss">
.category-select {
  position: relative;
  width: 200px;
}

button,
.search-input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  text-align: left;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  &:focus {
    outline: 2px solid var(--border-color);
  }
}

.search-input {
  cursor: text;
}

.category-select:has(.dropdown) button,
.category-select:has(.dropdown) .search-input {
  outline: 2px solid var(--border-color);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  background: var(--bg-contrast);
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
