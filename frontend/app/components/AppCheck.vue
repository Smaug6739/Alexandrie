<template>
  <label class="checkbox">
    <input type="checkbox" :checked="!!modelValue || checked" @change="toggle" />
    <span class="mark">
      <svg v-if="modelValue || checked" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
    <span class="label"><slot /></span>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: boolean; checked?: boolean }>();
const emit = defineEmits(['update:modelValue', 'change']);

function toggle() {
  emit('update:modelValue', !props.modelValue);
  emit('change', !props.checked);
}
</script>

<style scoped lang="scss">
.checkbox {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  width: fit-content;
  cursor: pointer;
  user-select: none;

  input {
    display: none;
  }

  .mark {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    border: 2px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-base);
    transition:
      border-color $transition-fast,
      background-color $transition-fast;

    svg {
      width: 16px;
      height: 16px;
    }
  }

  input:checked + .mark {
    border-color: var(--primary);
    background-color: var(--primary);
  }

  .label {
    font-size: 1rem;
    color: var(--text-body);
  }
}
</style>
