<template>
  <div class="illustration">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="document?.thumbnail" class="user-image" v-html="document.thumbnail"></div>
    <svg v-else src="/svg/thumbnail.svg">
      <use href="/svg/thumbnail.svg" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

defineProps<{ document?: Node }>();
</script>

<style lang="scss" scoped>
.illustration {
  display: block;
  width: 100%;
  height: 170px;
  padding: 10px 0;
}

.user-image {
  width: 100%;
  height: 100%;
}

.illustration:deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
