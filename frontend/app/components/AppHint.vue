<template>
  <div class="hint-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <div class="icon">i</div>
    <div v-if="show" class="hint-content">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
const show = ref(false);
</script>

<style scoped lang="scss">
.hint-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 0.25rem;
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background-color: var(--primary);
}

.hint-content {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 100;
  margin-top: 0.4rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.65rem;
  color: white;
  white-space: nowrap;
  background-color: var(--surface-tooltip);
  box-shadow: var(--shadow-sm);
  transform: translateX(-50%);
}
</style>
