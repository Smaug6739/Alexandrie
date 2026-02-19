<template>
  <div class="no-content">
    <h1>{{ title || t('components.noContent.nothingHere') }}</h1>
    <img :src="`/empty-${colorMode.value}.png`" alt="" />
    <p>{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title?: string; description?: string }>();

const colorMode = useColorMode();
const { t } = useI18nT();
</script>

<style scoped lang="scss">
.no-content {
  margin: 5vh auto;
  text-align: center;

  img {
    max-width: 300px;
    max-height: 300px;
  }
}
</style>
