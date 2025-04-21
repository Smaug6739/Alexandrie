<template>
  <div class="category-select">
    <button class="select-button" @click="toggleDropdown">
      {{ selected?.title || placeholder }}
    </button>

    <div v-if="open" class="dropdown">
      <ul class="tree-list">
        <AppSelectNode v-for="item in items" :key="item.id" :node="item" :level="0" @select="handleSelect" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Item[];
  placeholder?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const selected = ref<Item | null>(null);

function toggleDropdown() {
  open.value = !open.value;
}

function handleSelect(node: any) {
  selected.value = node;
  emit('update:modelValue', node);
  open.value = false;
}
</script>

<style scoped>
.category-select {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.select-button {
  width: 100%;
  padding: 8px 12px;
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
