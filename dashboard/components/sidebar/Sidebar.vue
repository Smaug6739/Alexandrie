<template>
	<Resizable class="no-print">
		<div class="sidebar-content">
			<section class="header">
				<IconApp />
				<p style="font-size: 19px;font-weight: 600;">Dashboard</p>
				<IconClose class="btn" />
			</section>
			<section>
				<CollapseItem v-for="(item, index) in items" :key="index" :item="item" />
			</section>
		</div>
	</Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import IconApp from './IconApp.vue';
import { useCategoriesStore, useDocumentsStore, type Document } from '~/store';
import { isOpened, type Item, defaultItems, hasSidebar } from "./helpers";

const isMobile = () => process.client ? window.innerWidth <= 768 : false;
const handleClickOutside = (e: MouseEvent) => {
	if (isOpened.value && e.target && (!(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar')) && isMobile()) isOpened.value = false;
};
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const items = computed((): Item[] => [
	...defaultItems,
	...formatTree()
]);

function formatTree(): Item[] {
	const parents = categoriesStore.getParents;
	const items: Item[] = [];
	parents.forEach((parent) => {
		const childrens: Item[] = [];
		categoriesStore.getChilds(parent.id).forEach((child) => {
			childrens.push({
				id: child.id,
				title: child.name,
				icon: child.icon,
				route: `/dashboard/?category=${child.id}`,
				childrens: documentsToItems(documentsStore.getByCategories(child.id))
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

function documentsToItems(documents: Document[]): Item[] {
	const items: Item[] = [];
	documents.forEach((document) => {
		items.push({
			id: document.id,
			title: document.name,
			icon: '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path style="fill:var(--yellow);" d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>',
			route: `/dashboard?doc=${document.id}`,
			childrens: []
		});
	});
	return items;
}

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
@import "./__sidebar.scss";
</style>