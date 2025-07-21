<template>
  <i v-html="icon" class="icon" :style="{ fill }" :class="{ fill, big, mid }"></i>
</template>

<script setup lang="ts">
import { useIcon, type IconName } from '~/helpers/icons';
const props = defineProps<{ name: IconName | string; fill?: string; big?: true; mid?: boolean }>();
const icon = useIcon(props.name as IconName) || props.name;
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;

  &:deep(svg) {
    width: 20px;
    max-height: 20px;
    path {
      fill: inherit;
    }
  }
}

.fill:deep(svg) > path {
  fill: inherit !important;
}
.mid {
  &:deep(svg) {
    width: 21px;
    max-height: 21px;
  }
}
.big {
  &:deep(svg) {
    width: 25px;
    max-height: 25px;
  }
}
</style>
