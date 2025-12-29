<template>
  <div class="color-picker">
    <div
      v-if="nullable"
      class="color-option"
      style="border: 1px solid var(--border-color); background-color: white"
      :style="{ outline: modelValue == -1 ? '2px solid var(--font-color-light)' : '' }"
      :class="{ selected: modelValue === -1 }"
      @click="selectColor(-1)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">Unset</p>
      </div>
    </div>
    <div
      class="color-option"
      style="background-color: var(--default)"
      :style="{ outline: modelValue == -2 ? '2px solid var(--default)' : '' }"
      :class="{ selected: modelValue === -2 }"
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
        outline: modelValue === index ? `2px solid var(--${getAppColor(index)})` : 'none',
      }"
      :class="{ selected: modelValue === index }"
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
import { appColors } from '~/helpers/constants';

const { getAppColor } = useAppColors();

const props = defineProps<{ modelValue?: number; nullable?: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', color: number): void }>();

const modelValue = ref<number | undefined>(props.modelValue ?? -1);

function selectColor(color: number) {
  modelValue.value = color;
  emit('update:modelValue', color);
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

.color-option:hover .hint-tooltip {
  display: block;
}
</style>
