<template>
  <div class="illustration">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="thumbnail" class="user-image" v-html="thumbnail"></div>
    <svg v-else-if="defaultThumbnail" src="/svg/thumbnail.svg">
      <use href="/svg/thumbnail.svg" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const props = defineProps<{ document?: Node }>();

const preferencesStore = usePreferencesStore();
const nodesStore = useNodesStore();

const defaultThumbnail = preferencesStore.get('documentDefaultThumbnail');
const useParentThumbnail = preferencesStore.get('documentUseParentThumbnail');

const thumbnail = computed(() => {
  if (!props.document) return null;

  if (props.document.thumbnail) return props.document.thumbnail;

  if (useParentThumbnail.value && props.document.parent_id) {
    let parent = nodesStore.getById(props.document.parent_id);
    while (parent) {
      if (parent.thumbnail) return parent.thumbnail;
      if (!parent.parent_id) break;
      parent = nodesStore.getById(parent.parent_id);
    }
  }
  return '';
});
</script>

<style lang="scss" scoped>
.illustration {
  display: block;
  width: 100%;
  height: 160px;
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
