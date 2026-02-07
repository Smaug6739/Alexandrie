<template>
  <div class="container">
    <span class="menu-button" aria-label="Menu" @click="toggleMenu">
      <svg class="menu-icon" viewBox="0 9 20 2" xmlns="http://www.w3.org/2000/svg">
        <path
          style="fill: var(--text-body)"
          d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        />
      </svg>
    </span>
    <Transition name="fade-scale">
      <div v-if="open" class="content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const open = ref(false);
const emit = defineEmits(['open', 'close']);

const toggleMenu = () => {
  open.value = !open.value;
  emit(open.value ? 'open' : 'close');
};

const handleClickOutside = () => {
  open.value = false;
  emit('close');
};

const close = () => (open.value = false);

defineExpose({ close, opened: open });

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.container {
  position: relative;
  display: inline-block;
}

.menu-button {
  padding: 0;
  border: none;
  border-radius: 4px;
  line-height: 1;
  background: none;
  cursor: pointer;
}

.menu-button:hover {
  background-color: rgb(0 0 0 / 8%);
}

.menu-icon {
  display: block;
  width: 20px;
  height: 20px;
  margin: auto 0;
}

.content {
  position: absolute;
  right: 0;
  z-index: 2;
  min-width: 270px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface-base);
  box-shadow: 0 2px 6px var(--shadow-sm);
  margin-top: 4px;
  overflow: hidden;
}

/* Animation */
.fade-scale-enter-active {
  transition: all 120ms ease-out;
}

.fade-scale-leave-active {
  transition: all 100ms ease-in;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
