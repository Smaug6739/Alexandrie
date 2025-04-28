<template>
  <button class="toggle" :class="{ active }" @click="toggle" :aria-pressed="active" role="switch">
    <span class="circle"></span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const toggle = () => {
  emit('toggle');
};
</script>

<style scoped lang="scss">
.toggle {
  width: 44px;
  height: 24px;
  background: var(--bg-contrast-2);
  border-radius: 15px;
  border: 1px solid var(--border-color, #ccc);
  display: flex;
  align-items: center;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  .circle {
    width: 20px;
    height: 20px;
    background: var(--bg-color);
    border-radius: 50%;
    transition: transform 0.25s ease, background-color 0.25s, border-color 0.25s;
    transform: translateX(0);
    border: 1px solid transparent;
  }

  &.active {
    background: rgba($primary-color, 0.9); // léger fond coloré
    border-color: $primary-color;

    .circle {
      transform: translateX(20px);
      background: #fff; // cercle toujours blanc
      border-color: $primary-color;
    }
  }
}
</style>
