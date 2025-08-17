<template>
  <TransitionGroup name="modal" tag="div">
    <div v-for="(modal, index) in modals" :key="index" class="modal-mask modal-pos" :style="{ zIndex: 120 + index }" @click.self="modalManager.close(modal)">
      <div v-if="index !== modals.length - 1" class="modal-overlay"></div>
      <div class="modal-container">
        <button @click="modalManager.close(modal)" class="close-btn">
          <Icon name="close" :big="true" />
        </button>
        <component :is="modal.component" v-bind="modal.props" class="modal" :class="modal.big ? 'big' : ''" @close="modalManager.close(modal)" />
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
const modalManager = useModal();
const modals = modalManager.modals;
</script>

<style scoped lang="scss">
/* Transition group classes */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  transform: scale(1.1);
  opacity: 0;
}

/* Styles modals */
.modal-container {
  width: 80%;
  max-width: 750px;
  margin: auto;
  padding: 16px 22px;
  background-color: var(--bg-color);
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--shadow);
  font-size: initial;
  position: relative;
}

.modal-container:has(> .big) {
  max-width: 1115px;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  z-index: 1;
  pointer-events: none;
}
.close-btn {
  position: absolute;
  right: 0px;
  top: 1rem;
  background: none;
  z-index: 1000;
}
.modal {
  background-color: var(--bg-color);
  border-radius: 8px;
}
.modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
}
</style>
