<script setup lang="ts">
defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
          </slot>
          <div style="display:flex; justify-content: space-between;padding: 0 15px;">
            <button class="modal-close-button" @click="emit('close')">Cancel</button>
            <button class="modal-confirm-button" @click="emit('confirm')">OK</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
  font-size: normal;
}

.modal-container {
  width: 500px;
  margin: auto;
  padding: 20px 30px;
  background-color: var(--bg-contrast);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
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


.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>