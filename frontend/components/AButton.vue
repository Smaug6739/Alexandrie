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
button {
  padding: 8px 14px;
  border-radius: 4px;
  width: fit-content;
  font-weight: 600;
  margin: 3px 3px 0 0;
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
.primary {
  background: $primary-400;
  color: white;
  &:hover {
    background: $primary-500;
  }
}
.secondary {
  outline: 1px solid $primary-400;
  color: var(--font-color);
  &:hover {
    outline: 1px solid $primary-500;
  }
}
.link {
  background: none;
  color: $primary-400;
  &:hover {
    text-decoration: underline;
  }
}
.danger {
  background: $red;
  color: white;
  &:hover {
    background: darken($red, 10%);
  }
}
</style>
