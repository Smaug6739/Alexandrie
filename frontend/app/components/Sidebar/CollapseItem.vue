<template>
  <div v-if="item.childrens?.length">
    <SidebarItem v-if="true || (root && item.data.type == 'document')" :item="item" class="collapse-header doc">
      <svg :class="{ rotated: !props.item.show.value }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" @click="toggleShow">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </SidebarItem>
    <SidebarItem v-else-if="root" :item="item" class="collapse-header" @click="toggleShow">
      <svg :class="{ rotated: !props.item.show.value }" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </SidebarItem>
    <SidebarItem v-else :item="item" class="collapse-header" />
    <div v-for="child in item.childrens" v-if="props.item.show.value" :key="child.id" class="collapse-body" style="margin-left: 15px">
      <CollapseItem v-if="child.childrens?.length" :item="child" :root="child.data.type === 'document'" />
      <SidebarItem v-else :item="child" />
    </div>
  </div>
  <SidebarItem v-else :item="item" />
</template>
<script setup lang="ts">
const props = defineProps<{ item: Item; root?: boolean }>();

const toggleShow = () => {
  props.item.show.value = !props.item.show.value;
  setCollapseState(props.item.id, props.item.show.value);
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
