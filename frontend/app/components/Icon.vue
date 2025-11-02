<template>
  <svg v-if="isSpriteIcon" class="icon" :class="display" :style="{ color: fill || 'currentColor', width: size, height: size }" aria-hidden="true">
    <use :href="`#icon-${name}`" />
  </svg>

  <!-- eslint-disable-next-line vue/no-v-html | OK Because not a user entry-->
  <i v-else class="icon c-icon" :style="{ fill: fill || 'currentColor' }" :class="display" v-html="name" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; fill?: string; display?: 'sm' | 'md' | 'lg' | 'xl'; size?: string }>(), {
  display: 'md',
  fill: 'var(--font-color)',
  size: undefined,
});

const isSpriteIcon = computed(() => {
  return typeof props.name === 'string' && props.name.length < 50 && !isUnicode(props.name);
});
const isUnicode = (str: string) => {
  return Array.from(str).some(char => char.charCodeAt(0) > 255);
};
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;

  use {
    fill: currentcolor;
  }

  /* Custom sizes */
  &.sm {
    width: 18px;
    height: 18px;
  }

  &.md {
    width: 20px;
    height: 20px;
  }

  &.lg {
    width: 25px;
    height: 25px;
  }
  &.xl {
    width: 28px;
    height: 28px;
  }
}

.c-icon:deep(svg),
.c-icon:deep(svg > * > path) {
  fill: inherit !important;
}
</style>
