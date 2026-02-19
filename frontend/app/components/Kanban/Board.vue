<template>
  <div class="kanban-board">
    <div ref="boardContent" class="board-content">
      <TransitionGroup name="column-list" tag="div" class="columns-wrapper">
        <KanbanColumn
          v-for="column in sortedColumns"
          :key="column.id"
          :column="column"
          :parent="props.workspace"
          :cards="getCardsForColumn(column.id)"
          @drop="handleCardDrop"
          @delete="deleteColumn"
          @update="updateColumn"
          @add-card="$emit('createDocument', $event)"
          @card-drag-start="draggedNode = $event"
          @card-drag-end="draggedNode = null"
        />
      </TransitionGroup>

      <!-- Add Column Button -->
      <button class="add-column-btn" @click="addColumn">
        <Icon name="plus" />
        <span>{{ t('components.kanban.addColumn') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KanbanColumnData } from './Column.vue';
import type { Node } from '~/stores';

export interface KanbanMetadata {
  kanban?: {
    columns: KanbanColumnData[];
    cardColumns: Record<string, string>; // nodeId -> columnId
  };
}

const { t } = useI18nT();
const props = defineProps<{
  workspace: Node;
  documents: Node[];
}>();

const emit = defineEmits<{
  updateMetadata: [metadata: KanbanMetadata];
  createDocument: [columnId: string];
}>();

const draggedNode = ref<Node | null>(null);
const boardContent = ref<HTMLElement | null>(null);

// Get kanban data from workspace metadata
const kanbanData = computed(() => {
  const meta = props.workspace.metadata as KanbanMetadata | undefined;
  return (
    meta?.kanban ?? {
      columns: getDefaultColumns(),
      cardColumns: {},
    }
  );
});

const sortedColumns = computed(() => [...kanbanData.value.columns].sort((a, b) => a.order - b.order));

// Default columns
function getDefaultColumns(): KanbanColumnData[] {
  return [
    { id: '0', title: 'Backlog', color: 1, order: 0 },
    { id: '1', title: 'To Do', color: 6, order: 1 },
    { id: '2', title: 'In Progress', color: 3, order: 2 },
    { id: '3', title: 'Done', color: 5, order: 3 },
  ];
}

// Get cards for a specific column
function getCardsForColumn(columnId: string): Node[] {
  const cardColumns = kanbanData.value.cardColumns;

  return props.documents.filter(doc => {
    const assignedColumn = cardColumns[String(doc.id)];
    // If no column assigned, put in first column
    if (!assignedColumn) {
      return columnId === sortedColumns.value[0]?.id;
    }
    return assignedColumn === columnId;
  });
}

// Handle card drop
function handleCardDrop(columnId: string, nodeId: string) {
  const newCardColumns = { ...kanbanData.value.cardColumns };
  newCardColumns[nodeId] = columnId;

  emit('updateMetadata', {
    kanban: {
      columns: kanbanData.value.columns,
      cardColumns: newCardColumns,
    },
  });
}

// Add new column
function addColumn() {
  const newColumn: KanbanColumnData = {
    id: `column-${Date.now()}`,
    title: 'New Column',
    color: -2,
    order: sortedColumns.value.length,
  };

  emit('updateMetadata', {
    kanban: {
      columns: [...kanbanData.value.columns, newColumn],
      cardColumns: kanbanData.value.cardColumns,
    },
  });

  // Scroll to the right to show new column
  nextTick(() => {
    if (boardContent.value) {
      boardContent.value.scrollLeft = boardContent.value.scrollWidth;
    }
  });
}

// Delete column
function deleteColumn(columnId: string) {
  if (sortedColumns.value.length <= 1) {
    return; // Keep at least one column
  }

  // Move cards to first remaining column
  const newCardColumns = { ...kanbanData.value.cardColumns };
  const remainingColumns = kanbanData.value.columns.filter(c => c.id !== columnId);
  const firstColumnId = remainingColumns.sort((a, b) => a.order - b.order)[0]?.id;

  if (firstColumnId) {
    Object.keys(newCardColumns).forEach(nodeId => {
      if (newCardColumns[nodeId] === columnId) {
        newCardColumns[nodeId] = firstColumnId;
      }
    });
  }

  emit('updateMetadata', {
    kanban: {
      columns: remainingColumns,
      cardColumns: newCardColumns,
    },
  });
}

// Update column
function updateColumn(column: KanbanColumnData) {
  const columns = kanbanData.value.columns.map(c => (c.id === column.id ? column : c));

  emit('updateMetadata', {
    kanban: {
      columns,
      cardColumns: kanbanData.value.cardColumns,
    },
  });
}

function resetKanbanData() {
  const data = {
    kanban: {
      columns: getDefaultColumns(),
      cardColumns: {},
    },
  };
  emit('updateMetadata', data);
}
defineExpose({ resetKanbanData });
</script>

<style scoped lang="scss">
.kanban-board {
  display: flex;
  height: 100%;
  min-height: 0;
  flex: 1;
  flex-direction: column;
}

.board-content {
  display: flex;
  padding: 8px 4px 16px;
  flex: 1;
  gap: 16px;
  overflow: auto hidden;
}

.columns-wrapper {
  display: flex;
  gap: 16px;
}

.add-column-btn {
  display: flex;
  min-width: 200px;
  height: stretch;
  padding: 20px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-lg);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  align-items: center;
  cursor: pointer;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  margin-bottom: auto;
  margin-top: auto;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: rgb(57 86 231 / 4%);
  }

  :deep(svg) {
    width: 24px;
    height: 24px;
    fill: currentcolor;
  }
}

// Transitions
.column-list-enter-active,
.column-list-leave-active {
  transition:
    opacity $transition-medium ease,
    transform $transition-medium ease;
}

.column-list-enter-from,
.column-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.column-list-move {
  transition: transform $transition-medium ease;
}
</style>
