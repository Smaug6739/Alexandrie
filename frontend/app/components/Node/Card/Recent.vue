<template>
  <div class="card">
    <div class="header">
      <div class="icon-wrapper">
        <Icon :name="icon" display="xl" :class="['node-icon', getAppAccent(node.color || (category?.color as number), true)]" />
      </div>
      <span class="time">{{ relativeTime(node.updated_timestamp) }}</span>
    </div>

    <div class="card-body">
      <h3 class="title" :title="node.name">{{ node.name }}</h3>
      <p v-if="node.description" class="desc">{{ node.description }}</p>
    </div>

    <div v-if="category || node.tags" class="meta">
      <span v-if="category" class="category" :title="category.name">
        {{ category.name }}
      </span>

      <span v-if="category && node.tags" class="meta-separator">·</span>

      <div v-if="node.tags" class="tags">
        <span v-for="tag in computedTags" :key="tag" class="tag-badge">
          {{ tag }}
        </span>
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
const { getAppAccent } = useAppColors();

const category = nodesStore.getById(props.node.parent_id || '');
const icon = resolveIcon(props.node);

const computedTags = computed(() => {
  if (!props.node.tags) return [];
  return props.node.tags
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
    .slice(0, 2);
});
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  color: var(--text-body);
  text-decoration: none;
  background: var(--surface-base);
  transition:
    border-color $transition-fast ease,
    background-color $transition-fast ease,
    box-shadow $transition-fast ease,
    transform $transition-fast ease;

  &:hover {
    border-color: var(--primary);
    background: var(--surface-raised);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node-icon {
  padding: 0.4rem;
  border-radius: var(--radius-sm);
}

.time {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.card-body {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-body);
  text-overflow: ellipsis;
  white-space: nowrap;

  // Sécurité anti-débordement
  overflow: hidden;
}

.desc {
  display: -webkit-box;
  margin: 0 0 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-secondary);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  margin-top: auto;
  padding-top: 0.5rem;
}

.category {
  max-width: 110px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.meta-separator {
  font-size: 0.8rem;
  color: var(--border);
  user-select: none;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.45rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-raised);

  .card:hover & {
    background: var(--surface-base);
  }
}
</style>
