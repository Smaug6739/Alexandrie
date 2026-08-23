<template>
  <div class="kanban-card" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
    <div class="card-header">
      <div class="card-header-left">
        <span class="card-icon" :class="getAppAccent((node.color as number) || (props.parent.color as number), true)">
          <Icon :name="node.icon || 'file'" display="sm" />
        </span>

        <NuxtLink :to="`/dashboard/docs/${node.id}`" class="card-title"> {{ node.name }} </NuxtLink>
      </div>
      <div class="card-header-right">
        <span v-if="node.order === -1" class="pin-badge" title="Pinned">
          <Icon name="pin" />
        </span>
      </div>
    </div>

    <p v-if="node.description" class="card-description">{{ node.description }}</p>
    <div class="assignments">
      <span v-for="userId in users" :key="userId" class="assignment">
        <p class="hint-tooltip">{{ userStore.getById(userId)?.username }}</p>
        <UserAvatar :user="userStore.getById(userId)" :size="'sm'" />
      </span>
    </div>
    <div class="card-footer">
      <div class="card-tags">
        <span v-for="tag in parsedTags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="card-footer-right">
        <span class="card-date">{{ shortDate(node.updated_timestamp) }}</span>
        <AppBtnIcon icon="manage_access" display="sm" @click="openAssignModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AssignModal from './Assign.modal.vue';
import type { Node } from '~/stores';
import type { KanbanMetadata } from './Board.vue';

const props = defineProps<{ node: Node; parent: Node }>();
const emit = defineEmits<{ dragStart: [node: Node]; dragEnd: []; assign: [userId: string]; unassign: [userId: string] }>();

const userStore = useUserStore();

const { getAppAccent } = useAppColors();
const { shortDate } = useDateFormatters();
const modals = useModal();

const parsedTags = computed(() => {
  if (!props.node.tags) return [];
  return props.node.tags
    .split(',')
    .slice(0, 2)
    .map(t => t.trim());
});

const users = computed(() => {
  const kanbanBoard = (props.parent.metadata as KanbanMetadata)?.kanban?.users || {};
  return kanbanBoard[props.node.id] || [];
});

const onDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', String(props.node.id));
  emit('dragStart', props.node);
};

const onDragEnd = () => {
  emit('dragEnd');
};
const openAssignModal = () => {
  modals.add(
    new Modal(shallowRef(AssignModal), {
      props: {
        nodeId: props.node.id,
        boardId: props.parent.id,
        assign: (userId: string) => emit('assign', userId),
        unassign: (userId: string) => emit('unassign', userId),
      },
    }),
  );
};
</script>

<style scoped lang="scss">
.kanban-card {
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  cursor: grab;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-sm-md);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: var(--shadow-sm-sm);
    cursor: grabbing;
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentcolor;
  }
}

.pin-badge {
  display: flex;
  align-items: center;

  :deep(svg) {
    width: 14px;
    height: 14px;
    fill: var(--text-secondary);
  }
}

.card-title {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  text-decoration: none;
  transition: color $transition-base;

  &:hover {
    color: var(--primary);
  }
}

.card-description {
  display: -webkit-box;
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-secondary);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.assignments {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  .assignment {
    position: relative;
    display: flex;
    align-items: center;
  }
  .assignment:hover .hint-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.card-tags {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
}

.tag {
  max-width: 80px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 500;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--surface-raised);
  overflow: hidden;
}

.card-footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-date {
  font-size: 10px;
  color: var(--text-secondary);
  white-space: nowrap;
}
</style>
