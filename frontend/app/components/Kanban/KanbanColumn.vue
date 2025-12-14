<template>
  <div class="kanban-column" :class="{ 'drag-over': isDragOver }" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div class="column-header">
      <div class="column-title-row">
        <button class="column-color-btn" title="Change color" :style="{ background: `var(--${getAppColor(column.color, true)})` }" @click="toggleColorPicker" />
        <input
          v-if="isEditing"
          ref="titleInput"
          v-model="editedTitle"
          class="column-title-input"
          @blur="saveTitle"
          @keydown.enter="saveTitle"
          @keydown.escape="cancelEdit"
        />
        <h3 v-else class="column-title" @dblclick="startEdit">{{ column.title }}</h3>

        <div class="column-actions">
          <button class="action-btn" title="Edit name" @click="startEdit">
            <Icon name="edit" />
          </button>
          <button class="action-btn danger" title="Delete column" @click="confirmDelete">
            <Icon name="delete" />
          </button>
          <span class="column-count">{{ cards.length }}</span>
        </div>
      </div>

      <!-- Color picker dropdown -->
      <Transition name="dropdown">
        <div v-if="showColorPicker" class="color-picker">
          <button
            v-for="(_, index) in appColors"
            :key="index"
            :style="{ backgroundColor: `var(--${getAppColor(index, true)})` }"
            :class="['color-option ', { active: column.color === index }]"
            @click="selectColor(index)"
          />
        </div>
      </Transition>
    </div>

    <div ref="contentRef" class="column-content">
      <TransitionGroup name="card-list">
        <KanbanCard
          v-for="card in cards"
          :key="card.id"
          :node="card"
          :parent="parent"
          @drag-start="$emit('cardDragStart', $event)"
          @drag-end="$emit('cardDragEnd')"
        />
      </TransitionGroup>
      <div v-if="!cards.length" class="empty-state">
        <Icon name="file" />
        <p>No documents</p>
        <span>Drag documents here</span>
      </div>
    </div>

    <button class="add-card-btn" @click="$emit('addCard', column.id)"><Icon name="plus" /> Add document</button>
  </div>
</template>

<script setup lang="ts">
import KanbanCard from './KanbanCard.vue';
import DeleteColumnModal from './DeleteColumnModal.vue';
import type { Node } from '~/stores';

export interface KanbanColumnData {
  id: string;
  title: string;
  color: number;
  order: number;
}

const props = defineProps<{
  column: KanbanColumnData;
  cards: Node[];
  parent: Node;
}>();

const emit = defineEmits<{
  drop: [columnId: string, nodeId: string];
  delete: [columnId: string];
  update: [column: KanbanColumnData];
  addCard: [columnId: string];
  cardDragStart: [node: Node];
  cardDragEnd: [];
}>();

const isDragOver = ref(false);
const isEditing = ref(false);
const editedTitle = ref(props.column.title);
const showColorPicker = ref(false);
const titleInput = ref<HTMLInputElement | null>(null);

const onDragOver = () => {
  isDragOver.value = true;
};

const onDragLeave = (e: DragEvent) => {
  // Only set false if leaving the column entirely
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
    isDragOver.value = false;
  }
};

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  const nodeId = e.dataTransfer?.getData('text/plain');
  if (nodeId) {
    emit('drop', props.column.id, nodeId);
  }
};

const startEdit = () => {
  showColorPicker.value = false;
  editedTitle.value = props.column.title;
  isEditing.value = true;
  nextTick(() => titleInput.value?.focus());
};

const saveTitle = () => {
  if (editedTitle.value.trim()) {
    emit('update', { ...props.column, title: editedTitle.value.trim() });
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  editedTitle.value = props.column.title;
  isEditing.value = false;
};

const toggleColorPicker = () => {
  showColorPicker.value = !showColorPicker.value;
};

const selectColor = (color: number) => {
  emit('update', { ...props.column, color });
  showColorPicker.value = false;
};

const confirmDelete = () => {
  useModal().add(
    new Modal(shallowRef(DeleteColumnModal), {
      props: {
        columnTitle: props.column.title,
        cardCount: props.cards.length,
        onConfirm: () => emit('delete', props.column.id),
      },
      size: 'small',
    }),
  );
};

// Close color picker on click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (!target.closest('.column-header')) {
    showColorPicker.value = false;
  }
}
</script>

<style scoped lang="scss">
.kanban-column {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 320px;
  background: var(--bg-contrast);
  border-radius: 12px;
  padding: 12px;
  transition: all $transition-duration $transition-duration;

  &.drag-over {
    background: rgba(57, 86, 231, 0.06);
    box-shadow: inset 0 0 0 2px var(--primary);
  }
}

.column-header {
  position: relative;
  margin-bottom: 12px;
}

.column-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.column-color-btn {
  width: 14px;
  height: 14px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform $transition-duration;

  &:hover {
    transform: scale(1.2);
  }
}

.column-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--font-color-dark);
  margin: 0;
  cursor: pointer;
  padding: 2px 0;
  border-radius: 6px;
  transition: color $transition-duration;

  &:hover {
    color: var(--primary);
  }
}

.column-title-input {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border: 1px solid var(--primary);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--font-color-dark);
  outline: none;
  box-shadow: 0 0 0 3px rgba(57, 86, 231, 0.1);
}

.column-count {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  height: fit-content;
  background: var(--bg-color);
  border-radius: 16px;
  color: var(--font-color-light);
}

.column-actions {
  display: flex;
  gap: 2px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--font-color-light);
  cursor: pointer;
  transition: all $transition-duration $transition-duration;

  &:hover {
    background: var(--bg-color);
    color: var(--font-color);
  }

  &.danger:hover {
    background: var(--red-bg);
    color: var(--red);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  display: flex;
  gap: 6px;
  padding: 10px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-md);
  flex-wrap: wrap;
  max-width: 180px;
}

.color-option {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all $transition-duration $transition-duration;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: var(--font-color-dark);
    box-shadow: 0 0 0 2px var(--bg-color);
  }
}

.column-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 120px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 4px;
  margin: -4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 4px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: var(--border-color);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: var(--font-color-light);
  text-align: center;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);

  :deep(svg) {
    width: 24px;
    height: 24px;
    fill: currentColor;
    opacity: 0.5;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    font-weight: 500;
    margin: 0 0 2px;
  }

  span {
    font-size: 11px;
    opacity: 0.7;
  }
}

.add-card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border: none;
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--font-color-light);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all $transition-duration $transition-duration;

  &:hover {
    color: var(--primary);
    background: rgba(57, 86, 231, 0.08);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }
}

// Transitions
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.2s ease;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.card-list-move {
  transition: transform 0.2s ease;
}
</style>
