<template>
  <div class="category-select" :style="{ width: size || '100%' }">
    <button @click="toggleDropdown">{{ selected?.label || placeholder }}</button>
    <div v-if="open" class="dropdown">
      <ul>
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
const open = ref(false);
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

function toggleDropdown() {
  open.value = !open.value;
}

function handleSelect(node: Item) {
  selectedId.value = node.id;
  emit('update:modelValue', node.id);
  open.value = false;
}
</script>

<style scoped lang="scss">
.category-select {
  position: relative;
  width: 200px;
}

button {
  width: 100%;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: white;
  text-align: left;
  border-radius: 6px;
  cursor: pointer;
  padding: 8px 10px;
  // ouline like input with focus or opened
  &:focus {
    outline: 2px solid #000;
  }
}
.category-select:has(.dropdown) button {
  outline: 2px solid #000;
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

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
