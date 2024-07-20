<script setup lang="ts">
defineProps<{ show: boolean, size?: 'large' }>()
const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container" :class="size">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: var(--bg-contrast);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-size: initial;
}

.modal-body {
  margin: 20px 0;
}

.modal-close-button {
  float: left;
}

.modal-confirm-button {
  float: right;
}


.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.large {
  width: 1150px;
  height: calc(-100px + 100vh);
  max-width: calc(-100px + 100vw);
  max-height: 715px;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>