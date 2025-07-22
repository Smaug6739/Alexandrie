<template>
  <div v-if="show">
    <div class="modal-container">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>();
const emit = defineEmits(['close', 'confirm']);
</script>

<style lang="scss" scoped>
.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px;
  background-color: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
  font-size: initial;
}
</style>
