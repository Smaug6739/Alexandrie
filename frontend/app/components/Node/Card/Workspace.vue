<template>
  <div class="workspace-tile" :class="accentColorClass">
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
        <h3 class="ws-title">{{ workspace.name }}</h3>
        <p v-if="workspace.description" class="ws-description">
          {{ workspace.description }}
        </p>
      </div>

      <div v-if="categories.length > 0" class="tile-footer">
        <div class="category-pills">
          <span v-for="child in categories.slice(0, 2)" :key="child.id" class="pill">
            {{ child.name }}
          </span>
          <span v-if="categories.length > 2" class="pill-more"> +{{ categories.length - 2 }} autres </span>
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

const accentColorClass = computed(() => {
  const colors = ['blue', 'red', 'green', 'yellow', 'purple', 'pink', 'teal', 'primary'];
  const colorIndex = props.workspace.color as number;
  return colors[colorIndex] || 'primary';
});

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
  --tile-radius: 14px;
  --bg-speed: 0.3s;

  position: relative;
  display: flex;
  height: 100%;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--tile-radius);
  background: var(--surface-base);
  transition:
    border-color var(--bg-speed) ease,
    transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
    box-shadow 0.4s ease;
  cursor: pointer;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    border-color: rgb(var(--primary), 0.35);
    box-shadow:
      0 20px 30px -10px rgb(0 0 0 / 30%),
      0 0 0 1px rgb(var(--primary), 0.1);
    transform: translateY(-6px) scale(1.01);

    .glow-ambiance {
      opacity: 0.12;
      transform: scale(1.2);
    }

    .icon-box {
      .ws-icon {
        transform: scale(1.1);
      }

      .status-dot {
        box-shadow: 0 0 12px var(--primary);
        transform: scale(1.3);
      }
    }
  }
}

.glow-ambiance {
  position: absolute;
  top: -20%;
  right: -20%;
  z-index: 0;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, var(--accent-color) 0%, transparent 70%);
  opacity: 0;
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  filter: blur(40px);
  pointer-events: none;
}

.tile-content {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100%;
  flex-direction: column;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.icon-box {
  position: relative;
  display: flex;
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 10px;
  align-items: center;
  justify-content: center;

  .ws-icon {
    font-size: 1.4rem;
    transition: transform 0.3s ease;
  }

  .status-dot {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 7px;
    height: 7px;
    border: 1.5px solid var(--surface-base);
    border-radius: 50%;
    background: var(--primary-border);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }
}

.doc-badge {
  display: flex;
  font-family: monospace;
  align-items: baseline;
  gap: 0.2rem;

  .count-number {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .count-label {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}

.meta-zone {
  margin-bottom: 1.5rem;

  .ws-title {
    margin: 0 0 0.4rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-body);
    transition: color 0.2s ease;
    letter-spacing: -0.02em;
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
  padding-top: 1rem;
}

.category-pills {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;

  .pill {
    position: relative;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-secondary);
    padding-left: 0.6rem;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--border-strong);
      content: '';
      transform: translateY(-50%);
    }
  }

  .pill-more {
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--text-muted);
    background: var(--surface-raised);
  }
}
</style>
