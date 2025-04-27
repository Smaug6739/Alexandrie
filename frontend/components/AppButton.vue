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
  padding: 10px;
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
  background: $primary-color;
  color: white;
  &:hover {
    background: $primary-dark;
  }
}
.secondary {
  outline: 1px solid $primary-color;
  color: var(--font-color);
  &:hover {
    box-shadow: inset 0 0 0 1px $primary-dark;
  }
}
.success {
  background: $green;
  color: white;
  &:hover {
    background: $green-dark;
  }
}
.link {
  background: none;
  color: $primary-color;
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
  font-size: 1.1em;
}
.danger {
  background: $red;
  color: white;
  &:hover {
    background: $red-dark;
  }
}
</style>
