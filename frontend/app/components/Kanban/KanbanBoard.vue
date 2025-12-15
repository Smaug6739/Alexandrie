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
        <span>Add column</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import KanbanColumn, { type KanbanColumnData } from './KanbanColumn.vue';
import type { Node } from '~/stores';

export interface KanbanMetadata {
  kanban?: {
    columns: KanbanColumnData[];
    cardColumns: Record<string, string>; // nodeId -> columnId
  };
}

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
    { id: 'backlog', title: 'Backlog', color: 1, order: 0 },
    { id: 'todo', title: 'To Do', color: 6, order: 1 },
    { id: 'in-progress', title: 'In Progress', color: 3, order: 2 },
    { id: 'done', title: 'Done', color: 5, order: 3 },
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
</script>

<style scoped lang="scss">
.kanban-board {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  flex: 1;
}

.board-content {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 8px 4px 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 3px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: var(--border-color);
  }
}

.columns-wrapper {
  display: flex;
  gap: 16px;
}

.add-column-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 200px;
  height: stretch;
  margin-top: auto;
  margin-bottom: auto;
  padding: 20px;
  background: transparent;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  color: var(--font-color-light);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: rgba(57, 86, 231, 0.04);
  }

  :deep(svg) {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
}

// Transitions
.column-list-enter-active,
.column-list-leave-active {
  transition: all 0.3s ease;
}

.column-list-enter-from,
.column-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.column-list-move {
  transition: transform 0.3s ease;
}
</style>
