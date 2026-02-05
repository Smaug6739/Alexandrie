<template>
  <span
    class="item"
    :draggable="true"
    :class="{ dragging: isDragOver }"
    @click="onClick"
    @dragstart="dragStart"
    @dragover.prevent="dragOver"
    @drop="drop"
    @dragleave="dragLeave"
    @contextmenu.prevent="showContextMenu"
  >
    <Icon :fill="item.data.role == 3 ? 'var(--pink) !important' : undefined" :name="icon" :class="customClass" />&nbsp;

    <NuxtLink v-if="item.onClick" class="close content" @click="item.onClick">{{ item.label }}</NuxtLink>
    <NuxtLink v-else :to="item.route" class="close content">{{ item.label }}</NuxtLink>

    <Icon v-if="item.data.shared && level === 0" name="shared" fill="var(--font-color-light)" />

    <NuxtLink v-if="item.data.role === 2 && nodesStore.hasPermissions(item.data as Node, 2)" :to="`/dashboard/categories/${item.id}/edit`" class="nav close">
      <Icon name="settings" />
    </NuxtLink>
    <NuxtLink v-if="item.data.role === 2" :to="`/dashboard/docs/new?cat=${item.id}`" :prefetch="false" class="nav close">
      <Icon name="plus" />
    </NuxtLink>
    <Icon v-if="item.data.order === -1" name="pin" fill="var(--font-color-light)" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import NodeContextMenu from '~/components/Node/Action/ContextMenu.vue';
import { navigationItems, type SidebarItem, getItemChildren } from './helpers';
import type { Node } from '~/stores';

const nodesStore = useNodesStore();
const { isOpened, workspaceId } = useSidebar();
const { getAppAccent } = useAppColors();
const { isMobile } = useDevice();
const preferences = usePreferences();
const contextMenu = useContextMenu();

const props = defineProps<{ item: SidebarItem; level: number }>();
const isDragOver = ref<boolean>(false);

const customClass = computed(() => {
  if (props.item?.data && 'color' in props.item.data && props.item.data.color != null && props.item.data.color != -1)
    return `item-icon ${getAppAccent(props.item.data.color as number)}`;
  return 'default-icon';
});
const iconsNormalized = preferences.get('normalizeFileIcons');
const icon = computed(() => {
  const children = getItemChildren(props.item);
  if (!iconsNormalized.value && props.item.icon === 'sidebar/file' && children?.some(child => child.data?.role != 4)) return 'file_parent';
  return props.item.icon || '';
});

const onClick = (m: MouseEvent) => {
  // if element does not have the "close" class, don't close the sidebar
  if (!(m.target as HTMLElement).closest('.close')) return;
  if (isMobile.value && (props.item.route || props.item.onClick)) isOpened.value = false;
};

/* Context menu */

function showContextMenu(event: MouseEvent) {
  if (props.item.data.role === -1) return; // Prevent context menu on nav items
  contextMenu.open(shallowRef(NodeContextMenu), event, {
    props: { node: props.item.data as Node, contextMenu: true },
  });
}

/* Drag and drop handlers */

const dragStart = (event: DragEvent) => {
  event.dataTransfer!.setData('text/plain', props.item.id.toString());
};

const dragOver = () => {
  isDragOver.value = true;
};

const dragLeave = () => {
  isDragOver.value = false;
};
const drop = async (event: DragEvent) => {
  isDragOver.value = false;
  const draggedItemId = event.dataTransfer!.getData('text/plain');

  const draggedItem = nodesStore.getById(draggedItemId) || navigationItems.find(item => item.id === draggedItemId)?.data;

  if (!draggedItem) return;

  if (draggedItem.role === -1) return; // Prevent dropping nav items
  if (props.item.data.role === 4) return; // Prevent dropping on resource items
  if (draggedItem.id === props.item.id) return; // Prevent dropping on itself
  if (draggedItem.role <= 2 && props.item.data.role !== undefined && props.item.data.role > 2) return; // Prevent dropping categories / workspaces on resources / documents
  // Move item to root
  if (props.item.data.role === -1) {
    return nodesStore.update({ ...(draggedItem as Node), parent_id: workspaceId.value });
  }

  // Prevent dropping on its own descendants
  if (nodesStore.isDescendant(draggedItem as Node, props.item.id.toString())) return;

  nodesStore.update({ ...(draggedItem as Node), parent_id: props.item.id });
};
</script>

<style scoped lang="scss">
.item {
  display: flex;
  width: 100%;
  margin: 2.5px 0;
  padding: 1px 4px;
  border-radius: $radius-sm;
  font-size: 15px;
  font-weight: 450;
  align-items: center;
  cursor: pointer;
  justify-content: flex-start;
  letter-spacing: -0.4px;

  &:hover {
    background: var(--bg-contrast-2);
  }

  &:has(.router-link-exact-active:not(.nav)) {
    background: var(--default-bg);
  }

  .default-icon,
  .item-icon {
    width: 20px;
    height: 20px;
    color: var(--primary) !important;
  }

  .item-icon {
    padding: 2px;
    border-radius: 4px;
  }
}

.content {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dragging {
  box-shadow: 0 2px 10px var(--shadow);
  border-bottom: 2px solid var(--primary);
}

.nav {
  display: none;
}

.item:hover .nav,
.active {
  display: block;
  width: 20px;
  height: 20px;
}
</style>
