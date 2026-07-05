<template>
  <div class="workspace-tile" :class="getAppAccent(workspace.color, true)">
    <div class="glow-ambiance" />

    <div class="tile-content">
      <div class="top-row">
        <div :class="['icon-box', getAppAccent(workspace.color, true)]">
          <Icon :name="workspace.icon || 'workspace'" class="ws-icon" />
          <span class="status-dot" />
        </div>

        <div class="doc-badge">
          <span class="count-number">{{ docCount }}</span>
          <span class="count-label">doc{{ docCount > 1 ? 's' : '' }}</span>
        </div>
      </div>

      <div class="meta-zone">
        <h3 class="ws-title" :title="workspace.name">{{ workspace.name }}</h3>
        <p v-if="workspace.description" class="ws-description">
          {{ workspace.description }}
        </p>
      </div>

      <div v-if="categories.length > 0" class="tile-footer">
        <div class="category-pills">
          <span v-for="child in categories.slice(0, 2)" :key="child.id" class="pill">
            {{ child.name }}
          </span>
          <span v-if="categories.length > 2" class="pill-more"> +{{ categories.length - 2 }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Node } from '~/stores';

const props = defineProps<{ workspace: Node }>();

const nodesStore = useNodesStore();
const { getAppAccent } = useAppColors();

const categories = computed(() => {
  const childrenIds = nodesStore.getAll.getChildrenIds(props.workspace.id);
  return childrenIds.map(id => nodesStore.getById(id)).filter((n): n is Node => !!n && (n.role === 1 || n.role === 2));
});

const docCount = computed(() => {
  return nodesStore
    .getDescendantIds(props.workspace.id)
    .map(id => nodesStore.getById(id))
    .filter(n => n?.role === 3).length;
});
</script>

<style scoped lang="scss">
.workspace-tile {
  position: relative;
  display: flex;
  height: 100%;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  transition:
    border-color $transition-fast ease,
    background-color $transition-fast ease,
    box-shadow $transition-fast ease,
    transform $transition-fast cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    border-color: var(--primary);
    background: var(--surface-raised);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);

    .glow-ambiance {
      opacity: 0.08;
      transform: scale(1.1);
    }

    .icon-box {
      .ws-icon {
        transform: scale(1.05);
      }
      .status-dot {
        box-shadow: 0 0 8px var(--primary);
      }
    }
  }
}

.glow-ambiance {
  position: absolute;
  top: -20%;
  right: -20%;
  z-index: 0;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, color-mix(in srgb, var(--primary) 25%, transparent) 0%, transparent 75%);
  opacity: 0;
  pointer-events: none;
  filter: blur(30px);
  transition:
    opacity $transition-base ease,
    transform $transition-base ease;
}

.tile-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.icon-box {
  position: relative;
  display: flex;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  align-items: center;
  justify-content: center;

  .ws-icon {
    font-size: 1.25rem;
    transition: transform $transition-fast ease;
  }

  .status-dot {
    position: absolute;
    top: -1px;
    right: -1px;
    width: 8px;
    height: 8px;
    border: 2px solid var(--surface-base);
    border-radius: 50%;
    background: var(--primary);
    transition: box-shadow $transition-fast ease;

    .workspace-tile:hover & {
      border-color: var(--surface-raised);
    }
  }
}

.doc-badge {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  color: var(--text-body);

  .count-number {
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .count-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
  }
}

.meta-zone {
  margin-bottom: 1.25rem;
  flex: 1;

  .ws-title {
    margin: 0 0 0.35rem 0;
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-body);
    letter-spacing: -0.01em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ws-description {
    display: -webkit-box;
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--text-secondary);
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
}

.tile-footer {
  border-top: 1px solid var(--border);
  margin-top: auto;
  padding-top: 0.75rem;
}

.category-pills {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  min-width: 0;

  .pill {
    position: relative;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    padding-left: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--border);
      content: '';
      transform: translateY(-50%);
    }
  }

  .pill-more {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.35rem;
    border-radius: var(--radius-xs);
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-secondary);
    background: var(--surface-raised);
    border: 1px solid var(--border);

    .workspace-tile:hover & {
      background: var(--surface-base);
    }
  }
}
</style>
