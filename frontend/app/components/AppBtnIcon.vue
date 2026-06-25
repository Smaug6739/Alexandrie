<template>
  <template v-if="nav && !isMobile">
    <NuxtLink v-if="to || href" :to="to" :href="href" :target="blank ? '_blank' : undefined" v-bind="download ? { download: '' } : {}" @click="emit('click')">
      <Icon :name="icon" display="lg" />
      <p v-if="tooltip" class="hint-tooltip">{{ tooltip }}</p>
      <slot />
    </NuxtLink>
    <button v-else v-bind="attrs" :class="{ fill }" @click="emit('click')">
      <Icon :name="icon" display="lg" />
      <p v-if="tooltip" class="hint-tooltip">{{ tooltip }}</p>
      <slot />
    </button>
  </template>
  <template v-else>
    <NuxtLink v-if="to || href" :to="to" :href="href" :target="blank ? '_blank' : undefined" v-bind="download ? { download: '' } : {}" @click="emit('click')">
      <Icon :name="icon" display="lg" />
      <slot />
      <span v-if="tooltip">{{ tooltip }}</span>
    </NuxtLink>
    <button v-else v-bind="attrs" :class="{ fill }" @click="emit('click')">
      <Icon :name="icon" display="lg" />
      <slot />
      <span v-if="tooltip">{{ tooltip }}</span>
    </button>
  </template>
</template>

<script setup lang="ts">
defineProps<{ icon: string; tooltip?: string; to?: string; blank?: boolean; href?: string; download?: boolean; nav?: boolean; fill?: boolean }>();
const emit = defineEmits<{ (e: 'click'): void }>();

const { isMobile } = useDevice();
const attrs = useAttrs();
</script>

<style scoped lang="scss">
button,
a {
  padding: 4.5px;
  margin: 0 1px;
  border-radius: var(--radius-sm);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;

  border-bottom: 2px solid transparent;
  transition:
    background-color $transition-fast ease-in-out,
    border-color $transition-fast ease-in-out;

  &:hover {
    background-color: var(--surface-raised);
  }

  &:hover {
    background: var(--surface-transparent);
  }
}

a:hover > .hint-tooltip {
  opacity: 1;
  visibility: visible;
}
button:hover > .hint-tooltip {
  opacity: 1;
  visibility: visible;
}

span {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.fill {
  background-color: var(--surface-raised);
}
</style>
