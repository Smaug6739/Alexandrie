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
  padding: 10px;
  border-radius: 6px;
  width: fit-content;
  font-size: 0.9rem;
  margin: 3px 3px 0 0;
  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
.primary {
  background: var(--primary);
  color: white;
  &:hover {
    background: $primary-dark;
  }
}
.secondary {
  border: 1px solid var(--primary);
  color: var(--font-color);
  &:hover {
    background: var(--selection-color);
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
  color: var(--primary);
  &:hover {
    text-decoration: underline;
  }
  cursor: pointer;
}
.danger {
  background: $red;
  color: white;
  &:hover {
    background: $red-dark;
  }
}
</style>
