<template>
	<aside>
		<div class="header">
			<Search class="search" @update:query="querySearch = $event" />
			<NuxtLink class="add" to="/dashboard/new">
				<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
					<path
						d="M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
				</svg>
			</NuxtLink>
		</div>
		<div v-for="(doc) in docs" :class="{ 'item-container': true, active: isActive(doc.id) }">
			<NuxtLink class="item" :to="linkTo(doc.id)">
				<div class="header">
					<span class="title">{{ doc.name }}</span>
					<span class="date">{{ formatDate(doc.created_timestamp) }}</span>
				</div>
				<p class="description">{{ doc.description }}</p>
			</NuxtLink>
		</div>
	</aside>
</template>

<script setup lang="ts">
import { useDocumentsStore } from '~/store';
import { useRoute } from "vue-router";
import Search from './Search.vue';
const route = useRoute();
const formatDate = (timestamp: string) => new Date(parseInt(timestamp)).toLocaleDateString();
const isActive = (id: string) => route.query.doc === id;
const querySearch = ref('');
const docs = computed(() => {
	const normal = (() => {
		return useDocumentsStore().getAll
			.filter((doc) => {
				if (!route.query.category) return true;
				if (route.query.category === 'uncategorized') return !doc.category;
				if (route.query.category === 'draft') return doc.accessibility === 2
				if (route.query.category === 'archive') return doc.accessibility === 3
				if (route.query.category === 'trash') return doc.accessibility === 4
				return doc.category === route.query.category;
			});
	})();
	return normal.filter((doc) => doc.name.toLowerCase().includes(querySearch.value.toLowerCase()));
});


const linkTo = (id: string) => {
	if (process.client && window.innerWidth <= 768) return `/dashboard/edit?doc=${id}`;
	return `/dashboard/?doc=${id}`;
};

</script>

<style lang="scss" scoped>
aside {
	background: var(--bg-color);
	padding: .7rem;
	overflow-y: scroll;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 1rem;

	.add {
		cursor: pointer;
		fill: $primary-400;
	}
}

.item-container {
	margin: 0.5rem 0;
	padding: 0.5rem;
	border-radius: 5px;
	transition: all $transition-duration ease;

	&:hover,
	&.active {
		background-color: var(--bg-contrast);
	}
}

.item {
	display: block;
	transition: all $transition-duration ease-in-out;
	border-bottom: 1px solid var(--border-color);

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0;
	}

	.title {
		font-size: 1rem;
		font-weight: 500;
	}

	.date {
		font-size: 0.8rem;
		color: darken($grey, 20%);
	}

	.description {
		font-size: 14px;
		font-weight: 400;
		margin: 0.3rem 0;
	}
}
</style>