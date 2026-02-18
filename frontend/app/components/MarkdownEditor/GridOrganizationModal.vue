<template>
  <div>
    <EditorAppHeader icon="grid" :title="t('markdown.markdown.table.title')" :subtitle="t('markdown.markdown.table.subtitle')" />

    <div>
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
        <span v-if="hoveredSize">{{ t('markdown.markdown.table.tableSize', { rows: hoveredSize.rows, columns: hoveredSize.columns }) }}</span>
        <span v-else>{{ t('markdown.markdown.table.hoverHint') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';

const { t } = useI18nT();
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
</script>

<style scoped lang="scss">
.table-grid {
  display: grid;
  max-width: 350px;
  padding: 4px;
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  gap: 4px;
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
  border: 1px solid var(--border);
  transition:
    border-color $transition-base ease,
    background-color $transition-base ease,
    opacity $transition-base ease;
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
    box-shadow: var(--shadow-md);
    opacity: 1;
  }
}

.table-info {
  max-width: 400px;
  min-height: 20px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  box-shadow: var(--shadow-md);
  margin-left: auto;
  margin-right: auto;
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
