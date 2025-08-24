<template>
  <div class="grid-organization-modal">
    <div class="modal-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#fff">
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h133v-133H200v133Zm213 0h134v-133H413v133Zm214 0h133v-133H627v133ZM200-413h133v-134H200v134Zm213 0h134v-134H413v134Zm214 0h133v-134H627v134ZM200-627h133v-133H200v133Zm213 0h134v-133H413v133Zm214 0h133v-133H627v133Z"
          />
        </svg>
      </div>
      <h3>Table creator</h3>
      <p class="header-subtitle">Choose from predefined table layouts or create your own</p>
    </div>

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
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 16px;
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
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 32px;
}

.table-selector,
.quick-presets {
  margin-top: 8px;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2px;
  margin-bottom: 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 4px;
  background: var(--bg-color);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.table-row {
  display: contents;
}

.table-cell {
  width: 16px;
  height: 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-color-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: var(--primary);
    border-color: var(--primary);
    transform: scale(1.1);
    z-index: 2;
  }

  &.hovered {
    background: var(--primary);
    border-color: var(--primary);
    opacity: 0.8;
  }

  &.selected {
    background: var(--primary);
    border-color: var(--primary);
    opacity: 1;
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.3);
  }
}

.table-info {
  text-align: center;
  padding: 12px;
  background: var(--bg-color-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  font-weight: 500;
  color: var(--font-color-dark);
  min-height: 20px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.preset-item {
  cursor: pointer;
  text-align: center;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg-color-secondary);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--primary-light, var(--primary)));
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    border-color: var(--primary);
    background: var(--bg-color);
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);

    &::before {
      transform: scaleX(1);
    }

    .preset-visual {
      border-color: var(--primary);
      box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.2);
    }
  }

  .preset-visual {
    margin-bottom: 8px;
    border: 2px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-color);
    transition: all 0.3s ease;
    position: relative;
    height: 50px;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 4px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      pointer-events: none;
    }
  }

  .preset-name {
    font-size: 13px;
    color: var(--font-color-dark);
    font-weight: 600;
    transition: color 0.3s ease;
  }

  &:hover .preset-name {
    color: var(--primary);
  }
}

.modal-footer {
  padding: 24px 0;
  display: flex;
  justify-content: flex-end;
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
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      background: var(--border-color);
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@media (max-width: 768px) {
  .table-grid {
    grid-template-columns: repeat(8, 1fr);
    gap: 1px;
    max-width: 300px;

    .table-cell {
      width: 14px;
      height: 14px;
    }
  }

  .presets-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 12px;
  }

  .table-info {
    max-width: 300px;
    font-size: 13px;
    padding: 10px;
  }
}
</style>
