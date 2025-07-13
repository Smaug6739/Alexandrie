<template>
  <Transition name="modals">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <slot></slot>
      </div>
    </div>
  </Transition>
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
  background-color: var(--bg-contrast);
  border-radius: 10px;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s ease;
  font-size: initial;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
