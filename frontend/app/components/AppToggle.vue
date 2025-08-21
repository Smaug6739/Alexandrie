<template>
  <button class="toggle" :class="{ active }" :aria-pressed="active" role="switch" @click="toggle">
    <span class="circle"/>
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
  display: flex;
  width: 44px;
  height: 24px;
  padding: 2px;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 15px;
  background: var(--bg-contrast-2);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  align-items: center;
  cursor: pointer;

  .circle {
    width: 20px;
    height: 20px;
    border: 1px solid transparent;
    border-radius: 50%;
    background: var(--bg-color);
    transition: transform 0.25s ease, background-color 0.25s, border-color 0.25s;
    transform: translateX(0);
  }

  &.active {
    border-color: var(--primary);
    background: var(--primary);

    .circle {
      border-color: var(--primary);
      background: #fff; // cercle toujours blanc
      transform: translateX(20px);
    }
  }
}
</style>
