<template>
  <button :class="type" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ type: string }>();
const emit = defineEmits(['click']);
const onClick = () => emit('click');
</script>

<style scoped lang="scss">
button {
  width: fit-content;
  margin: 3px 3px 0 0;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.primary {
  color: white;
  background: var(--primary);

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
  color: white;
  background: $green;

  &:hover {
    background: $green-dark;
  }
}

.link {
  color: var(--primary);
  background: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.danger {
  color: white;
  background: $red;

  &:hover {
    background: $red-dark;
  }
}
</style>
