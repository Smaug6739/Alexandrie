<template>
  <h1>Preferences</h1>
  <div v-for="(option, index) in options" :key="index" class="form-group toggle-group">
    <label :for="option.id">{{ option.label }}</label>
    <div :id="option.id" class="toggle-button" :class="{ active: option.value }" @click="toggleOption(index)">
      <span class="toggle-slider"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
// Define options dynamically
const options = ref([
  {
    id: 'print-mode-toggle',
    label: 'Enable Print Mode',
    value: localStorage.getItem('printMode') === 'true',
    storageKey: 'printMode',
  },
  {
    id: 'dark-mode-toggle',
    label: 'Enable Dark Mode',
    value: colorMode.value === 'dark',
    storageKey: 'darkMode',
    onToggle: () => (colorMode.value === 'light' ? (colorMode.preference = 'dark') : (colorMode.preference = 'light')),
  },
]);

// Toggle function for options
const toggleOption = (index: number) => {
  const option = options.value[index];
  if (!option) return;
  option.value = !option.value;
  localStorage.setItem(option.storageKey, option.value.toString());
  if (option.onToggle) option.onToggle();
};
</script>

<style scoped lang="scss">
.form-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
  max-width: 90%;
  .toggle-group {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  label {
    margin: 10px 0;
  }

  .toggle-button {
    width: 50px;
    height: 25px;
    background-color: var(--bg-contrast-2);
    border-radius: 25px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &.active {
      background-color: var(--blue);
    }

    .toggle-slider {
      width: 20px;
      height: 20px;
      background-color: var(--bg-color);
      border-radius: 50%;
      position: absolute;
      top: 2.5px;
      left: 3px;
      transition: transform 0.3s ease;
    }

    &.active .toggle-slider {
      transform: translateX(25px);
    }
  }
}
</style>
