<template>
	<NuxtLink class="item" :to="item.route" @click="() => item.route && toggle()" :draggable="draggable"
		@dragstart="dragStart" @dragover.prevent="dragOver" @drop="drop" @dragleave="dragLeave"
		:class="{ 'drag-over': isDragOver }">
		<i v-html="getIcon(item)" class="icon"></i>
		<span>{{ item.title }}</span>
		<slot></slot>
	</NuxtLink>
</template>

<script setup lang="ts">

import { useDocumentsStore, useCategoriesStore } from '~/store';

const documentStore = useDocumentsStore();
const categoriesStore = useCategoriesStore();

import type { Item } from './tree_builder';
import { icons, navigationItems } from './helpers';
const { isOpened } = useSidebar();
const props = defineProps<{ item: Item }>();
const isMobile = () => process.client ? window.innerWidth <= 768 : false;

function getIcon(item: Item) {
	if ('icon' in item.data && item.data.icon) return item.data.icon;
	if (item.data.type === 'category') return icons.folder;
	if (item.data.type === 'document' && item.childrens?.length) return icons.file_parent;
	if (item.data.type === 'document' && item.data.accessibility == 2) return icons.draft;
	if (item.data.type === 'document' && item.data.accessibility == 3) return icons.archive;
	return icons.file;
}
const toggle = () => isMobile() && (isOpened.value = false);

const draggable = ref<boolean>(true);
const isDragOver = ref<boolean>(false);

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

	let draggedItem = documentStore.getById(draggedItemId) || categoriesStore.getById(draggedItemId) || navigationItems.find((item) => item.id === draggedItemId);

	if (!draggedItem) return;

	if (draggedItem.type === "document" && draggedItem.partial) {
		draggedItem = await documentStore.fetch({ id: draggedItem.id });
	}

	if (draggedItem.type === "document" && props.item.data.type === "category") { // Move document to category
		documentStore.update(
			{ ...draggedItem, category: props.item.id, parent_id: null }
		);
	}
	if (draggedItem.type === "category" && props.item.data.type === "category") { // Move category to category
		if (draggedItem.id === props.item.id) return; // Prevent moving to the same category
		categoriesStore.update(
			{ ...draggedItem, parent_id: props.item.id }
		);
	}
	if (draggedItem.type === "document" && props.item.data.type === "document") { // Move document to document
		if (documentStore.getAllChildrensIds(draggedItem.id).includes(props.item.parent_id)) return; // Prevent moving parent to child
		if (draggedItem.id === props.item.id) return; // Prevent moving to the same document
		documentStore.update(
			{ ...draggedItem, parent_id: props.item.id, category: props.item.data.category }
		);
	}
	if (draggedItem.type === "category" && props.item.data.type === "category") { // Move category to category
		if (draggedItem.id === props.item.id) return; // Prevent moving to the same category
		categoriesStore.update(
			{ ...draggedItem, parent_id: props.item.id }
		);
	}
	if (draggedItem.type === "category" && props.item.data.type === "default") { // Move category to root
		categoriesStore.update(
			{ ...draggedItem, parent_id: undefined }
		);
	}
	if (draggedItem.type === "document" && props.item.data.type === "default") { // Move document to root
		documentStore.update(
			{ ...draggedItem, parent_id: undefined, category: undefined }
		);
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
	&:hover,
	&.router-link-active {
		background: var(--bg-contrast-2);
	}

	.icon {
		display: flex;
		align-items: center;

		&:deep(svg) {
			width: 20px;
			max-height: 25px;
			margin-right: 5px;
		}
	}
}

.drag-over {
	border-bottom: 2px solid var(--blue);
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>