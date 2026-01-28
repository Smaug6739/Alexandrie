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
        <NodeHierarchyItem v-for="child in children" :key="child.id" :node="child" :all-nodes="allNodes" :depth="depth + 1" />
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
      background: var(--bg-contrast);
    }
  }
}

.node-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  transition: background-color 0.15s;
  border-left: 2px solid transparent;

  &:hover {
    border-left-color: var(--primary);
  }
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: none;
  color: var(--font-color-light);
  cursor: pointer;
  transition: transform 0.2s;
  flex-shrink: 0;

  &.rotated {
    transform: rotate(90deg);
  }

  &:hover {
    color: var(--primary);
  }
}

.expand-placeholder {
  width: 20px;
  flex-shrink: 0;
}

.node-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}

.node-link {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  text-decoration: none;
  gap: 2px;

  &:hover .node-name {
    color: var(--primary);
  }
}

.node-name {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--font-color-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.node-description {
  font-size: 0.8125rem;
  color: var(--font-color-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.node-type {
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--font-color-light);
  padding: 2px 8px;
  background: var(--bg-contrast);
  border-radius: 4px;
}

.children-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--font-color);
  background: var(--bg-contrast);
  border-radius: 10px;
  padding: 0 6px;
}

.node-children {
  border-left: 1px dashed var(--border-color);
  margin-left: 1.75rem;
}

// Expand transition
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}

@media screen and (max-width: 600px) {
  .node-description,
  .node-type {
    display: none;
  }
}
</style>
