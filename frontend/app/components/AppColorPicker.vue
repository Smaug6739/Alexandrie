<template>
  <div class="color-picker">
    <div
      class="color-option"
      style="background-color: white; border: 1px solid var(--border-color)"
      :style="{ outline: selectedColor == -1 ? '2px solid var(--font-color-light)' : '' }"
      :class="{ selected: selectedColor === -1 }"
      @click="selectColor(-1)"
      v-if="nullable"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">Unset</p>
      </div>
    </div>
    <div
      class="color-option"
      style="background-color: var(--default); border: 1px solid var(--default-border)"
      :style="{ outline: selectedColor == -2 ? '2px solid var(--default)' : '' }"
      :class="{ selected: selectedColor === -2 }"
      @click="selectColor(-2)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">Primary</p>
      </div>
    </div>
    <div
      v-for="(_, index) in appColors"
      :key="index"
      class="color-option"
      :style="{ backgroundColor: getAppColor(index) ? `var(--${getAppColor(index)})` : '#fff', border: '1px solid var(--border-color)', outline: selectedColor === index ? `2px solid var(--${getAppColor(index)})` : 'none' }"
      :class="{ selected: selectedColor === index }"
      @click="selectColor(index)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">
          {{ getAppColor(index) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ selectedColor?: number; nullable?: boolean }>();
const emit = defineEmits<{ (e: 'update:selectedColor', color: number): void }>();

const selectedColor = ref<number | undefined>(props.selectedColor ?? -1);

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
}

.color-option {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
}
.selected {
  outline-offset: 2px;
}
.hint-wrapper {
  position: relative;
  margin-left: 0.25rem;
  display: inline-block;
}
.hint-tooltip {
  display: none;
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
  text-transform: capitalize;
}
.color-option:hover .hint-tooltip {
  display: block;
}
</style>
