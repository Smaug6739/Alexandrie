<template>
  <div class="color-picker">
    <div
      class="color-option"
      style="background-color: white; border: 1px solid var(--border-color)"
      :style="{ outline: selectedColor == -1 ? '2px solid var(--font-color-light)' : '' }"
      :class="{ selected: selectedColor === -1 }"
      @click="selectColor(-1)"
    ></div>
    <div
      v-for="(_, index) in appColors"
      :key="index"
      class="color-option"
      :style="{ backgroundColor: getAppColor(index) ? `var(--${getAppColor(index)})` : '#fff', border: '1px solid var(--border-color)', outline: selectedColor === index ? `2px solid var(--${getAppColor(index)})` : 'none' }"
      :class="{ selected: selectedColor === index }"
      @click="selectColor(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ selectedColor?: number | null; nullable?: boolean }>();
const emit = defineEmits<{ (e: 'update:selectedColor', color: number): void }>();

const selectedColor = ref<number | null | undefined>(props.selectedColor || -1);

function selectColor(color: number) {
  selectedColor.value = color;
  emit('update:selectedColor', color);
}
</script>

<style scoped>
.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-contrast-2);
}

.color-option {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
}
.selected {
  outline-offset: 2px;
}
</style>
