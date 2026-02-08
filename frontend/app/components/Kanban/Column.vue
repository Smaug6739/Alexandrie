<template>
  <div class="kanban-column" :class="{ 'drag-over': isDragOver }" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div class="column-header">
      <div class="column-title-row">
        <button
          class="column-color-btn"
          title="Change color"
          :style="{ background: `var(--${getAppAccent(column.color, true)})` }"
          @click="toggleColorPicker"
        />
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
            :style="{ backgroundColor: `var(--${getAppAccent(index, true)})` }"
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
import DeleteColumnModal from './DeleteColumn.modal.vue';
import { appColors } from '~/helpers/constants';
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

const { getAppAccent } = useAppColors();

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
  min-width: 300px;
  max-width: 320px;
  padding: 12px;
  border-radius: 12px;
  background: var(--surface-raised);
  flex-direction: column;

  &.drag-over {
    background: rgb(57 86 231 / 6%);
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
  transition: transform $transition-base;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.2);
  }
}

.column-title {
  margin: 0;
  padding: 2px 0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  transition: color $transition-base;
  cursor: pointer;
  flex: 1;

  &:hover {
    color: var(--primary);
  }
}

.column-title-input {
  padding: 4px 8px;
  border: 1px solid var(--primary);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--surface-base);
  box-shadow: 0 0 0 3px rgb(57 86 231 / 10%);
  flex: 1;
  outline: none;
}

.column-count {
  height: fit-content;
  padding: 2px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-base);
}

.column-actions {
  display: flex;
  gap: 2px;
}

.action-btn {
  display: flex;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  background: transparent;
  align-items: center;
  cursor: pointer;
  justify-content: center;

  &:hover {
    color: var(--text-body);
    background: var(--surface-base);
  }

  &.danger:hover {
    color: var(--red);
    background: var(--red-bg);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentcolor;
  }
}

.color-picker {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  display: flex;
  max-width: 180px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface-base);
  box-shadow: var(--shadow-sm-md);
  flex-wrap: wrap;
  gap: 6px;
}

.color-option {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: var(--text-primary);
    box-shadow: 0 0 0 2px var(--surface-base);
  }
}

.column-content {
  display: flex;
  min-height: 120px;
  max-height: 60vh;
  margin: -4px;
  padding: 4px;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: transparent;
  }

  &:hover::-webkit-scrollbar-thumb {
    background: var(--border);
  }
}

.empty-state {
  display: flex;
  padding: 32px 16px;
  border: 2px dashed var(--border);
  border-radius: 8px;
  color: var(--text-secondary);
  text-align: center;
  background: rgb(0 0 0 / 2%);
  align-items: center;
  flex-direction: column;
  justify-content: center;

  :deep(svg) {
    width: 24px;
    height: 24px;
    opacity: 0.5;
    fill: currentcolor;
    margin-bottom: 8px;
  }

  p {
    margin: 0 0 2px;
    font-size: 13px;
    font-weight: 500;
  }

  span {
    font-size: 11px;
    opacity: 0.7;
  }
}

.add-card-btn {
  display: flex;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface-base);
  align-items: center;
  cursor: pointer;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;

  &:hover {
    color: var(--primary);
    background: rgb(57 86 231 / 8%);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentcolor;
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
