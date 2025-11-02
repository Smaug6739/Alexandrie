<template>
  <TransitionGroup name="modal" tag="div">
    <div v-for="(modal, index) in modals" :key="index" class="modal-mask modal-pos" :style="{ zIndex: 120 + index }" @click.self="modalManager.close(modal)">
      <div v-if="index !== modals.length - 1" class="modal-overlay" />
      <div class="modal-container">
        <button class="close-btn" @click="modalManager.close(modal)">
          <Icon name="close" display="lg" />
        </button>
        <component
          :is="modal.component"
          :style="{ padding: modal.options.noPadding ? '0' : '16px 22px' }"
          v-bind="modal.options.props"
          class="modal"
          :class="modal.options.size"
          @close="modalManager.close(modal)"
        />
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
  opacity: 0;
  transform: scale(1.1);
}

/* Styles modals */
.modal-container {
  position: relative;
  width: 90%;
  max-width: 750px;
  margin: auto;
  border-radius: 10px;
  font-size: initial;
  background-color: var(--bg-color);
  box-shadow: 0 2px 10px var(--shadow);
}

.modal-container:has(> .large) {
  max-width: 1115px;
}

.modal-container:has(> .small) {
  max-width: 600px;
}

.modal-overlay {
  position: absolute;
  z-index: 1;
  border-radius: 10px;
  background-color: rgb(0 0 0 / 20%);
  inset: 0;
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 0;
  z-index: 1000;
  background: none;
}

.modal {
  border-radius: 8px;
  background-color: var(--bg-color);
}

.modal-mask {
  position: fixed;
  display: flex;
  background-color: rgb(0 0 0 / 50%);
  inset: 0;
}
</style>
