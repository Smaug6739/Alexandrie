<template>
  <div class="color-picker">
    <div
      v-if="nullable"
      class="color-option"
      style="border: 1px solid var(--border-color); background-color: white"
      :style="{ outline: selectedColor == -1 ? '2px solid var(--font-color-light)' : '' }"
      :class="{ selected: selectedColor === -1 }"
      @click="selectColor(-1)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">Unset</p>
      </div>
    </div>
    <div
      class="color-option"
      style="background-color: var(--default)"
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
      :style="{
        backgroundColor: getAppColor(index) ? `var(--${getAppColor(index)})` : '#fff',
        outline: selectedColor === index ? `2px solid var(--${getAppColor(index)})` : 'none',
      }"
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
  padding: 6px;
  border-radius: 6px;
  flex-wrap: wrap;
  gap: 8px;
}

.color-option {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  cursor: pointer;
}

.selected {
  outline-offset: 2px;
}

.hint-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 0.25rem;
}

.hint-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  z-index: 100;
  display: none;
  padding: 0.4rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 0.75rem;
  color: white;
  background-color: #1f2937;
  box-shadow: 0 2px 8px var(--shadow);
  margin-top: 0.4rem;
  text-transform: capitalize;
  transform: translateX(-50%);
  white-space: nowrap;
}

.color-option:hover .hint-tooltip {
  display: block;
}
</style>
