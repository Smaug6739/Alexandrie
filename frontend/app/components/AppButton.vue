<template>
  <button :class="[type, { large }]" @click="onClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ type: string; large?: boolean }>();
const emit = defineEmits(['click']);
const onClick = () => emit('click');
</script>

<style scoped lang="scss">
button {
  display: inline-flex;
  width: fit-content;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.large {
  padding: 10px 14px;
  font-size: 1rem;
}

.primary {
  color: white;
  background: var(--primary);

  &:hover {
    background: var(--primary-dark);
  }

  * {
    fill: white !important;
  }
}

.secondary {
  border: 1px solid var(--primary);
  color: var(--text-body);

  &:hover {
    background: var(--selection-color);
  }
}

.success {
  color: white;
  background: var(--green);

  &:hover {
    background: var(--green-dark);
  }
}

.link {
  font-weight: bold;
  color: var(--primary);
  background: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.danger {
  color: white;
  background: var(--red);

  &:hover {
    background: var(--red-dark);
  }
}

@media screen and (width <= 768px) {
  button {
    padding: 8px;
    font-size: 0.8rem;
  }
}
</style>
