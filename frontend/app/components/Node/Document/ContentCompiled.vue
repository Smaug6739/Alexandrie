<template>
  <!-- eslint-disable vue/no-v-html -->
  <article
    ref="rootElement"
    :class="['markdown-preview', `${theme}-theme`, `document-content`]"
    :style="{ fontSize: documentFontSize + 'px', fontFamily: documentFontFamily, lineHeight: documentLineHeight }"
    @change="handleCheckboxChange"
    @click="handleInternalLinkClick"
    v-html="node?.content_compiled"
  />
</template>

<script setup lang="ts">
import compile from '~/helpers/markdown';
import { rerenderImages } from '~/helpers/DOM';
import { renderMermaidDiagrams } from '~/helpers/mermaid-render';
import type { Node } from '~/stores';

const props = defineProps<{ node?: Partial<Node> }>();

const preferences = usePreferencesStore();
const nodesStore = useNodesStore();
const router = useRouter();
const colorMode = useColorMode();

const theme = computed(() => {
  if (props.node?.theme) return props.node.theme;
  return preferences.get('theme').value;
});
const documentFontSize = preferences.get('documentFontSize');
const documentFontFamily = preferences.get('documentFontFamily');
const documentLineHeight = preferences.get('documentLineHeight');

const rootElement = ref<HTMLElement>();

defineExpose({ rootElement });

const updateDocumentContent = debounce(() => {
  nodesStore.update(nodesStore.nodes.get(props.node!.id!) as Node);
}, 1000);

const updateMarkdownCheckbox = (markdown: string, indexToTarget: number, shouldCheck: boolean): string => {
  let currentIndex = 0;

  return markdown.replace(/^([ \t]*[-*+]\s+\[)([ xX]?)(\].*)/gm, (match, before, status, after) => {
    if (currentIndex === indexToTarget) {
      currentIndex++;
      const newStatus = shouldCheck ? 'x' : ' ';
      return `${before}${newStatus}${after}`;
    }
    currentIndex++;
    return match;
  });
};

// Navigate internal document links (#<id>) through the router, without a full page reload
const handleInternalLinkClick = (event: MouseEvent) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-internal-link]');
  if (!link) return;
  const id = link.dataset.internalLink;
  if (!id) return;
  event.preventDefault();
  router.push(`/dashboard/docs/${id}`);
};

const handleCheckboxChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target || target.type !== 'checkbox' || !target.hasAttribute('data-checkbox-index')) return;
  if (!props.node?.content) return;

  const checkboxIndex = parseInt(target.getAttribute('data-checkbox-index') || '0', 10);
  const updatedMarkdown = updateMarkdownCheckbox(props.node.content, checkboxIndex, target.checked);

  // Recompile from the updated source rather than snapshotting the rendered DOM, so the
  // persisted HTML stays reusable (fresh diagram placeholders, resolved internal links).
  nodesStore.nodes.set(
    props.node.id!,
    {
      ...props.node,
      content: updatedMarkdown,
      content_compiled: compile(updatedMarkdown, id => nodesStore.getById(id)?.name),
    } as Node,
    true,
  );
  updateDocumentContent();
};

function runMermaidRender() {
  if (!rootElement.value) return;
  renderMermaidDiagrams(rootElement.value, { dark: colorMode.value === 'dark' });
}

onMounted(() => {
  runMermaidRender();
  const unsub = subscribeDrawioCacheInvalidated(() => {
    rerenderImages(rootElement.value!);
  });
  onUnmounted(() => {
    unsub();
  });
});

watch(
  () => props.node?.content_compiled,
  async () => {
    await nextTick();
    runMermaidRender();
  },
);

watch(
  () => colorMode.value,
  async () => {
    await nextTick();
    runMermaidRender();
  },
);
</script>

<style lang="scss" scoped>
article {
  max-width: 100%;
}
</style>
