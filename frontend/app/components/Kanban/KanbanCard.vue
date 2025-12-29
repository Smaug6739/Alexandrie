<template>
  <div class="kanban-card" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
    <div class="card-header">
      <div class="card-header-left">
        <span class="card-icon" :class="getAppColor(node.color as number || props.parent.color as number, true)">
          <Icon :name="node.icon || 'file'" display="sm" />
        </span>

        <NuxtLink :to="`/dashboard/docs/${node.id}`" class="card-title">
          {{ node.name }}
        </NuxtLink>
      </div>
      <span v-if="node.order === -1" class="pin-badge" title="Pinned">
        <Icon name="pin" />
      </span>
    </div>

    <p v-if="node.description" class="card-description">{{ node.description }}</p>
    <div class="card-footer">
      <div v-if="node.tags" class="card-tags">
        <span v-for="tag in parsedTags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <span class="card-date">{{ formatDate(node.updated_timestamp) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps<{ node: Node; parent: Node }>();
const emit = defineEmits<{
  dragStart: [node: Node];
  dragEnd: [];
}>();

const parsedTags = computed(() => {
  if (!props.node.tags) return [];
  return props.node.tags
    .split(',')
    .slice(0, 2)
    .map(t => t.trim());
});

const onDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', String(props.node.id));
  emit('dragStart', props.node);
};

const onDragEnd = () => {
  emit('dragEnd');
};
</script>

<style scoped lang="scss">
.kanban-card {
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  cursor: grab;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: var(--shadow-sm);
    cursor: grabbing;
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  display: flex;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;

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
    fill: var(--font-color-light);
  }
}

.card-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--font-color-dark);
  transition: color $transition-duration;
  margin-bottom: 4px;
  text-decoration: none;

  &:hover {
    color: var(--primary);
  }
}

.card-description {
  display: -webkit-box;
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--font-color-light);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
}

.card-tags {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
  gap: 4px;
}

.tag {
  max-width: 80px;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  color: var(--font-color-light);
  background: var(--bg-contrast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-date {
  font-size: 10px;
  color: var(--font-color-light);
  white-space: nowrap;
}
</style>
