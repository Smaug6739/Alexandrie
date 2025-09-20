<template>
  <span
    class="item"
    :draggable="true"
    :class="{ 'drag-over': isDragOver }"
    @click="onClick"
    @dragstart="dragStart"
    @dragover.prevent="dragOver"
    @drop="drop"
    @dragleave="dragLeave"
  >
    <Icon :name="icon" :class="customClass" />&nbsp;

    <NuxtLink :to="item.route" style="flex: 1" class="close">{{ item.label }}</NuxtLink>

    <Icon v-if="item.data.shared && !item.parent_id" name="users" fill="var(--font-color)" />

    <NuxtLink v-if="item.data.role === 2" :to="`/dashboard/categories/${item.id}/edit`" class="nav close">
      <Icon name="settings" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="item.data.role === 2" :to="`/dashboard/docs/new?cat=${item.id}`" :prefetch="false" class="nav close">
      <Icon name="plus" fill="var(--font-color)" />
    </NuxtLink>
    <Icon v-if="item.data.role === 3 && item.data.order === -1" name="pin" fill="var(--font-color-light)" class="ni" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import { navigationItems, type DefaultItem } from './helpers';
const nodesStore = useNodesStore();
const { isOpened } = useSidebar();
const props = defineProps<{ item: Item | DefaultItem }>();
const customClass = computed(() => {
  if ('color' in props.item.data && props.item.data.color != null && props.item.data.color != -1)
    return `item-icon ${getAppColor(props.item.data.color as number)}`;
  return 'default-icon';
});
const icon = computed(() => {
  if ('icon' in props.item.data && props.item.data.icon) return props.item.data.icon;
  return props.item.icon || '';
});

const isDragOver = ref<boolean>(false);

const onClick = (m: MouseEvent) => {
  // if element does not have the "close" class, don't close the sidebar
  if (!(m.target as HTMLElement).closest('.close')) return;
  if (isMobile() && props.item.route) isOpened.value = false;
};

const dragStart = (event: DragEvent) => {
  // Stocke l'ID de l'élément en cours de glissement
  event.dataTransfer!.setData('text/plain', props.item.id.toString());
};

const dragOver = () => {
  // Indique que l'élément est survolé lors du glisser-déposer
  isDragOver.value = true;
};

const dragLeave = () => {
  // Réinitialise l'état de survol lorsque l'élément quitte la zone de dépôt
  isDragOver.value = false;
};
const { workspaceId } = useSidebar();
const drop = async (event: DragEvent) => {
  isDragOver.value = false;
  const draggedItemId = event.dataTransfer!.getData('text/plain');

  const draggedItem = nodesStore.getById(draggedItemId) || navigationItems.find(item => item.id === draggedItemId)?.data;

  if (!draggedItem) return;

  if (draggedItem.role === -1) return; // Prevent dropping nav items
  if (props.item.data.role === 4) return; // Prevent dropping on ressource items
  if (draggedItem.id === props.item.id) return; // Prevent dropping on itself
  if (draggedItem.role <= 2 && props.item.data.role > 2) return; // Prevent dropping categories / workspaces on ressources / documents
  // Move item to root
  if (props.item.data.role === -1) {
    return nodesStore.update({ ...(draggedItem as Node), parent_id: workspaceId.value });
  }

  nodesStore.update({ ...(draggedItem as Node), parent_id: props.item.id });
};
</script>

<style scoped lang="scss">
.item {
  display: flex;
  width: 100%;
  margin: 2.5px 0;
  padding: 1px 4px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 450;
  align-items: center;
  cursor: pointer;
  justify-content: flex-start;
  letter-spacing: -0.4px;

  &:hover,
  &:has(.router-link-exact-active:not(.nav)) {
    background: var(--bg-contrast-2);
  }

  .default-icon {
    width: 20px;
    height: 20px;

    &:deep(svg) {
      fill: var(--primary);

      path {
        fill: var(--primary);
      }
    }
  }

  .item-icon {
    width: 20px;
    height: 20px;
    padding: 2px;
    border-radius: 4px;
  }
}

.drag-over {
  box-shadow: 0 2px 10px var(--shadow);
  border-bottom: 2px solid var(--primary);
}

.nav {
  display: none;
}

.nav:deep(svg),
.ni:deep(svg) {
  fill: inherit !important;
}

.item:hover .nav,
.active {
  display: block;
  width: 20px;
  height: 20px;
}
</style>
