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
</script>

<style lang="scss" scoped>
article {
  max-width: 100%;
}
</style>
