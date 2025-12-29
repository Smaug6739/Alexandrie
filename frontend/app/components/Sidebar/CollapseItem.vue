<template>
  <div v-if="item.childrens?.length">
    <SidebarItem :level="level" :item="item" class="collapse-header doc">
      <svg :class="{ rotated: !props.item.show.value }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" @click="toggleShow">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </SidebarItem>
    <template v-if="getCollapseState(item.id)">
      <div v-for="child in item.childrens" :key="child.id" class="collapse-body" style="margin-left: 15px">
        <CollapseItem v-if="child.childrens?.length" :item="child" :level="level + 1" />
        <SidebarItem v-else :level="level + 1" :item="child" />
      </div>
    </template>
  </div>
  <!-- Filter hidden "navigation items" -->
  <SidebarItem v-else-if="item.data.role !== -1 || item.show.value" :item="item" :level="level" />
</template>
<script setup lang="ts">
import type { DefaultItem } from './helpers';

const props = withDefaults(defineProps<{ item: Item | DefaultItem; level?: number }>(), { level: 0 });

const { getCollapseState, setCollapseState } = useCollapseStates();

const toggleShow = () => {
  setCollapseState(props.item.id, !props.item.show.value);
};
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
