<template>
  <!-- eslint-disable vue/no-v-html -->
  <article
    ref="rootElement"
    :class="['markdown-preview', `${theme}-theme`, `document-content`]"
    :style="{ fontSize: documentFontSize + 'px', fontFamily: documentFontFamily, lineHeight: documentLineHeight }"
    v-html="node?.content_compiled"
  />
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import { subscribeDrawioCacheInvalidated } from '~/composables/useDrawioCache';

const props = defineProps<{ node?: Partial<Node> }>();

const preferences = usePreferencesStore();

const theme = computed(() => {
  if (props.node?.theme) return props.node.theme;
  return preferences.get('theme').value;
});
const documentFontSize = preferences.get('documentFontSize');
const documentFontFamily = preferences.get('documentFontFamily');
const documentLineHeight = preferences.get('documentLineHeight');

const rootElement = ref<HTMLElement>();

defineExpose({ rootElement });

function rerenderImages() {
  // Re-triggering image loading by resetting the data attribute (add v=timestamp), to bypass potential caching issues after a drawio diagram update
  const obj = rootElement.value?.querySelectorAll('object');
  obj?.forEach(img => {
    const data = img.getAttribute('data') || '';
    const url = new URL(data);
    url.searchParams.set('v', Date.now().toString());
    if (data) {
      img.setAttribute('data', url.toString());
    }
  });
}

onMounted(() => {
  const unsub = subscribeDrawioCacheInvalidated(() => {
    rerenderImages();
  });
  onUnmounted(() => {
    unsub();
  });
});
</script>

<style lang="scss" scoped>
article {
  max-width: 100%;
}
</style>
