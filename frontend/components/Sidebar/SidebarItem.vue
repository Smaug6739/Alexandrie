<template>
  <span class="item" @click="onClick" :draggable="draggable" @dragstart="dragStart" @dragover.prevent="dragOver" @drop="drop" @dragleave="dragLeave" :class="{ 'drag-over': isDragOver }">
    <Icon :name="getIcon()" />
    <NuxtLink :to="item.route" style="width: 100%">{{ item.title }} </NuxtLink>
    <NuxtLink to="/dashboard/docs/new" class="new" v-if="item.data.type === 'category' && item.parent_id"> <Icon name="plus" fill="var(--font-color)" /> </NuxtLink>
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
import { navigationItems } from './helpers';
import type { Item } from './tree_builder';

const documentStore = useDocumentsStore();
const categoriesStore = useCategoriesStore();

const { isOpened } = useSidebar();
const props = defineProps<{ item: Item }>();

function getIcon() {
  if ('icon' in props.item.data && props.item.data.icon) return props.item.data.icon;
  if (props.item.data.type === 'category') return 'folder';
  if (props.item.data.type === 'document' && props.item.childrens?.length) return 'file_parent';
  if (props.item.data.type === 'document' && props.item.data.accessibility == 2) return 'draft';
  if (props.item.data.type === 'document' && props.item.data.accessibility == 3) return 'archive';
  return 'file';
}
const draggable = ref<boolean>(true);
const isDragOver = ref<boolean>(false);

const onClick = () => {
  if (isMobile()) isOpened.value = false;
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

  let draggedItem = documentStore.getById(draggedItemId) || categoriesStore.getById(draggedItemId) || navigationItems.find(item => item.id === draggedItemId);

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
    categoriesStore.update({ ...draggedItem, parent_id: props.item.id });
  }
  if (draggedItem.type === 'document' && props.item.data.type === 'document') {
    // Move document to document
    if (documentStore.getAllChildrensIds(draggedItem.id).includes(props.item.parent_id)) return; // Prevent moving parent to child
    if (draggedItem.id === props.item.id) return; // Prevent moving to the same document
    documentStore.update({ ...draggedItem, parent_id: props.item.id, category: props.item.data.category });
  }
  if (draggedItem.type === 'category' && props.item.data.type === 'category') {
    // Move category to category
    if (draggedItem.id === props.item.id) return; // Prevent moving to the same category
    categoriesStore.update({ ...draggedItem, parent_id: props.item.id });
  }
  if (draggedItem.type === 'category' && props.item.data.type === 'default') {
    // Move category to root
    categoriesStore.update({ ...draggedItem, parent_id: undefined });
  }
  if (draggedItem.type === 'document' && props.item.data.type === 'default') {
    // Move document to root
    documentStore.update({ ...draggedItem, parent_id: undefined, category: undefined });
  }
};
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2.5px;
  margin: 2.5px 0;
  border-radius: 5px;
  color: var(--font-color);
  cursor: pointer;
  width: 98%;
  font-size: 15.5px;
  &:hover,
  &:has(.router-link-exact-active:not(.new)) {
    background: var(--bg-contrast-2);
  }

  .icon {
    display: flex;
    align-items: center;

    &:deep(svg) {
      fill: var(--blue);
      width: 20px;
      max-height: 22px;
      margin-right: 5px;

      path {
        fill: var(--blue);
      }
    }
  }
}

.drag-over {
  border-bottom: 2px solid var(--blue);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.new {
  display: none;
  &:deep(svg) {
    fill: inherit !important;
  }
}
.item:hover .new {
  display: block;
}
</style>
