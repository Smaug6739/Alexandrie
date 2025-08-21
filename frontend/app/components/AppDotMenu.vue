<template>
  <div ref="menuRoot" class="three-dots-menu">
    <span class="menu-button" aria-label="Menu" @click="toggleMenu">
      <svg class="menu-icon" viewBox="0 9 20 2" xmlns="http://www.w3.org/2000/svg">
        <path style="fill: var(--font-color)" d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm5 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
      </svg>
    </span>
    <Transition name="fade-scale">
      <div v-if="open" class="menu-content">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const open = ref(false);
const emit = defineEmits(['open', 'close']);
const menuRoot: Ref<HTMLDivElement | undefined> = ref();
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
.three-dots-menu {
  position: relative;
  display: inline-block;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  line-height: 1;
}

.menu-button:hover {
  background-color: rgba(0, 0, 0, 0.08);
}
.menu-icon {
  display: block;
  height: 20px;
  width: 20px;
  margin: auto 0;
}

.menu-content {
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 6px;
  min-width: 270px;
  background: var(--bg-color);
  border-radius: 6px;
  box-shadow: 0 2px 6px var(--shadow);
  border: 1px solid var(--border-color);

  overflow: hidden;
  z-index: 2;
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
