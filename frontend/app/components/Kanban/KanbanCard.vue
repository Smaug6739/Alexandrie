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
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  cursor: grab;
  transition: all $transition-duration $transition-duration;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
    box-shadow: var(--shadow-sm);
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
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: currentColor;
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
  color: var(--font-color-dark);
  margin-bottom: 4px;
  text-decoration: none;
  line-height: 1.3;
  transition: color $transition-duration;

  &:hover {
    color: var(--primary);
  }
}

.card-description {
  font-size: 12px;
  color: var(--font-color-light);
  margin: 0 0 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.tag {
  font-size: 10px;
  font-weight: 500;
  padding: 2px 6px;
  background: var(--bg-contrast);
  border-radius: 6px;
  color: var(--font-color-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.card-date {
  font-size: 10px;
  color: var(--font-color-light);
  white-space: nowrap;
}
</style>
