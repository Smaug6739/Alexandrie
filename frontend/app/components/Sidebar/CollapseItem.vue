<template>
  <div v-if="hasChildren">
    <SidebarItem :level="level" :item="item" class="collapse-header doc">
      <svg :class="{ rotated: !isExpanded }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" @click="toggleShow">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </SidebarItem>
    <template v-if="isExpanded">
      <div v-for="child in children" :key="child.id" class="collapse-body" style="margin-left: 15px">
        <CollapseItem v-if="getItemChildren(child)?.length" :item="child" :level="level + 1" />
        <SidebarItem v-else :level="level + 1" :item="child" />
      </div>
    </template>
  </div>
  <!-- Filter hidden "navigation items" -->
  <SidebarItem v-else-if="item.data?.role !== -1 || isVisible" :item="item" :level="level" />
</template>
<script setup lang="ts">
import { type SidebarItem, getItemChildren, isItemVisible } from './helpers';

const props = withDefaults(defineProps<{ item: SidebarItem; level?: number }>(), { level: 0 });

const nodesTree = useNodesTree();

const children = computed(() => getItemChildren(props.item));
const hasChildren = computed(() => (children.value?.length ?? 0) > 0);
const isExpanded = computed(() => nodesTree.isExpanded(props.item.id));
const isVisible = computed(() => isItemVisible(props.item));

const toggleShow = () => nodesTree.toggleExpand(props.item.id);
</script>

<style lang="scss" scoped>
.collapse-header {
  svg {
    fill: var(--font-color);

    &.rotated {
      transform: rotate(-90deg);
    }
  }
}

.doc {
  svg {
    opacity: 0;
  }

  &:hover {
    svg {
      opacity: 1;
    }
  }
}
</style>
