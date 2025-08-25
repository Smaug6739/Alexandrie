<template>
  <div class="color-picker-modal">
    <div class="modal-header">
      <div class="header-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="13.5" cy="6.5" r=".5" />
          <circle cx="17.5" cy="10.5" r=".5" />
          <circle cx="8.5" cy="7.5" r=".5" />
          <circle cx="6.5" cy="12.5" r=".5" />
          <path
            d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
          />
        </svg>
      </div>
      <h3>Color Palette</h3>
      <p class="header-subtitle">Choose from predefined colors or use the color wheel</p>
    </div>

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
const props = defineProps<{
  onColorSelect: (color: string) => void;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const hexColor = ref('');
const hoveredColor = ref<string | null>(null);
const colorWheel = ref<HTMLCanvasElement>();
const isSelecting = ref(false);
const hue = ref(0);
const saturation = ref(100);
const brightness = ref(100);
const selectedWheelColor = ref('#FF0000');
const cursorPosition = ref({ x: 150, y: 75 });

const availableColors = ['primary', ...Array.from({ length: 8 }, (_, i) => getAppColor(i))];

const isValidHex = computed(() => {
  return hexColor.value && /^[0-9A-F]{6}$/i.test(hexColor.value);
});

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
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const deltaX = x - centerX;
  const deltaY = y - centerY;

  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const maxDistance = Math.min(centerX, centerY);

  if (distance <= maxDistance) {
    cursorPosition.value = { x, y };

    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    hue.value = angle < 0 ? angle + 360 : angle;

    saturation.value = Math.min(100, (distance / maxDistance) * 100);

    updateWheelColor();
  }
};

const selectColorFromWheel = (e: MouseEvent) => {
  updateColorSelection(e);
  hexColor.value = selectedWheelColor.value.replace('#', '');
};

const validateWheelColor = () => {
  props.onColorSelect(selectedWheelColor.value);
  emit('close');
};

const updateWheelColor = () => {
  const h = hue.value;
  const s = saturation.value;
  const v = brightness.value;

  selectedWheelColor.value = hsvToHex(h, s, v);
};

const hsvToHex = (h: number, s: number, v: number): string => {
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v / 100 - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const rHex = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const gHex = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, '0');
  const bHex = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`.toUpperCase();
};

const drawColorWheel = () => {
  if (!colorWheel.value) return;

  const canvas = colorWheel.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  ctx.clearRect(0, 0, width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance <= radius) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const hue = angle < 0 ? angle + 360 : angle;
        const saturation = Math.min(100, (distance / radius) * 100);
        const value = 100;

        const color = hsvToHex(hue, saturation, value);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  // Draw outer circle
  ctx.strokeStyle = 'var(--border-color)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

const applyCustomColor = () => {
  if (isValidHex.value) {
    props.onColorSelect(`#${hexColor.value}`);
    emit('close');
  }
};

const validateHexInput = () => {
  hexColor.value = hexColor.value.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
};

const closeModal = () => {
  emit('close');
};

onMounted(async () => {
  await nextTick();
  if (colorWheel.value) {
    colorWheel.value.width = 240;
    colorWheel.value.height = 120;
    drawColorWheel();
  }
});
</script>

<style scoped lang="scss">
.color-picker-modal {
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 20px 0;
  flex-shrink: 0;
  text-align: center;

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: white;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 800;
    color: var(--font-color-dark);
    letter-spacing: -0.8px;
    background: linear-gradient(135deg, var(--font-color-dark), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--font-color-light);
    font-weight: 500;
    line-height: 1.4;
    max-width: 280px;
  }
}

.modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  overflow-y: auto;
  min-height: 0;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--bg-color-secondary);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;

    &:hover {
      background: var(--primary);
    }
  }
}

.section {
  .section-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 700;
    color: var(--font-color-dark);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    padding-left: 16px;
    display: flex;
    align-items: center;
    gap: 12px;

    .section-icon {
      width: 20px;
      height: 20px;
      color: var(--primary);
      flex-shrink: 0;
    }

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg, var(--primary), var(--primary-dark));
      border-radius: 2px;
    }
  }
}

.swatches {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  padding: 0 8px;
  margin-bottom: 8px;
}

.swatch {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 3px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);

  &.primary-color {
    border-color: var(--primary);
    box-shadow: 0 6px 20px rgba(var(--primary-rgb), 0.3);
  }

  .swatch-inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .swatch-check {
    color: white;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

    svg {
      width: 18px;
      height: 18px;
    }
  }

  &:hover {
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    border-color: var(--primary);

    &.primary-color {
      box-shadow: 0 16px 40px rgba(var(--primary-rgb), 0.4);
    }
  }

  &:active {
    transform: translateY(-2px) scale(1.05);
  }
}

.custom {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, var(--bg-color-secondary), var(--bg-color));
  border-radius: 16px;
  border: 1px solid var(--border-color);
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
}

.color-wheel-section {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.color-wheel-container {
  position: relative;
  flex-shrink: 0;
}

.color-wheel {
  border-radius: 12px;
  cursor: crosshair;
  border: 2px solid var(--border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.color-wheel-cursor {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.color-controls {
  flex: 1;
  display: flex;
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
  width: 100%;
  height: 6px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  position: relative;
  z-index: 2;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    border: none;
  }
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--border-color);
  border-radius: 3px;
  transform: translateY(-50%);
  z-index: 1;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  border-radius: 3px;
  transition: width 0.1s ease;
}

.selected-color-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.preview-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .hex-value {
    font-size: 14px;
    font-weight: 700;
    color: var(--font-color-dark);
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }

  .hsv-values {
    font-size: 11px;
    color: var(--font-color-light);
    font-weight: 500;
  }
}

.validate-wheel-btn {
  padding: 12px 16px;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  width: 100%;
  margin-top: 4px;
  min-height: 40px;
  position: relative;
  z-index: 100;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #2563eb, #1e40af);
    border-color: #1e3a8a;

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
    transition: all 0.3s ease;
    color: white;
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
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
    transform: scale(1.02);
  }
}

.input-prefix {
  padding: 0 10px;
  color: var(--font-color-light);
  font-weight: 600;
  font-size: 14px;
  background: var(--bg-color-secondary);
  border-right: 1px solid var(--border-color);
}

.hex {
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--font-color-dark);
  font-size: 14px;
  font-weight: 600;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  letter-spacing: 1px;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--font-color-light);
    font-weight: 400;
  }
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 2px solid var(--border-color);
  position: relative;
  overflow: hidden;

  .preview-border {
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 8px;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
    animation: shimmer 2s infinite;
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
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:not(:disabled) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(var(--primary-rgb), 0.4);

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
  padding: 20px 0;
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-shrink: 0;

  .cancel-btn {
    padding: 12px 24px;
    border: 2px solid var(--border-color);
    border-radius: 10px;
    background: var(--bg-color-secondary);
    color: var(--font-color-dark);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      background: var(--border-color);
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 768px) {
  .color-picker-modal {
    padding: 0 16px;
  }

  .modal-header {
    padding: 24px 0 20px 0;

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
      font-size: 13px;
      max-width: 240px;
    }
  }

  .modal-content {
    gap: 24px;
  }

  .swatches {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 0 4px;
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
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
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

@media (max-width: 480px) {
  .swatches {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
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
    font-size: 14px;
    padding: 12px 14px;
  }

  .apply {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
