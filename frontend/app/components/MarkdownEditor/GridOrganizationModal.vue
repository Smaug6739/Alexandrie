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

      <div class="quick-presets">
        <div class="presets-grid">
          <div v-for="preset in gridPresets" :key="preset.name" class="preset-item" @click="selectPreset(preset)">
            <div class="preset-visual" :style="getPresetStyle(preset)">
              <div v-for="cell in preset.cells" :key="cell.id" class="preset-cell" :style="getCellStyle(cell)"></div>
            </div>
            <span class="preset-name">{{ preset.name }}</span>
          </div>
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

interface GridCell {
  id: string;
  col: number;
  row: number;
  colspan?: number;
  rowspan?: number;
}

interface GridPreset {
  name: string;
  columns: number;
  rows: number;
  cells: GridCell[];
}

const gridPresets: GridPreset[] = [
  {
    name: '2x2 Grid',
    columns: 2,
    rows: 2,
    cells: [
      { id: '1', col: 1, row: 1 },
      { id: '2', col: 2, row: 1 },
      { id: '3', col: 1, row: 2 },
      { id: '4', col: 2, row: 2 },
    ],
  },
  {
    name: '3x2 Grid',
    columns: 3,
    rows: 2,
    cells: [
      { id: '1', col: 1, row: 1 },
      { id: '2', col: 2, row: 1 },
      { id: '3', col: 3, row: 1 },
      { id: '4', col: 1, row: 2 },
      { id: '5', col: 2, row: 2 },
      { id: '6', col: 3, row: 2 },
    ],
  },
  {
    name: '2x3 Grid',
    columns: 2,
    rows: 3,
    cells: [
      { id: '1', col: 1, row: 1 },
      { id: '2', col: 2, row: 1 },
      { id: '3', col: 1, row: 2 },
      { id: '4', col: 2, row: 2 },
      { id: '5', col: 1, row: 3 },
      { id: '6', col: 2, row: 3 },
    ],
  },
  {
    name: '3x3 Grid',
    columns: 3,
    rows: 3,
    cells: [
      { id: '1', col: 1, row: 1 },
      { id: '2', col: 2, row: 1 },
      { id: '3', col: 3, row: 1 },
      { id: '4', col: 1, row: 2 },
      { id: '5', col: 2, row: 2 },
      { id: '6', col: 3, row: 2 },
      { id: '7', col: 1, row: 3 },
      { id: '8', col: 2, row: 3 },
      { id: '9', col: 3, row: 3 },
    ],
  },

  {
    name: 'Two Column',
    columns: 2,
    rows: 3,
    cells: [
      { id: '1', col: 1, row: 1 },
      { id: '2', col: 2, row: 1 },
      { id: '3', col: 1, row: 2 },
      { id: '4', col: 2, row: 2 },
      { id: '5', col: 1, row: 3 },
      { id: '6', col: 2, row: 3 },
    ],
  },
];

const getPresetStyle = (preset: GridPreset) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${preset.columns}, 1fr)`,
    gridTemplateRows: `repeat(${preset.rows}, 1fr)`,
    gap: '2px',
    width: '100%',
    height: '60px',
  };
};

const getCellStyle = (cell: GridCell) => {
  return {
    gridColumn: cell.colspan ? `span ${cell.colspan}` : `span 1`,
    gridRow: cell.rowspan ? `span ${cell.rowspan}` : `span 1`,
    backgroundColor: 'var(--primary)',
    borderRadius: '2px',
  };
};

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

const selectPreset = (preset: GridPreset) => {
  const gridMarkdown = generateGridMarkdown(preset.columns, preset.rows);
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

.presets-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  margin-bottom: 16px;
}

.preset-item {
  position: relative;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 10px;
  text-align: center;
  background: var(--bg-color-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--primary-light, var(--primary)));
    transition: transform 0.3s ease;
    content: '';
    transform: scaleX(0);
  }

  &:hover {
    border-color: var(--primary);
    background: var(--bg-color);
    box-shadow: 0 12px 32px rgb(0 0 0 / 15%);
    transform: translateY(-4px);

    &::before {
      transform: scaleX(1);
    }

    .preset-visual {
      border-color: var(--primary);
      box-shadow: 0 4px 16px rgb(var(--primary-rgb), 0.2);
    }
  }

  .preset-visual {
    position: relative;
    height: 50px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-color);
    transition: all 0.3s ease;
    margin-bottom: 8px;

    &::after {
      position: absolute;
      border-radius: 4px;
      background: linear-gradient(135deg, rgb(255 255 255 / 10%), rgb(255 255 255 / 5%));
      content: '';
      inset: 0;
      pointer-events: none;
    }
  }

  .preset-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--font-color-dark);
    transition: color 0.3s ease;
  }

  &:hover .preset-name {
    color: var(--primary);
  }
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

  .presets-grid {
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }

  .table-info {
    max-width: 300px;
    padding: 10px;
    font-size: 13px;
  }
}
</style>
