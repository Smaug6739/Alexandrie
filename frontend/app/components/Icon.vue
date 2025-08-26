<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <i class="icon" :style="{ fill }" :class="{ fill, big, mid, small }" v-html="icon" />
</template>

<script setup lang="ts">
import { useIcon, type IconName } from '~/helpers/icons';
const props = defineProps<{ name: IconName | string; fill?: string; big?: true; mid?: boolean; small?: boolean }>();
const icon = computed(() => useIcon(props.name as IconName) || props.name);
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;
  width: 20px;
  height: 20px;
  max-width: 100%;
  max-height: 100%;

  &:deep(svg) {
    width: 100%;
    height: 100%;

    path {
      fill: inherit;
    }
  }
}

.fill:deep(svg) > path {
  fill: inherit !important;
}

.small {
  width: 18px;
  height: 18px;
}

.mid {
  width: 21px;
  height: 21px;
}

.big {
  width: 25px !important;
  height: 25px !important;
}
</style>
