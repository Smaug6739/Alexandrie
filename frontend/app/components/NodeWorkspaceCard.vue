<template>
  <div class="card" :class="getAppColor(workspace.color as number, true)">
    <div class="header">
      <span class="title">
        <Icon :name="workspace.icon || 'workspace'" class="icon" />
        <h3 class="name">{{ workspace.name }}</h3>
      </span>
      <span class="count">{{ getWorkspaceDocCount(workspace.id) }}</span>
    </div>

    <p v-if="workspace.description" class="desc">{{ workspace.description }}</p>
    <div class="children">
      <span v-for="child in getWorkspaceCategories(workspace.id).slice(0, 3)" :key="child.id" class="child-badge">
        {{ child.name }}
      </span>
      <span v-if="getWorkspaceCategories(workspace.id).length > 3" class="child-more"> +{{ getWorkspaceCategories(workspace.id).length - 3 }} </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const nodesStore = useNodesStore();

defineProps<{ workspace: Node }>();

// Get workspace categories
const getWorkspaceCategories = (workspaceId: string) => {
  return nodesStore.categories.filter(n => n.parent_id === workspaceId).toArray();
};

// Get document count for a workspace
const getWorkspaceDocCount = (workspaceId: string) => {
  const allChildren = nodesStore.getAllChildrensIds(workspaceId);
  return nodesStore.documents.filter(d => allChildren.includes(d.id)).size;
};
</script>

<style scoped lang="scss">
.card {
  display: flex;
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--font-color);
  background: var(--bg-color);
  transition: all 0.2s;
  flex-direction: column;
  text-decoration: none;

  &:hover {
    box-shadow: 0 4px 16px rgb(0 0 0 / 10%);
    transform: translateY(-2px);
  }

  // Color variants - generated
  @each $color in ('blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'primary') {
    &.#{$color} {
      border-left: 4px solid var(--#{$color});
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.5rem;
  color: var(--primary);
}

.count {
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: var(--font-color-light);
  background: var(--bg-contrast);
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.desc {
  display: -webkit-box;
  font-size: 0.85rem;
  color: var(--font-color-light);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.children {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.child-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--font-color-light);
  background: var(--bg-contrast);
}

.child-more {
  font-size: 0.75rem;
  color: var(--font-color-light);
}
</style>
