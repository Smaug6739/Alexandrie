<template>
  <aside class="document-sidebar">
    <section v-if="doc?.tags" class="sidebar-section">
      <h3 class="section-title">{{ t('nodes.tags') }}</h3>
      <div class="tags-container">
        <NodeTagList :tags="doc.tags" />
      </div>
    </section>

    <section class="sidebar-section">
      <h3 class="section-title">{{ t('nodes.document.TOC') }}</h3>
      <div class="toc-wrapper">
        <div v-if="headers.length" ref="marker" class="active-marker" />

        <div v-if="headers.length" ref="list" class="toc-tree">
          <NodeTOCLevel v-for="header of headers_tree" :key="header.link" :node="header" />
        </div>
        <p v-else class="empty-state">{{ t('common.nothing') }}</p>
      </div>
    </section>

    <section v-if="childs.length" class="sidebar-section">
      <h3 class="section-title">{{ t('nodes.document.childs') }}</h3>
      <nav class="children-links">
        <NuxtLink v-for="child in childs" :key="child.id" :to="`/dashboard/docs/${child.id}`" class="child-link">
          <Icon name="file_shortcut" fill="var(--primary)" />
          <span class="child-name">{{ child.name }}</span>
        </NuxtLink>
      </nav>
    </section>
  </aside>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

const props = defineProps<{ element?: HTMLElement; doc?: Node }>();
const nodesStore = useNodesStore();
const { t } = useI18nT();

const childs = computed(
  () =>
    nodesStore.nodes
      .getChildrenIds(props.doc?.id)
      .map(id => nodesStore.getById(id))
      .filter(n => n?.role === 3) as Node[],
);

const list = ref<HTMLElement>();
const marker = ref<HTMLElement>();
const appElement = ref<HTMLElement | null>(null);

interface GroupedHeaders {
  title: string;
  link: string;
  level: number;
}
interface TreeItem {
  title: string;
  link: string;
  level: number;
  childrens?: TreeItem[];
}

const getHTMLHeaders = (): HTMLElement[] => {
  if (!props.element) return [];
  return Array.from(props.element.querySelectorAll('h1, h2, h3, h4, h5, h6'));
};

function getHeaders(headers: HTMLElement[]): GroupedHeaders[] {
  return headers.map(header => ({
    title: header.textContent?.replace(/#/g, '') || '',
    link: `#${header.id}`,
    level: parseInt(header.tagName[1] || '1'),
  }));
}

function buildTree(tree: GroupedHeaders[]): TreeItem[] {
  const result: TreeItem[] = [];
  const stack: TreeItem[] = [];
  for (const node of tree) {
    const item: TreeItem = { title: node.title, link: node.link, level: node.level };
    while (stack.length > 0 && stack[stack.length - 1]!.level >= node.level) {
      stack.pop();
    }
    if (stack.length > 0) {
      if (!stack[stack.length - 1]!.childrens) stack[stack.length - 1]!.childrens = [];
      stack[stack.length - 1]!.childrens!.push(item);
    } else {
      result.push(item);
    }
    stack.push(item);
  }
  return result;
}

const headers = computed(() => getHTMLHeaders());
const headers_tree = computed(() => buildTree(getHeaders(headers.value)));

onMounted(() => {
  appElement.value = document.getElementById('app');
  appElement.value?.addEventListener('scroll', updateActiveHeader, { passive: true });
});
onBeforeUnmount(() => appElement.value?.removeEventListener('scroll', updateActiveHeader));

function updateActiveHeader() {
  if (!appElement.value) return;
  const scrollTop = appElement.value.scrollTop;
  const scrollPosition = scrollTop + window.innerHeight / 4;
  let activeHeader: HTMLElement | null = null;

  for (const header of headers.value) {
    if (header.offsetTop <= scrollPosition) {
      activeHeader = header;
    } else {
      break;
    }
  }

  if (activeHeader) {
    const link = `#${activeHeader.id}`;
    const activeItem = list.value?.querySelector(`a[href="${link}"]`);
    if (activeItem && marker.value) {
      list.value?.querySelectorAll('a').forEach(item => item.classList.remove('active'));
      const offsetTop = (activeItem as HTMLElement).offsetTop;
      marker.value.style.top = `${offsetTop}px`;
      activeItem.classList.add('active');
    }
  }
}
</script>

<style lang="scss" scoped>
.document-sidebar {
  position: sticky;
  top: 40px;
  width: 280px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--text-secondary, var(--text-muted));
  text-transform: uppercase;
}

/* TAGS */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.modern-tag {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--surface-raised);
  color: var(--text-body);
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--border);
    color: var(--primary);
  }
}

/* TOC */
.toc-wrapper {
  position: relative;
  border-left: 1px solid var(--border);
  padding-left: 12px;
}

.toc-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(a) {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
  line-height: 1.4;

  &:hover {
    color: var(--text-body);
  }

  &.active {
    font-weight: 500;
    color: var(--primary) !important;
  }
}

.active-marker {
  position: absolute;
  left: -1px;
  width: 1px;
  height: 18px;
  background-color: var(--primary);
  transition: top 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-state {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
}

/* CHILDS */
.children-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.child-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  margin: 0 -8px;
  border-radius: 6px;
  text-decoration: none;
  color: var(--text-body);
  transition: background 0.15s ease;

  &:hover {
    background: var(--surface-raised);

    .child-name {
      color: var(--primary);
    }
    .child-icon {
      color: var(--primary);
    }
  }
}

.child-icon {
  font-size: 16px;
  color: var(--text-secondary);
  transition: color 0.15s ease;
}

.child-name {
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}
</style>
