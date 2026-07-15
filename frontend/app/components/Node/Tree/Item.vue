<template>
  <div class="hierarchy-node" :class="{ expanded: isExpanded, 'has-children': hasChildren }">
    <div class="node-row" :style="{ paddingLeft: `${depth * 1.5 + 1}rem` }" @click="toggleExpand">
      <!-- Expand/Collapse indicator -->
      <button v-if="hasChildren" class="expand-btn" :class="{ rotated: isExpanded }">
        <Icon name="chevron_right" display="sm" />
      </button>
      <span v-else class="expand-placeholder" />

      <!-- Node icon -->
      <span class="node-icon" :class="getAccentClass">
        <Icon :name="node.icon || resolveIcon(props.node)" display="md" />
      </span>

      <!-- Node content -->
      <NuxtLink :to="`/doc/${node.id}`" class="node-link" @click.stop>
        <span class="node-name">{{ node.name }}</span>
        <span v-if="node.description" class="node-description">{{ node.description }}</span>
      </NuxtLink>

      <!-- Node metadata -->
      <div class="node-meta">
        <span class="node-type">{{ getRoleName(props.node.role) }}</span>
        <span v-if="hasChildren" class="children-count">{{ childrenCount }}</span>
      </div>
    </div>

    <!-- Children (collapsible) -->
    <Transition name="expand">
      <div v-if="isExpanded && hasChildren" class="node-children">
        <NodeTreeItem v-for="child in children" :key="child.id" :node="child" :all-nodes="allNodes" :depth="depth + 1" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { resolveIcon, getRoleName } from '~/helpers/node';
import type { Node } from '~/stores';

const props = defineProps<{
  node: Node;
  allNodes: Map<string, Node>;
  depth: number;
}>();

const { getAppAccent } = useAppColors();

const isExpanded = ref(props.depth < 2); // Auto-expand first 2 levels

const children = computed(() => {
  const result: Node[] = [];
  props.allNodes.forEach(n => {
    if (n.parent_id === props.node.id) {
      result.push(n);
    }
  });
  return result.sort((a, b) => {
    if (a.role !== b.role) return a.role - b.role;
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA !== orderB) return orderB - orderA;
    return a.name.localeCompare(b.name);
  });
});

const hasChildren = computed(() => children.value.length > 0);
const childrenCount = computed(() => children.value.length);

const getAccentClass = computed(() => {
  return getAppAccent(props.node.color as number, true);
});

function toggleExpand() {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
}
</script>

<style scoped lang="scss">
.hierarchy-node {
  &.has-children > .node-row {
    cursor: pointer;

    &:hover {
      background: var(--surface-raised);
    }
  }
}

.node-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-left: 2px solid transparent;
  transition: background-color 0.15s;

  &:hover {
    border-left-color: var(--primary);
  }
}

.expand-btn {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  color: var(--text-secondary);
  background: none;
  cursor: pointer;
  transition: transform 0.2s;

  &.rotated {
    transform: rotate(90deg);
  }

  &:hover {
    color: var(--primary);
  }
}

.expand-placeholder {
  flex-shrink: 0;
  width: 20px;
}

.node-icon {
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
}

.node-link {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-decoration: none;

  &:hover .node-name {
    color: var(--primary);
  }
}

.node-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s;
  overflow: hidden;
}

.node-description {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.node-meta {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;
}

.node-type {
  padding: 2px 8px;
  border-radius: var(--radius-xs);
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--surface-raised);
}

.children-count {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--radius-lg);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-body);
  background: var(--surface-raised);
}

.node-children {
  margin-left: 1.75rem;
  border-left: 1px dashed var(--border);
}

// Expand transition
.expand-enter-active,
.expand-leave-active {
  transition:
    max-height $transition-base ease,
    opacity $transition-base ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}

@media screen and (width <= 600px) {
  .node-description,
  .node-type {
    display: none;
  }
}
</style>
