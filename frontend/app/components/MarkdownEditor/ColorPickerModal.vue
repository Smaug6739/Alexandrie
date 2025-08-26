<template>
  <div class="color-picker-modal">
    <EditorAppHeader icon="color" title="Select Color" subtitle="Choose a color from the palette or create a custom one." />

    <div class="modal-content">
      <div class="section">
        <h4 class="section-title">Quick Colors</h4>
        <div class="swatches">
          <button
            v-for="color in availableColors"
            :key="color"
            class="swatch"
            :class="{ 'primary-color': color === 'primary' }"
            :style="{ background: `var(--${color})` }"
            :title="color"
            @click="selectColor(color)"
            @mouseenter="hoveredColor = color"
            @mouseleave="hoveredColor = null"
          >
            <div class="swatch-inner">
              <div v-if="hoveredColor === color" class="swatch-check">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20,6 9,17 4,12" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div class="section">
        <h4 class="section-title">Custom Color</h4>
        <div class="custom">
          <div class="color-wheel-section">
            <div class="color-wheel-container">
              <canvas
                ref="colorWheel"
                class="color-wheel"
                @mousedown="startColorSelection"
                @mousemove="updateColorSelection"
                @mouseup="stopColorSelection"
                @click="selectColorFromWheel"
              ></canvas>
              <div
                class="color-wheel-cursor"
                :style="{
                  left: `${cursorPosition.x}px`,
                  top: `${cursorPosition.y}px`,
                  background: selectedWheelColor,
                }"
              ></div>
            </div>

            <div class="color-controls">
              <div class="control-group">
                <label>Brightness</label>
                <div class="slider-container">
                  <input v-model="brightness" type="range" min="0" max="100" class="brightness-slider" @input="updateWheelColor" />
                  <div class="slider-track">
                    <div class="slider-fill" :style="{ width: `${brightness}%` }"></div>
                  </div>
                </div>
              </div>

              <div class="selected-color-preview">
                <div class="preview-circle" :style="{ background: selectedWheelColor }"></div>
                <div class="color-info">
                  <span class="hex-value">{{ selectedWheelColor }}</span>
                  <span class="hsv-values">HSV({{ hue }}, {{ saturation }}%, {{ brightness }}%)</span>
                </div>
              </div>

              <button class="validate-wheel-btn" @click="validateWheelColor">
                <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span class="btn-text">Use This Color</span>
              </button>
            </div>
          </div>

          <div class="input-group">
            <div class="input-wrapper">
              <span class="input-prefix">#</span>
              <input v-model="hexColor" class="hex" placeholder="RRGGBB" maxlength="6" @keyup.enter="applyCustomColor" @input="validateHexInput" />
            </div>
            <div class="color-preview" :style="{ background: hexColor && /^[0-9A-F]{6}$/i.test(hexColor) ? `#${hexColor}` : 'transparent' }">
              <div class="preview-border"></div>
            </div>
          </div>

          <button class="apply" :disabled="!isValidHex" @click="applyCustomColor">
            <span class="btn-text">Apply Color</span>
            <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button class="cancel-btn" @click="closeModal">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span>Cancel</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
const props = defineProps<{ onColorSelect: (color: string) => void }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const hexColor = ref('');
const hoveredColor = ref<string | null>(null);
const colorWheel = ref<HTMLCanvasElement>();
const isSelecting = ref(false);
const hue = ref(0),
  saturation = ref(100),
  brightness = ref(100);
const selectedWheelColor = ref('#FF0000');
const cursorPosition = ref({ x: 150, y: 75 });

const availableColors = ['primary', ...Array.from({ length: 8 }, (_, i) => getAppColor(i))];
const isValidHex = computed(() => hexColor.value && /^[0-9A-F]{6}$/i.test(hexColor.value));

const selectColor = (color: string) => {
  props.onColorSelect(color);
  emit('close');
};

const startColorSelection = (e: MouseEvent) => {
  isSelecting.value = true;
  updateColorSelection(e);
};
const stopColorSelection = () => {
  isSelecting.value = false;
};

const updateColorSelection = (e: MouseEvent) => {
  if (!isSelecting.value || !colorWheel.value) return;
  const rect = colorWheel.value.getBoundingClientRect();
  const x = e.clientX - rect.left,
    y = e.clientY - rect.top;
  const centerX = rect.width / 2,
    centerY = rect.height / 2;
  const dx = x - centerX,
    dy = y - centerY,
    dist = Math.sqrt(dx * dx + dy * dy),
    maxDist = Math.min(centerX, centerY);
  if (dist <= maxDist) {
    cursorPosition.value = { x, y };
    hue.value = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    saturation.value = Math.min(100, (dist / maxDist) * 100);
    updateWheelColor();
  }
};

