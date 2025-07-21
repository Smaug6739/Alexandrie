<template>
  <div class="dropdown-container" @click="toggleDropdown">
    <div class="dropdown-selected" :class="{ open: isOpen }">
      <span v-if="selectedOption"><AppSelectOption :option="selectedOption" /></span>
      <span class="dropdown-arrow"></span>
    </div>
    <ul v-show="isOpen" class="dropdown-options">
      <li v-for="option in options" :class="{ selected: option.value === workspaceId }" @click="selectOption(option)">
        <AppSelectOption :option="option" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import AppSelectOption from './SidebarWorkspace.vue';
import type { Workspace } from './helpers';

const { workspaceId } = useSidebar();
const storage_item = localStorage.getItem('filterWorkspace');
const props = defineProps<{ options: Workspace[] }>();

if (storage_item && props.options.find(option => option.value == storage_item)) workspaceId.value = storage_item;

const isOpen = ref(false);
const selectedOption = computed(() => props.options.find(option => option.value == workspaceId.value) || props.options.find(option => !option.value));
const toggleDropdown = () => (isOpen.value = !isOpen.value);
const closeDropdown = () => (isOpen.value = false);

const selectOption = (option: Workspace) => {
  workspaceId.value = option.value;
  if (option.value) localStorage.setItem('filterWorkspace', option.value);
  else localStorage.removeItem('filterWorkspace');
};
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement)!.closest('.dropdown-container')) closeDropdown();
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped lang="scss">
.dropdown-container {
  position: relative;
  width: calc(100% - 4px);
}

.dropdown-selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 10px 2px 4px;
  border: 1px solid var(--border-color);
  margin: 4px 0;
  border-radius: 6px;
  cursor: pointer;
}
.placeholder {
  color: var(--font-color-light);
}

.dropdown-selected.open {
  border-color: var(--selection-color);
  box-shadow: 0 2px 10px var(--shadow);
}

.dropdown-arrow {
  width: 8px;
  height: 8px;
  border: solid var(--font-color);
  border-width: 0 2px 2px 0;
  padding: 4px;
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}

.dropdown-selected.open .dropdown-arrow {
  transform: rotate(45deg);
}

.dropdown-options {
  position: absolute;
  width: 95%;
  margin: 0;
  padding: 0;
  list-style: none;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--font-color);
  border-radius: 8px;
  overflow-y: auto;
  z-index: 100;
}

li {
  padding: 4px;
  cursor: pointer;
}

li.selected,
li:hover {
  background-color: var(--selection-color);
  color: var(--font-color);
}
</style>
