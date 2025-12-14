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
  flex-direction: column;
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  color: var(--font-color);
  transition: all 0.2s;
  background: var(--bg-color);
  height: 100%;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  // Color variants
  &.blue {
    border-left: 4px solid var(--blue);
  }
  &.red {
    border-left: 4px solid var(--red);
  }
  &.green {
    border-left: 4px solid var(--green);
  }
  &.yellow {
    border-left: 4px solid var(--yellow);
  }
  &.purple {
    border-left: 4px solid var(--purple);
  }
  &.pink {
    border-left: 4px solid var(--pink);
  }
  &.teal {
    border-left: 4px solid var(--teal);
  }
  &.primary {
    border-left: 4px solid var(--primary);
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  background: var(--bg-contrast);
  border-radius: 12px;
  color: var(--font-color-light);
}

.name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.desc {
  font-size: 0.85rem;
  color: var(--font-color-light);
  margin-bottom: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.children {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.child-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: var(--bg-contrast);
  border-radius: 4px;
  color: var(--font-color-light);
}

.child-more {
  font-size: 0.75rem;
  color: var(--font-color-light);
}
</style>