const selectColorFromWheel = (e: MouseEvent) => {
  updateColorSelection(e);
  hexColor.value = selectedWheelColor.value.slice(1);
};
const validateWheelColor = () => {
  props.onColorSelect(selectedWheelColor.value);
  emit('close');
};

const updateWheelColor = () => {
  selectedWheelColor.value = hsvToHex(hue.value, saturation.value, brightness.value);
};

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return (
    '#' +
    [r, g, b]
      .map(v =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}

function drawColorWheel() {
  if (!colorWheel.value) return;
  const canvas = colorWheel.value,
    ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width,
    h = canvas.height,
    cx = w / 2,
    cy = h / 2,
    r = Math.min(cx, cy) - 10;
  ctx.clearRect(0, 0, w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = x - cx,
        dy = y - cy,
        dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= r) {
        const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
        ctx.fillStyle = hsvToHex(hue, (dist / r) * 100, 100);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  ctx.strokeStyle = 'var(--border-color)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.stroke();
}

const applyCustomColor = () => {
  if (isValidHex.value) {
    props.onColorSelect(`#${hexColor.value}`);
    emit('close');
  }
};
const validateHexInput = () => {
  hexColor.value = hexColor.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
};
const closeModal = () => emit('close');

onMounted(() => {
  nextTick(() => {
    if (colorWheel.value) {
      colorWheel.value.width = 240;
      colorWheel.value.height = 120;
      drawColorWheel();
    }
  });
});
</script>

<style scoped lang="scss">
.color-picker-modal {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
  flex-direction: column;
  overflow: hidden;
}

.modal-content {
  display: flex;
  min-height: 0;
  padding: 0;
  flex: 1;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: var(--bg-color-secondary);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--border-color);

    &:hover {
      background: var(--primary);
    }
  }
}

.section {
  .section-title {
    position: relative;
    display: flex;
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 700;
    color: var(--font-color-dark);
    align-items: center;
    gap: 12px;
    letter-spacing: 0.5px;
    padding-left: 16px;
    text-transform: uppercase;

    .section-icon {
      width: 20px;
      height: 20px;
      color: var(--primary);
      flex-shrink: 0;
    }

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 16px;
      border-radius: 2px;
      background: linear-gradient(180deg, var(--primary), var(--primary-dark));
      content: '';
      transform: translateY(-50%);
    }
  }
}

.swatches {
  display: grid;
  padding: 0 8px;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  margin-bottom: 8px;
}

.swatch {
  position: relative;
  width: 48px;
  height: 48px;
  border: 3px solid transparent;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;

  &.primary-color {
    border-color: var(--primary);
    box-shadow: 0 6px 20px rgb(var(--primary-rgb), 0.3);
  }

  .swatch-inner {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  .swatch-check {
    color: white;
    filter: drop-shadow(0 2px 4px rgb(0 0 0 / 30%));

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 12px 32px rgb(0 0 0 / 25%);
    transform: translateY(-4px) scale(1.1);

    &.primary-color {
      box-shadow: 0 16px 40px rgb(var(--primary-rgb), 0.4);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.05);
  }
}

.custom {
  display: flex;
  padding: 20px;
  border-radius: 16px;
  flex-direction: column;
  gap: 20px;
}

.color-wheel-section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.color-wheel-container {
  position: relative;
  flex-shrink: 0;
}

.color-wheel {
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: crosshair;
}

.color-wheel-cursor {
  position: absolute;
  z-index: 10;
  width: 16px;
  height: 16px;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 30%);
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.color-controls {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: var(--font-color-dark);
    margin-bottom: 6px;
  }
}

.slider-container {
  position: relative;
}

.brightness-slider {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 6px;
  background: transparent;
  appearance: none;
  cursor: pointer;
  outline: none;

  &::-webkit-slider-thumb {
    width: 18px;
    height: 18px;
    border: 2px solid white;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    appearance: none;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
    cursor: pointer;
  }
}

.slider-track {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  z-index: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  transform: translateY(-50%);
}

.slider-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  transition: width 0.1s ease;
}

.selected-color-preview {
  display: flex;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  align-items: center;
  gap: 12px;
}

.preview-circle {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
  flex-shrink: 0;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .hex-value {
    font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--font-color-dark);
  }

  .hsv-values {
    font-size: 11px;
    font-weight: 500;
    color: var(--font-color-light);
  }
}

