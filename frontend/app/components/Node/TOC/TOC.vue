<template>
  <aside>
    <h4 v-if="doc?.tags">Tags</h4>
    <div v-if="doc?.tags" style="display: flex; font-size: 14px; flex-wrap: wrap">
      <tag v-for="tag in doc?.tags.split(',')" :key="tag" class="primary">#{{ tag.trim() }}</tag>
    </div>
    <ul ref="list" style="position: relative">
      <div v-if="headers.length" ref="marker" class="marker" />
      <h4>Table of contents</h4>
      <div v-if="headers.length">
        <NodeTOCLevel v-for="header of headers_tree" :key="header.link" :node="header" style="padding-left: 10px" />
      </div>
      <p v-else>Nothing to display</p>
    </ul>
    <h4 v-if="childs.length">Child documents</h4>
    <NuxtLink v-for="child in childs" :key="child.id" :to="`/dashboard/docs/${child.id}`" class="child-link">
      <Icon name="file_shortcut" fill="var(--primary)" />{{ child.data.name as string }}
    </NuxtLink>
  </aside>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';
import type { TreeItem as NodeTreeItem } from '~/helpers/TreeBuilder';

const props = defineProps<{ element?: HTMLElement; doc?: Node }>();
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

// On scroll, highlight the current header

const marker = ref<HTMLElement>();

onMounted(() => document.addEventListener('scroll', updateActiveHeader, { passive: true }));
onBeforeUnmount(() => document.removeEventListener('scroll', updateActiveHeader));

function updateActiveHeader() {
  const scrollPosition = window.scrollY + window.innerHeight / 4; // quart de la hauteur écran
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

const nodesTree = useNodesTree();

const childs = computed(() => nodesTree.getChildren(props.doc?.id).filter(c => c.data.role === 3)) as Ref<NodeTreeItem<Node>[]>;
</script>

<style lang="scss" scoped>
h4 {
  color: var(--font-color-light);
  font-size: 14px;
}

aside {
  position: sticky;
  top: 20px;
  width: 350px;
  padding: 0 15px;
  font-size: 0.8rem;
  border-left: 1px solid var(--border-color);
}

.marker {
  position: absolute;
  top: 32px;
  left: -8px;
  z-index: 1;
  width: 3px;
  height: 15px;
  border-radius: 2px;
  background-color: var(--primary);
  transition:
    top 0.25s ease,
    height 0.25s ease;
}

ul {
  margin: 0;
  padding: 0;
}

li:deep(a).active {
  font-weight: 600;
  color: var(--primary);
}

.child-link {
  display: flex;
  margin: 5px 0;
  font-weight: 450;
  color: var(--font-color);
  transition: color 0.25s;
  align-items: flex-start;
  gap: 5px;
  text-decoration: none;

  &:hover {
    color: var(--primary);
  }
}
</style>
