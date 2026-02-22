<template>
  <div class="color-picker">
    <div
      v-if="nullable"
      class="color-option"
      style="border: 1px solid var(--border); background-color: white"
      :style="{ outline: modelValue == -1 ? '2px solid var(--text-secondary)' : '' }"
      :class="{ selected: modelValue === -1 }"
      @click="selectColor(-1)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">Unset</p>
      </div>
    </div>
    <div
      class="color-option"
      style="background-color: var(--accent)"
      :style="{ outline: modelValue == -2 ? '2px solid var(--accent)' : '' }"
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
        backgroundColor: getAppAccent(index) ? `var(--${getAppAccent(index)})` : '#fff',
        outline: modelValue === index ? `2px solid var(--${getAppAccent(index)})` : 'none',
      }"
      :class="{ selected: modelValue === index }"
      @click="selectColor(index)"
    >
      <div class="hint-wrapper">
        <p class="hint-tooltip">
          {{ getAppAccent(index) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { appColors } from '~/helpers/constants';

const props = defineProps<{ modelValue?: number; nullable?: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', color: number): void }>();

const { getAppAccent } = useAppColors();

const modelValue = ref<number | undefined>(props.modelValue ?? -1);

const selectColor = (color: number) => {
  modelValue.value = color;
  emit('update:modelValue', color);
};
</script>

<style scoped>
.color-picker {
  display: flex;
  padding: 6px;
  border-radius: var(--radius-sm);
  flex-wrap: wrap;
  gap: 8px;
}

.color-option {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.selected {
  outline-offset: 2px;
}

.hint-tooltip {
  margin-top: 10px;
}
.color-option:hover .hint-tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
