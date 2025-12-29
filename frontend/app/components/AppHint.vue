<template>
  <div class="hint-wrapper" @mouseenter="show = true" @mouseleave="show = false">
    <div class="icon">i</div>
    <div v-if="show" class="hint-tooltip">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
const show = ref(false);
</script>

<style scoped lang="scss">
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
</style>
