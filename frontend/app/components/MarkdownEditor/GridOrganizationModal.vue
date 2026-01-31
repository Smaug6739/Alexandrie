<template>
  <div class="grid-organization-modal">
    <EditorAppHeader icon="grid" title="Insert Grid" subtitle="Select a grid layout or customize your own by selecting the number of rows and columns." />

    <div class="modal-content">
      <div class="table-selector">
        <div class="table-grid">
          <div v-for="row in 12" :key="`row-${row}`" class="table-row">
            <div
              v-for="col in 12"
              :key="`col-${col}`"
              class="table-cell"
              :class="{
                hovered: isHovered(row, col),
                selected: isSelected(row, col),
              }"
              @mouseenter="handleHover(row, col)"
              @mouseleave="handleHoverLeave()"
              @click="selectTableSize(row, col)"
            ></div>
          </div>
        </div>
        <div class="table-info">
          <span v-if="hoveredSize">{{ hoveredSize.rows }} × {{ hoveredSize.columns }} table</span>
          <span v-else>Hover to see table size</span>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="cancel-btn" @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
const props = defineProps<{
  onGridSelect: (gridMarkdown: string) => void;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const hoveredSize = ref<{ rows: number; columns: number } | null>(null);
const selectedSize = ref<{ rows: number; columns: number } | null>(null);

const isHovered = (row: number, col: number): boolean => {
  if (!hoveredSize.value) return false;
  return row <= hoveredSize.value.rows && col <= hoveredSize.value.columns;
};

const isSelected = (row: number, col: number): boolean => {
  if (!selectedSize.value) return false;
  return row <= selectedSize.value.rows && col <= selectedSize.value.columns;
};

const handleHover = (row: number, col: number) => {
  hoveredSize.value = { rows: row, columns: col };
};

const handleHoverLeave = () => {
  hoveredSize.value = null;
};

const selectTableSize = (row: number, col: number) => {
  selectedSize.value = { rows: row, columns: col };
  const gridMarkdown = generateGridMarkdown(col, row);
  props.onGridSelect(gridMarkdown);
  emit('close');
};

const generateGridMarkdown = (columns: number, rows: number): string => {
  let markdown = '\n';

  markdown += '|';
  for (let i = 0; i < columns; i++) {
    markdown += '  |';
  }
  markdown += '\n';

  markdown += '|';
  for (let i = 0; i < columns; i++) {
    markdown += ' --- |';
  }
  markdown += '\n';

  for (let row = 0; row < rows; row++) {
    markdown += '|';
    for (let col = 0; col < columns; col++) {
      markdown += '  |';
    }
    markdown += '\n';
  }

  markdown += '\n';
  return markdown;
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.grid-organization-modal {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  background: transparent;
  flex-direction: column;
  overflow: auto;
}

.modal-content {
  display: flex;
  padding: 0;
  flex: 1;
  flex-direction: column;
  gap: 32px;
  overflow: auto;
}

.table-selector,
.quick-presets {
  margin-top: 8px;
}

.table-grid {
  display: grid;
  max-width: 400px;
  padding: 4px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  gap: 2px;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: 16px;
  margin-left: auto;
  margin-right: auto;
}

.table-row {
  display: contents;
}

.table-cell {
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    z-index: 2;
    border-color: var(--primary);
    background: var(--primary);
    transform: scale(1.1);
  }

  &.hovered {
    border-color: var(--primary);
    background: var(--primary);
    opacity: 0.8;
  }

  &.selected {
    border-color: var(--primary);
    background: var(--primary);
    box-shadow: 0 0 0 2px rgb(var(--primary-rgb), 0.3);
    opacity: 1;
  }
}

.table-info {
  max-width: 400px;
  min-height: 20px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--font-color-dark);
  text-align: center;
  background: var(--bg-color-secondary);
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
  margin-left: auto;
  margin-right: auto;
}

.modal-footer {
  display: flex;
  padding: 24px 0;
  flex-shrink: 0;
  gap: 16px;
  justify-content: flex-end;

  .cancel-btn {
    padding: 12px 24px;
    border: 2px solid var(--border-color);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: var(--font-color-dark);
    background: var(--bg-color-secondary);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--border-color);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (width <= 768px) {
  .table-grid {
    max-width: 300px;
    gap: 1px;
    grid-template-columns: repeat(8, 1fr);

    .table-cell {
      width: 14px;
      height: 14px;
    }
  }

  .table-info {
    max-width: 300px;
    padding: 10px;
    font-size: 13px;
  }
}
</style>