.validate-wheel-btn {
  position: relative;
  z-index: 100;
  display: flex;
  width: 100%;
  min-height: 40px;
  padding: 12px 16px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 4px 16px rgb(59 130 246 / 30%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
  cursor: pointer;
  gap: 8px;
  justify-content: center;
  margin-top: 4px;

  &:hover {
    border-color: #1e3a8a;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    box-shadow: 0 8px 24px rgb(59 130 246 / 40%);
    transform: translateY(-2px);

    .btn-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0);
  }

  .btn-icon {
    width: 14px;
    height: 14px;
    color: white;
    transition: all 0.3s ease;
  }

  .btn-text {
    font-weight: 600;
    color: white;
  }
}

.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.input-wrapper {
  display: flex;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-color);
  transition: all 0.3s ease;
  align-items: center;
  flex: 1;
  overflow: hidden;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgb(var(--primary-rgb), 0.1);
    transform: scale(1.02);
  }
}

.input-prefix {
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--font-color-light);
  background: var(--bg-color-secondary);
  border-right: 1px solid var(--border-color);
}

.hex {
  padding: 10px 12px;
  border: none;
  font-family: Monaco, Menlo, 'Ubuntu Mono', monospace;
  font-size: 14px;
  font-weight: 600;
  color: var(--font-color-dark);
  background: transparent;
  flex: 1;
  letter-spacing: 1px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    font-weight: 400;
    color: var(--font-color-light);
  }
}

.color-preview {
  position: relative;
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;

  .preview-border {
    position: absolute;
    border: 2px solid transparent;
    border-radius: 8px;
    background: linear-gradient(45deg, transparent 30%, rgb(255 255 255 / 30%) 50%, transparent 70%);
    animation: shimmer 2s infinite;
    inset: 0;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.apply {
  display: flex;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
  cursor: pointer;
  gap: 8px;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled) {
    &:hover {
      box-shadow: 0 8px 24px rgb(var(--primary-rgb), 0.4);
      transform: translateY(-2px);

      .btn-icon {
        transform: scale(1.1) rotate(5deg);
      }
    }

    &:active {
      transform: translateY(0);
    }
  }

  .btn-text {
    font-weight: 600;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
    transition: all 0.3s ease;
  }
}

.modal-footer {
  display: flex;
  padding: 20px 0;
  flex-shrink: 0;
  gap: 16px;
  justify-content: center;

  .cancel-btn {
    display: flex;
    padding: 12px 24px;
    border: 2px solid var(--border-color);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: var(--font-color-dark);
    background: var(--bg-color-secondary);
    transition: all 0.3s ease;
    align-items: center;
    cursor: pointer;
    gap: 8px;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--border-color);
      box-shadow: 0 6px 20px rgb(0 0 0 / 15%);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (width <= 768px) {
  .color-picker-modal {
    padding: 0 16px;
  }

  .modal-header {
    padding: 24px 0 20px;

    .header-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 12px;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    h3 {
      font-size: 20px;
    }

    .header-subtitle {
      max-width: 240px;
      font-size: 13px;
    }
  }

  .modal-content {
    gap: 24px;
  }

  .swatches {
    padding: 0 4px;
    gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }

  .swatch {
    width: 64px;
    height: 64px;
  }

  .custom {
    padding: 20px;
  }

  .color-wheel-section {
    flex-direction: column;
    gap: 16px;
  }

  .color-wheel {
    width: 250px !important;
    height: 125px !important;
  }

  .validate-wheel-btn {
    padding: 12px 18px;
    font-size: 13px;

    .btn-text {
      font-size: 13px;
    }
  }

  .input-group {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .color-preview {
    align-self: center;
  }

  .apply {
    padding: 14px 24px;
    font-size: 15px;
  }

  .modal-footer {
    padding: 24px 0;

    .cancel-btn {
      padding: 12px 24px;
      font-size: 14px;
    }
  }
}

@media (width <= 480px) {
  .swatches {
    gap: 16px;
    grid-template-columns: repeat(2, 1fr);
  }

  .swatch {
    width: 56px;
    height: 56px;
  }

  .custom {
    padding: 16px;
  }

  .color-wheel {
    width: 200px !important;
    height: 100px !important;
  }

  .validate-wheel-btn {
    padding: 10px 16px;
    font-size: 12px;

    .btn-text {
      font-size: 12px;
    }

    .btn-icon {
      width: 14px;
      height: 14px;
    }
  }

  .hex {
    padding: 12px 14px;
    font-size: 14px;
  }

  .apply {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
