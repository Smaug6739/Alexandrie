<template>
  <button class="toggle" :class="{ active: modelValue || active }" :aria-pressed="modelValue" role="switch" @click="toggle">
    <span class="knob" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue?: boolean; active?: boolean }>();
const active = ref(props.active || props.modelValue || false);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'toggle'): void;
}>();

const toggle = () => {
  active.value = !active.value;
  emit('update:modelValue', active.value);
  emit('toggle');
};
</script>

<style scoped lang="scss">
.toggle {
  display: flex;
  height: 24px;
  padding: 2px;
  border: 1px solid var(--border);
  border-radius: 15px;
  background: var(--surface-overlay);
  transition:
    background-color $transition-medium,
    border-color $transition-medium;
  align-items: center;
  cursor: pointer;
  flex: 0 0 44px;

  .knob {
    width: 20px;
    height: 20px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: var(--surface-base);
    transition:
      transform $transition-base,
      background-color $transition-base,
      border-color $transition-base;
    transform: translateX(0);
  }

  &.active {
    border-color: var(--primary);
    background: var(--primary);

    .knob {
      border-color: var(--primary);
      background: #fff;
      transform: translateX(20px);
    }
  }
}
</style>
