<template>
  <div class="hint-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <div class="hint-icon">i</div>
    <div v-if="show" class="hint-tooltip">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
const show = ref(false);
</script>

<style scoped lang="scss">
.hint-wrapper {
  position: relative;
  margin-left: 0.25rem;
  display: inline-block;
}

.hint-icon {
  width: 1rem;
  height: 1rem;
  background-color: var(--primary);
  color: white;
  font-weight: bold;
  border-radius: 50%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.4rem;
  background-color: #1f2937;
  color: white;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  white-space: nowrap;
  font-size: 0.75rem;
  z-index: 100;
  box-shadow: 0 2px 8px var(--shadow);
}
</style>
