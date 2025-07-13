<template>
  <aside>
    <h4 v-if="tags">Tags</h4>
    <div style="display: flex; flex-wrap: wrap; font-size: 14px">
      <tag v-if="tags" v-for="tag in tags.split(',')" :key="tag" class="blue">#{{ tag.trim() }}</tag>
    </div>
    <ul ref="list">
      <h4>Table of content</h4>
      <NodeTree v-if="headers.length" v-for="header of headers_tree" :node="header" :key="header.link" />
      <p v-else>Nothing to display</p>
    </ul>
  </aside>
</template>

<script lang="ts" setup>
import NodeTree from './NodeTree.vue';

const props = defineProps<{ element?: HTMLElement; tags?: string }>();
const list = ref<HTMLElement>();

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
  const headers = props.element.querySelectorAll('h1, h2, h3, h4, h5, h6') as NodeListOf<HTMLElement>;
  return Array.from(headers);
};

function getHeaders(headers: HTMLElement[]): GroupedHeaders[] {
  const tree: GroupedHeaders[] = [];
  for (const header of headers) {
    const level = parseInt(header.tagName[1] || '1');
    const title = header.textContent?.replace(/#/g, '') || '';
    const link = `#${header.id}`;
    const node: GroupedHeaders = { title, link, level };
    tree.push(node);
  }
  return tree;
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
      // @ts-ignore
      stack[stack.length - 1].childrens.push(item);
    } else {
      result.push(item);
    }
    stack.push(item);
  }
  return result;
}

const headers = computed(() => getHTMLHeaders());
const headers_tree = computed(() => buildTree(getHeaders(headers.value)));

const observerCallback = (e: IntersectionObserverEntry[]) => {
  const actives: HTMLAnchorElement[] = [];
  e.forEach(entry => {
    const activeLink = list.value?.querySelector<HTMLAnchorElement>(`[href="#${entry.target.id}"]`);
    if (activeLink && entry.isIntersecting && entry.intersectionRatio === 1) {
      actives.push(activeLink);
    }
    if (activeLink) {
      activeLink.classList.remove('active');
    }
  });
  const best = actives.reduce((prev, current) => {
    const prevRect = prev?.getBoundingClientRect();
    const currentRect = current.getBoundingClientRect();
    return prevRect?.top || 0 < currentRect.top ? prev : current;
  }, actives[0]);
  if (best) {
    best.classList.add('active');
  }
};

const observer: IntersectionObserver = new IntersectionObserver(observerCallback, { root: null, threshold: 1 });
watchEffect(() => headers.value.forEach(header => observer.observe(header)));
onBeforeUnmount(() => observer.disconnect());
</script>

<style lang="scss" scoped>
h4 {
  color: var(--font-color-light);
  padding: 4px 0;
}

aside {
  max-width: 350px;
  position: sticky;
  top: 20px;
  font-size: 0.75rem;
  border-left: 1px solid var(--border-color);
  padding-left: 10px;
}

ul {
  padding: 0;
  margin: 0;

  li:deep(a) {
    &.active {
      color: $primary-dark;
      font-weight: 600;
    }
  }
}
</style>
