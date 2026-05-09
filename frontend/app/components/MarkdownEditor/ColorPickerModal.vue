<template>
  <div class="modal-ctn">
    <EditorAppHeader icon="color" :title="t('markdown.colors.title')" :subtitle="t('markdown.colors.subtitle')" />

    <div class="modal-content">
      <h4 class="section-title">{{ t('markdown.colors.quickColors') }}</h4>

      <div class="swatches">
        <button v-for="name in appColors" :key="name" class="swatch" :style="{ background: `var(--${name})` }" @click="selectVarColor(name)">
          <svg class="swatch-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </button>
      </div>

      <div class="custom-row">
        <label class="label">{{ t('markdown.colors.customColors') }}</label>
        <div class="custom-inputs">
          <input v-model="selectedColor" type="color" class="color-input" />
          <input v-model="hex" placeholder="#rrggbb" @input="onHexInput" />
        </div>
      </div>

      <div class="actions-row">
        <AppButton type="secondary" @click="$emit('close')">{{ t('common.actions.cancel') }}</AppButton>
        <AppButton type="primary" @click="applyPickedColor">{{ t('markdown.colors.useColor') }}</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
import { appColors } from '~/helpers/constants';

const props = defineProps<{ onColorSelect: (color: string) => void }>();
const emit = defineEmits(['close']);
const { t } = useI18nT();

const selectedColor = ref('#ff0000');
const hex = ref(selectedColor.value);

const selectVarColor = (name: string) => {
  props.onColorSelect(name);
  emit('close');
};

const applyPickedColor = () => {
  props.onColorSelect(selectedColor.value);
  emit('close');
};

const onHexInput = () => {
  let v = hex.value.trim();
  if (!v) return;
  if (!v.startsWith('#')) v = `#${v}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) selectedColor.value = v;
};

watch(selectedColor, val => (hex.value = val));
</script>

<style scoped lang="scss">
.modal-ctn {
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 12px;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 700;
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-evenly;
}

.swatch {
  display: flex;
  width: 45px;
  height: 45px;
  border-radius: var(--radius-md);
  transition: transform $transition-fast ease;
  cursor: pointer;
  justify-content: center;

  &:hover {
    transform: scale(1.1);

    .swatch-check {
      opacity: 1;
    }
  }

  .swatch-check {
    width: 20px;
    opacity: 0;
    transition: opacity $transition-fast ease;
  }
}

.custom-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-input {
  width: 48px;
  height: 34px;
  padding: 0;
  border: none;
}

.actions-row {
  justify-content: flex-end;
}
</style>
