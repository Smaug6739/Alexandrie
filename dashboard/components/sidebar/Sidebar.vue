<template>
	<Resizable>
		<div class="sidebar-content">
			<section class="header">
				<IconApp />
				<p style="font-size: 19px;font-weight: 600;">Dashboard</p>
				<IconClose class="btn" />
			</section>
			<SidebarDropdown :categories="categoriesStore.getParents" v-model="category_dropdown_filter" />
			<CollapseItem v-for="(item, index) in items " :key="index" :item="item" :root="true" />
		</div>
	</Resizable>
</template>

<script setup lang="ts">
import CollapseItem from './CollapseItem.vue';
import Resizable from './Resizable.vue';
import IconClose from './IconClose.vue';
import IconApp from './IconApp.vue';
import { useCategoriesStore, useDocumentsStore, type Category } from '~/store';
import { ItemsManager, type Item } from './tree_builder';
import { navigationItems } from "./helpers";

const { isOpened, hasSidebar } = useSidebar();
const category_dropdown_filter = ref('');
const categoriesStore = useCategoriesStore();
const documentsStore = useDocumentsStore();

const isMobile = () => process.client ? window.innerWidth <= 768 : false;

const items = computed((): Item[] => {
	const navigation: Item[] = navigationItems.map((item) => ({ id: item.id, parent_id: '', title: item.title, route: item.route, icon: item.icon, type: 'navigation', data: item }))
	const categories: Item[] = categoriesStore.categories.map((category: Category) => ({
		id: category.id,
		parent_id: category.parent_id || '',
		title: category.name,
		route: category.parent_id ? `/dashboard/category/${category.id}` : '',
		icon: category.icon,
		data: category,
	}));
	const documents: Item[] = documentsStore.documents.map((document) => ({
		id: document.id,
		parent_id: document.parent_id || document.category || '',
		title: document.name,
		route: `/dashboard/doc/${document.id}`,
		data: document
	}))

	const itemsManager = new ItemsManager([...navigation, ...documents, ...categories]);
	const tree = itemsManager.generateTree()
	return tree;
});


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
	background: var(--bg-color);
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