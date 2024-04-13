<template>
	<Resizable>
		<div class="sidebar-content">
			<section class="header">
				<IconApp />
				<p style="font-size: 19px;font-weight: 600;">Dashboard</p>
				<IconClose class="btn" />
			</section>
			<SidebarDropdown :categories="categoriesStore.getParents" v-model="category_dropdown_filter" />
			<CollapseItem v-for="(item, index ) in items " :key="index" :item="item" :root="true" />
		</div>
	</Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import IconApp from './IconApp.vue';
import { useCategoriesStore, useDocumentsStore, type Document } from '~/store';
import { type Item, defaultItems } from "./helpers";

type DocumentTree = Document & { childrens: DocumentTree[] };

const { isOpened, hasSidebar } = useSidebar();
const category_dropdown_filter = ref('');
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();

const isMobile = () => process.client ? window.innerWidth <= 768 : false;


const items = computed((): Item[] => [
	...defaultItems,
	...formatTree().filter((item) => {
		if (category_dropdown_filter.value === '') return true;
		return item.id === category_dropdown_filter.value;
	})
]);


function formatTree(): Item[] {
	const items: Item[] = [];
	categoriesStore.getParents.forEach((parent) => {
		const childrens: Item[] = [];
		categoriesStore.getChilds(parent.id).forEach((child) => {
			childrens.push({
				id: child.id,
				title: child.name,
				icon: child.icon,
				route: '',
				childrens: documentsTreeToItems(convertDocumentsToTree(documentsStore.getByCategories(child.id)))
			});
		});
		items.push({
			id: parent.id,
			title: parent.name,
			icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill:var(--blue);" d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z"/></svg>`,
			childrens,
			route: ``
		});
	});
	return items;
}

function convertDocumentsToTree(documents: Document[]): DocumentTree[] {
	const documentMap: { [id: string]: DocumentTree } = {};

	// Create a map of documents indexed by their id
	documents.forEach(doc => {
		documentMap[doc.id] = { ...doc, childrens: [] };
	});

	// Build the tree structure
	const documentTree: DocumentTree[] = [];
	documents.forEach(doc => {
		if (doc.parent_id && documentMap[doc.parent_id]) {
			documentMap[doc.parent_id].childrens.push(documentMap[doc.id]);
		} else {
			documentTree.push(documentMap[doc.id]);
		}
	});

	return documentTree;
}

function documentsTreeToItems(documentsTree: DocumentTree[]): Item[] {
	const items: Item[] = [];
	documentsTree.forEach((doc) => {
		const childrens: Item[] = documentsTreeToItems(doc.childrens);
		items.push({
			id: doc.id,
			title: doc.name,
			icon: defaultIcon(childrens.length > 0),
			route: `/dashboard?doc=${doc.id}`,
			childrens: childrens,
		});
	});
	return items;
}

function defaultIcon(hasChild: boolean): string {
	if (hasChild) return '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill:var(--green);" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h240v-560H200v560Zm320 0h240v-280H520v280Zm0-360h240v-200H520v200Z"/></svg>';
	return '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill:var(--yellow);" d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>';
}


const handleClickOutside = (e: MouseEvent) => {
	if (isOpened.value && e.target && (!(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) && isMobile()) isOpened.value = false;
};

onMounted(() => {
	hasSidebar.value = true;
	if (!process.client) return;
	isMobile() ? isOpened.value = false : isOpened.value = true;
	window.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
	hasSidebar.value = false;
	if (!process.client) return;
	window.removeEventListener('click', handleClickOutside);
});


// Watch isOpened
watch(isOpened, (val) => {
	if (process.client && val && isMobile()) document.getElementById('backdrop')?.classList.add('backdrop');
	if (process.client && !val && isMobile()) document.getElementById('backdrop')?.classList.remove('backdrop');
});
</script>

<style scoped lang="scss">
.sidebar-content {
	margin: 0 0 0 10px;
	background: var(--bg-contrast);
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow-y: scroll;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	margin: 10px 0 15px 0;

	.btn {
		fill: var(--font-color);
		width: 30px;
		cursor: pointer;
	}

	.name {
		font-size: 1.2rem;
		font-weight: 500;
	}
}
</style>