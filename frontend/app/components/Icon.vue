<template>
  <svg v-if="isSpriteIcon" class="icon" :class="{ big, mid, small }" :style="{ fill: fill || 'currentColor' }" aria-hidden="true">
    <use :href="`#icon-${name}`" />
  </svg>

  <i v-else class="icon" :style="{ fill }" :class="{ fill, big, mid, small }" v-html="name" />
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  fill?: string;
  big?: boolean;
  mid?: boolean;
  small?: boolean;
}>();

// Si l'icône existe dans le sprite (via ton ancien objet ou juste pour fallback)
const isSpriteIcon = computed(() => {
  // tu peux remplacer par une vérif plus robuste si tu as un registre des icons disponibles
  return typeof props.name === 'string' && props.name.length < 50;
});
</script>

<style scoped lang="scss">
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  fill: currentColor;
  color: inherit;
  pointer-events: none;
  user-select: none;

  /* Tailles personnalisées */
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
</style>
