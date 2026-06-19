<template>
  <NuxtLink v-if="to || href" :to="to" :href="href" :target="blank ? '_blank' : undefined" :download="download" @click="emit('click')">
    <Icon :name="icon" display="lg" />
    <p v-if="tooltip" class="hint-tooltip">{{ tooltip }}</p>
    <slot />
  </NuxtLink>
  <button v-else @click="emit('click')">
    <Icon :name="icon" display="lg" />
    <p v-if="tooltip" class="hint-tooltip">{{ tooltip }}</p>
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{ icon: string; tooltip?: string; to?: string; blank?: boolean; href?: string; download?: boolean }>();
const emit = defineEmits<{ (e: 'click'): void }>();
</script>

<style scoped lang="scss">
button,
a {
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: background $transition-fast;
  cursor: pointer;

  &:hover {
    background: var(--surface-transparent);
  }
}
button,
a {
  position: relative;
}

a:hover > .hint-tooltip {
  opacity: 1;
  visibility: visible;
}
button:hover > .hint-tooltip {
  opacity: 1;
  visibility: visible;
}
</style>
