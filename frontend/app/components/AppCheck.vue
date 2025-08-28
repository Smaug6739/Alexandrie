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
  modelValue?: number;
}>();
const emit = defineEmits(['update:modelValue']);

function toggle() {
  emit('update:modelValue', props.modelValue ? 0 : 1);
}
</script>

<style scoped lang="scss">
.app-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-family: Inter, sans-serif;
  user-select: none;
  gap: 8px;

  input {
    display: none; // on masque le vrai input
  }

  .checkmark {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    border: 2px solid var(--border-color, #ccc);
    background: var(--bg-color, #fff);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  input:checked + .checkmark {
    background: var(--primary, #4f46e5);
    border-color: var(--primary, #4f46e5);
  }

  .label {
    font-size: 1rem;
    color: var(--font-color, #333);
  }
}
</style>
