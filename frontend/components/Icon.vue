<template>
  <i v-html="icon" class="icon" :style="{ fill: props.fill || 'var(--red)' }" :class="{ fill: props.fill, big: props.big }"></i>
</template>

<script setup lang="ts">
import type { IconName } from '~/composables/icons';
const props = defineProps<{ name: IconName | string; fill?: string; big?: true }>();
const icon = useIcon(props.name as IconName) || props.name;
</script>

<style scoped lang="scss">
.icon {
  display: flex;
  align-items: center;

  &:deep(svg) {
    width: 20px;
    max-height: 22px;
    margin-right: 5px;

    path {
      fill: inherit; // Utilise la couleur de l'élément parent		}
    }
  }
}

.fill:deep(svg) > path {
  fill: inherit !important; // Utilise la couleur de l'élément parent		}
}

.big {
  &:deep(svg) {
    width: 25px;
    max-height: 25px;
  }
}
</style>
