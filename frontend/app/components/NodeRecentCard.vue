<template>
  <div class="card">
    <div class="header">
      <Icon :name="icon" display="xl" :class="`node-icon ${getAppColor(node.color || category?.color as number, true)}`" />
      <span class="time">{{ relativeTime(node.updated_timestamp) }}</span>
    </div>
    <h3 class="title">{{ node.name }}</h3>
    <p v-if="node.description" class="desc">{{ node.description }}</p>
    <div class="meta">
      <span v-if="category" class="category">
        {{ category.name }}
      </span>
      <div v-if="node.tags" class="tags">
        <tag v-for="tag in node.tags.split(',').slice(0, 2)" :key="tag" class="primary">{{ tag.trim() }}</tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { resolveIcon } from '~/helpers/node';
import type { Node } from '~/stores';

const props = defineProps<{ node: Node }>();

const nodesStore = useNodesStore();

const { relativeTime } = useDateFormatters();
const { getAppColor } = useAppColors();

const category = nodesStore.getById(props.node.parent_id || '');
const icon = resolveIcon(props.node);
</script>

<style scoped lang="scss">
.card {
  display: flex;
  height: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--font-color);
  transition: all 0.2s;
  flex-direction: column;
  text-decoration: none;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
    transform: translateY(-2px);
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.time {
  font-size: 0.75rem;
  color: var(--font-color-light);
}

.title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.desc {
  display: -webkit-box;
  font-size: 0.85rem;
  color: var(--font-color-light);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.category {
  font-size: 0.75rem;
  color: var(--font-color-light);
}

.tags {
  display: flex;
}

.node-icon {
  padding: 0.4rem;
  border-radius: 6px;
}
</style>
