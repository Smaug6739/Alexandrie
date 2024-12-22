<template>
  <button @click="onClick" :class="type">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps<{ type: string }>();
const emit = defineEmits(['click']);
const onClick = () => emit('click');
</script>

<style scoped lang="scss">
@use 'sass:color';
button {
  padding: 10px 14px;
  border-radius: 5px;
  width: fit-content;
  font-size: 0.9rem;
  margin: 3px 3px 0 0;
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
.primary {
  background: var(--primary-color);
  color: white;
  &:hover {
    background: var(--primary-color-500);
  }
}
.secondary {
  outline: 1px solid var(--primary-color);
  color: var(--font-color);
  &:hover {
    outline: 1px solid var(--primary-color-500);
  }
}
.success {
  background: $green;
  color: white;
  &:hover {
    background: color.adjust($green, $lightness: -10%);
  }
}
.link {
  background: none;
  color: var(--primary-color);
  &:hover {
    text-decoration: underline;
  }
}
.danger {
  background: $red;
  color: white;
  &:hover {
    background: color.adjust($red, $lightness: 10%);
  }
}
</style>
