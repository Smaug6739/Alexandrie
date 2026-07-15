<template>
  <NuxtLink
    v-if="to || href"
    :to="to"
    :href="href"
    :target="blank ? '_blank' : undefined"
    v-bind="download ? { download: '' } : {}"
    :class="{ 'btn-nav': nav }"
    @click="emit('click')"
  >
    <Icon :name="icon" display="lg" />
    <slot />
    <span v-if="tooltip" class="hint-tooltip btn-tooltip">{{ tooltip }}</span>
  </NuxtLink>

  <button v-else v-bind="attrs" :class="{ fill, 'btn-nav': nav }" @click="emit('click')">
    <Icon :name="icon" display="lg" />
    <slot />
    <span v-if="tooltip" class="hint-tooltip btn-tooltip">{{ tooltip }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{ icon: string; tooltip?: string; to?: string; blank?: boolean; href?: string; download?: boolean; nav?: boolean; fill?: boolean }>();
const emit = defineEmits<{ (e: 'click'): void }>();

const attrs = useAttrs();
</script>

<style scoped lang="scss">
button,
a {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0 1px;
  padding: 4.5px;
  border-bottom: 2px solid transparent;
  border-radius: var(--radius-sm);
  transition:
    background-color $transition-fast ease-in-out,
    border-color $transition-fast ease-in-out;

  &:hover {
    background-color: var(--surface-raised);
  }
}

// Gestion du survol pour Desktop uniquement (au-dessus de 768px)
@media screen and (width > 768px) {
  a:hover > .btn-tooltip,
  button:hover > .btn-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

.fill {
  background-color: var(--surface-raised);
}

// Le fix magique pour Mobile
@media screen and (width <= 768px) {
  .btn-tooltip {
    position: static !important;
    order: 1;
    margin: 0 !important;
    padding: 0 !important;
    color: inherit !important;
    background-color: transparent !important;
    box-shadow: none !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
    pointer-events: auto !important;
  }
}
</style>
