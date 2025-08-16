<template>
  <span class="item" @click="onClick" :draggable="true" @dragstart="dragStart" @dragover.prevent="dragOver" @drop="drop" @dragleave="dragLeave" :class="{ 'drag-over': isDragOver }">
    <Icon :name="icon" :class="customClass" />&nbsp;

    <NuxtLink :to="item.route" style="width: 100%" class="close">{{ item.label }}</NuxtLink>
    <DocumentDotMenu v-if="item.data.type === 'document'" ref="dotMenu" class="nav close" :class="{ active: isActive }" :document="item.data" :user="user" @open="() => (isActive = true)" @close="() => (isActive = false)" @delete="deleteDoc" />
    <NuxtLink v-if="item.data.type === 'category'" :to="`/dashboard/categories/${item.id}/edit`" class="nav close"> <Icon name="settings" fill="var(--font-color)" /> </NuxtLink>
    <NuxtLink v-if="item.data.type === 'category'" :to="`/dashboard/docs/new?cat=${item.id}`" :prefetch="false" class="nav close"> <Icon name="plus" fill="var(--font-color)" /> </NuxtLink>
    <Icon name="pin" fill="var(--font-color-light)" v-if="item.data.type === 'document' && item.data.pinned" class="ni" />
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import DeleteDocumentModal from '~/pages/dashboard/docs/_modals/DeleteDocumentModal.vue';
import { navigationItems } from './helpers';
const documentStore = useDocumentsStore();
const categoriesStore = useCategoriesStore();
const user = useUserStore().user;
const { isOpened } = useSidebar();
const props = defineProps<{ item: Item }>();
const dotMenu = ref();
const customClass = computed(() => {
  if (props.item.data.type === 'category' && props.item.data.name === 'Mathématiques') console.log(props.item.data.color, getAppColor(props.item.data.color as number));
  if ('color' in props.item.data && props.item.data.color != -1) return `item-icon ${getAppColor(props.item.data.color as number)}`;
});
const isActive = ref(false);
const icon = computed(() => {
  if ('icon' in props.item.data && props.item.data.icon) return props.item.data.icon;
  return props.item.icon || '';
});
const deleteDoc = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { documentId: props.item.id }));

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

const drop = async (event: DragEvent) => {
  isDragOver.value = false;
  const draggedItemId = event.dataTransfer!.getData('text/plain');

  let draggedItem = documentStore.getById(draggedItemId) || categoriesStore.getById(draggedItemId) || navigationItems.find(item => item.id === draggedItemId)?.data;

  if (!draggedItem) return;

  if (draggedItem.type === 'document' && draggedItem.partial) {
    draggedItem = await documentStore.fetch({ id: draggedItem.id });
  }

  if (draggedItem.type === 'document' && props.item.data.type === 'category') {
    // Move document to category
    documentStore.update({ ...draggedItem, category: props.item.id, parent_id: null });
  }
  if (draggedItem.type === 'category' && props.item.data.type === 'category') {
    // Move category to category
    if (draggedItem.id === props.item.id) return; // Prevent moving to the same category
    categoriesStore.update({ ...draggedItem, parent_id: props.item.id, workspace_id: undefined });
  }
  if (draggedItem.type === 'document' && props.item.data.type === 'document') {
    // Move document to document
    if (documentStore.getAllChildrensIds(draggedItem.id).includes(props.item.parent_id ?? '')) return; // Prevent moving parent to child
    if (draggedItem.id === props.item.id) return; // Prevent moving to the same document
    documentStore.update({ ...draggedItem, parent_id: props.item.id, category: props.item.data.category });
  }
  if (draggedItem.type === 'category' && props.item.data.type === 'navigation') {
    // Move category to root
    categoriesStore.update({ ...draggedItem, parent_id: undefined, workspace_id: useSidebar().workspaceId.value || undefined });
  }
  if (draggedItem.type === 'document' && props.item.data.type === 'navigation') {
    // Move document to root
    documentStore.update({ ...draggedItem, parent_id: undefined, category: useSidebar().workspaceId.value || undefined });
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 1px 4px;
  margin: 2.5px 0;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 450;
  letter-spacing: -0.4px;
  cursor: pointer;
  &:hover,
  &:has(.router-link-exact-active:not(.nav)) {
    background: var(--bg-contrast-2);
  }

  .icon {
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
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border-radius: 4px; // Coins arrondis
  }
}

.drag-over {
  border-bottom: 2px solid var(--primary);
  box-shadow: 0 2px 10px var(--shadow);
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
}
</style>
