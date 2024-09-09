<template>
  <div class="dropdown-container" @click="toggleDropdown">
    <div class="dropdown-selected" :class="{ open: isOpen }">
      <span v-if="selectedOption"><AppSelectOption :option="selectedOption" /></span>
      <span v-else class="placeholder">{{ placeholder }}</span>
      <span class="dropdown-arrow"></span>
    </div>
    <ul v-if="isOpen" class="dropdown-options">
      <li v-for="option in options" :class="{ selected: option.value === selected }" @click="selectOption(option)">
        <AppSelectOption :option="option" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
interface Option {
  text: string;
  value: string;
}
const props = defineProps<{
  value?: string;
  options: Option[];
  placeholder?: string;
}>();
const isOpen = ref(false);
const selected = ref(props.value);
const emit = defineEmits(['input']);
const selectedOption = computed(() => props.options.find(option => option.value === selected.value));
const toggleDropdown = () => (isOpen.value = !isOpen.value);
const selectOption = (option: Option) => {
  selected.value = option.value;
  emit('input', selected.value);
  isOpen.value = false;
};
const closeDropdown = () => (isOpen.value = false);
const handleClickOutside = (event: MouseEvent) => {
  if (!(event.target as HTMLElement)!.closest('.dropdown-container')) {
    closeDropdown();
  }
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
  padding: 2px 8px;
  border: 1px solid var(--border-color);
  margin: 4px;
  border-radius: 8px;
  cursor: pointer;
}
.placeholder {
  color: var(--font-color-light);
}

.dropdown-selected.open {
  border-color: var(--selection-color);
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.dropdown-arrow {
  width: 8px;
  height: 8px;
  border: solid #333;
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
