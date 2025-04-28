<template>
  <Transition name="modal">
    <div v-if="modals.length">
      <div v-for="(modal, index) in modals" :key="index" class="modal-mask modal-pos" :style="{ zIndex: 120 + index }">
        <div v-if="index !== modals.length - 1" class="modal-overlay"></div>
        <div class="modal-container">
          <button @click="modalManager.close(modal)" class="close-btn"><Icon name="close" :big="true" /></button>
          <component :is="modal.component" v-bind="modal.props" class="modal" @close="modalManager.close(modal)" />
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
const modalManager = useModal();
const modals = modalManager.modals;
</script>

<style scoped lang="scss">
.modal-container {
  margin: auto;
  padding: 12px 18px;
  background-color: var(--bg-contrast);
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  font-size: initial;
  position: relative;
}
.modal-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 1;
  pointer-events: none;
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

.close-btn {
  position: absolute;
  right: 0px;
  top: 1rem;
  background: none;
  z-index: 1000;
}
.modal {
  background-color: var(--bg-contrast);
  border-radius: 8px;
}

.modal-mask {
  position: fixed;
  z-index: 120;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
}
</style>
