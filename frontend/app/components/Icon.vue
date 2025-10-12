<template>
  <svg v-if="isSpriteIcon" class="icon" :class="{ big, mid, small }" :style="{ color: fill || 'currentColor' }" aria-hidden="true">
    <use :href="`#icon-${name}`" />
  </svg>

  <i v-else class="icon c-icon" :style="{ fill: fill || 'currentColor' }" :class="{ fill, big, mid, small }" v-html="name" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  fill?: string;
  big?: boolean;
  mid?: boolean;
  small?: boolean;
}>();

const isSpriteIcon = computed(() => {
  return typeof props.name === 'string' && props.name.length < 50;
});
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  pointer-events: none;
  user-select: none;

  use {
    fill: currentColor;
  }

  /* Custom sizes */
  &.small {
    width: 18px;
    height: 18px;
  }
  &.mid {
    width: 21px;
    height: 21px;
  }
  &.big {
    width: 25px;
    height: 25px;
  }
}
.c-icon:deep(svg) {
  fill: inherit !important;
}
</style>
