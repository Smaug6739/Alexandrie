<template>
  <aside>
    <h4 v-if="tags">Tags</h4>
    <div style="display: flex; flex-wrap: wrap; font-size: 14px">
      <tag v-if="tags" v-for="tag in tags.split(',')" :key="tag" class="primary">#{{ tag.trim() }}</tag>
    </div>
    <ul ref="list" style="position: relative">
      <div class="marker" ref="marker"></div>
      <h4>Table of contents</h4>
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

// On scroll, highlight the current header

const marker = ref<HTMLElement>();

function handleScroll() {
  const scrollPosition = window.scrollY + window.innerHeight / 7;
  let activeHeader: HTMLElement | null = null;

  for (const header of headers.value.reverse()) {
    if (header.offsetTop <= scrollPosition && header.offsetTop + header.offsetHeight > scrollPosition) {
      activeHeader = header;
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
onMounted(() => window.addEventListener('scroll', handleScroll));
onBeforeUnmount(() => window.removeEventListener('scroll', handleScroll));
</script>

<style lang="scss" scoped>
h4 {
  color: var(--font-color-light);
}

aside {
  max-width: 350px;
  position: sticky;
  top: 20px;
  left: 10px;
  font-size: 0.75rem;
  border-left: 1px solid var(--border-color);
  padding-left: 10px;
}
.marker {
  position: absolute;
  left: -8px;
  top: 32px;
  width: 3px;
  height: 15px;
  background-color: var(--primary);
  border-radius: 2px;
  transition: top 0.25s ease, height 0.25s ease;
  z-index: 1;
}
ul {
  padding: 0;
  margin: 0;
}
li:deep(a).active {
  color: var(--primary);
  font-weight: 600;
}
</style>
