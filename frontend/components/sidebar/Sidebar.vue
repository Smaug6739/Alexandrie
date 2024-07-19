<template>
	<div :class="{ 'modal-mask': isMobile() && isOpened }"></div>
	<Resizable>
		<div class="sidebar-content">
			<section class="header">
				<span class="name">
					<IconApp />
					<NuxtLink style="font-size: 19px;font-weight: 600;" to="/">Alexandrie</NuxtLink>
				</span>
				<IconClose class="btn" />
			</section>
			<input type="text" placeholder="Search" class="search" v-model="filter" />
			<Search />
			<CollapseItem v-for="(item, index) in items " :key="index" :item="item" :root="true" />
		</div>
	</Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import IconApp from './IconApp.vue';
import Search from './Search.vue';
import { useCategoriesStore, useDocumentsStore, type Category } from '~/stores';
import { ItemsManager, type Item } from './tree_builder';
import { navigationItems } from "./helpers";


const { isOpened, hasSidebar } = useSidebar();
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();
const filter = ref<string>('');
const showSearchModal = ref<boolean>(false);

const handleSearchShortCut = (e: KeyboardEvent) => {
	if (e.ctrlKey && e.key === 'q') showSearchModal.value = !showSearchModal.value;
};

const items = computed((): Item[] => {
	const navigation: Item[] = navigationItems.map((item) => ({ id: item.id, parent_id: '', title: item.title, route: item.route, icon: item.icon, type: 'navigation', data: item }))
	const categories: Item[] = categoriesStore.categories.map((category: Category) => ({
		id: category.id,
		parent_id: category.parent_id || '',
		title: category.name,
		route: category.parent_id ? `/dashboard/categories/${category.id}` : '',
		icon: category.icon,
		data: category,
	}))
	const documents: Item[] = documentsStore.documents.map((document) => ({
		id: document.id,
		parent_id: document.parent_id || document.category || '',
		title: document.name,
		route: `/dashboard/docs/${document.id}`,
		data: document
	})).filter(c => c.data.name.toLowerCase().includes(filter.value.toLowerCase()));

	if (filter.value) return new ItemsManager([...navigation, ...documents]).generateTree();
	return new ItemsManager([...navigation, ...documents, ...categories]).generateTree();
});


const handleClickOutside = (e: MouseEvent) => {
	if (isOpened.value && e.target && (!(e.target as Element).closest('.sidebar') && !(e.target as Element).closest('.open-sidebar'))) isOpened.value = false;
};

onMounted(() => {
	hasSidebar.value = true;
	if (isMobile()) return window.addEventListener('click', handleClickOutside);
	// ELSE: Desktop
	isOpened.value = true;
	document.addEventListener('keypress', handleSearchShortCut)
});
onBeforeUnmount(() => {
	hasSidebar.value = false;
	window.removeEventListener('click', handleClickOutside);
	document.removeEventListener('keypress', handleSearchShortCut)
});
</script>

<style scoped lang="scss">
.sidebar-content {
	margin: 0 0 0 10px;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;

	.btn {
		fill: var(--font-color);
		width: 30px;
		cursor: pointer;
	}

	.name {
		display: flex;
		align-items: center;
		font-size: 1rem;
		font-weight: 400;
		font-family: Inter;
	}
}

.search {
	height: 30px;
	margin: 2.5px 0;
	border-radius: 8px;
	width: 98%;
	outline: none;
	border: none;
	background-color: var(--bg-contrast);
	background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%232573cf" height="24" viewBox="0 -960 960 960" width="22"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>');
	background-repeat: no-repeat;
	background-position: 5px;
	padding-left: 30px;
}
</style>