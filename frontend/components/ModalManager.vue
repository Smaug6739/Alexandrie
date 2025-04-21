<!-- Modal BUS -->
<!-- This component is used to manage modals in the application. -->
<template>
  <Transition name="modal">
    <div v-if="modals.length" class="modal-mask">
      <div v-for="(modal, index) in modals" :key="modal.name" class="modal-pos" :style="{ zIndex: 120 + index }">
        <!-- Overlay sur les modals du dessous -->
        <div v-if="index !== modals.length - 1" class="modal-overlay"></div>

        <div class="modal-container">
          <component :is="modal.component" v-bind="modal.props" />
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
const modals = useModal().modals;
</script>

<style scoped lang="scss">
.modal-container {
  width: 75%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: var(--bg-contrast);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-size: initial;
}
.modal-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2); // ou plus sombre selon l’effet souhaité
  border-radius: 10px;
  z-index: 1; // juste en-dessous du contenu du modal
  pointer-events: none; // le masque ne bloque pas les interactions
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
