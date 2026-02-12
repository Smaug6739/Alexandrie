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
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  background-color: var(--primary);
  align-items: center;
  justify-content: center;
}

.hint-content {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 100;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.65rem;
  color: white;
  background-color: #1f2937;
  box-shadow: var(--shadow-sm);
  margin-top: 0.4rem;
  transform: translateX(-50%);
  white-space: nowrap;
}
</style>
