<template>
  <div class="category-select" :style="{ width: size + 'px' }">
    <button class="select-button" @click="toggleDropdown">
      {{ selected?.title || placeholder }}
    </button>

    <div v-show="open" class="dropdown">
      <ul class="tree-list">
        <AppSelectNode v-for="item in items" :key="item.id" :node="item" :level="0" @select="handleSelect" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: ANode[];
  placeholder?: string;
  modelValue?: string | number;
  size?: string;
}>();
const selectedId = ref<string | number>(props.modelValue || '');

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const selected = computed(() => {
  // Find the selected item based on the selectedId
  // Recursively search through the items (and their children) to find the selected item
  const findSelected = (items: ANode[]): ANode | null => {
    for (const item of items) {
      if (item.id === selectedId.value) {
        return item;
      }
      if (item.childrens) {
        const found = findSelected(item.childrens);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };
  return findSelected(props.items);
});

function toggleDropdown() {
  open.value = !open.value;
}

function handleSelect(node: Item) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
}
</script>

<style scoped>
.category-select {
  position: relative;
  width: 200px;
}

.select-button {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 1000;
}

.tree-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
