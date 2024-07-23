<template>
  <div v-if="item.childrens?.length">
    <SidebarItem v-if="root" :item="item" @click="toggleShow" class="collapse-header">
      <svg style="margin-left: auto" :class="{ rotated: !show }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </SidebarItem>
    <SidebarItem v-else :item="item" class="collapse-header" />
    <div v-if="show" class="collapse-body" v-for="(child, index) in item.childrens" style="margin-left: 20px">
      <CollapseItem v-if="child.childrens?.length" :item="child" :key="index" />
      <SidebarItem v-else :item="child" />
    </div>
  </div>
  <SidebarItem v-else :item="item" />
</template>
<script setup lang="ts">
import type { Item } from './tree_builder';

defineProps<{ item: Item; root?: boolean }>();

const show = ref(true);
const toggleShow = () => (show.value = !show.value);
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
</style>
