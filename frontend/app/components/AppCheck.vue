<template>
  <label class="app-checkbox">
    <input type="checkbox" :checked="!!modelValue" @change="toggle" />
    <span class="checkmark">
      <svg v-if="modelValue" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="label"><slot /></span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<style scoped lang="scss">
.app-checkbox {
  display: inline-flex;
  width: fit-content;
  font-family: Inter, sans-serif;
  align-items: center;
  cursor: pointer;
  gap: 0.25rem;
  user-select: none;

  input {
    display: none; // on masque le vrai input
  }

  .checkmark {
    display: flex;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border-color, #ccc);
    border-radius: 6px;
    background: var(--bg-color, #fff);
    transition: all 0.2s ease;
    align-items: center;
    justify-content: center;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  input:checked + .checkmark {
    border-color: var(--primary, #4f46e5);
    background: var(--primary, #4f46e5);
  }

  .label {
    font-size: 1rem;
    color: var(--font-color, #333);
  }
}
</style>
