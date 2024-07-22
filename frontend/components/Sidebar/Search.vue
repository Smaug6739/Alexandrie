<template>
	<div v-if="showSearchModal" class="modal-mask">
		<div class="modal-container" ref="searchContainer">
			<span class="search-input">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
					stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
					class="mr-2 h-4 w-4 shrink-0 opacity-50">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.3-4.3"></path>
				</svg>
				<input type="text" v-model="filter" placeholder="Search document" ref="searchInput" />
				<button @click="close" style="background: none;">
					<Icon name="close" />
				</button>
			</span>
			<span class="title">Documents</span>
			<NuxtLink v-if="docs.length" v-for="doc of docs" class="item" :to="`/dashboard/docs/${doc.id}`" @click="close">
				<i class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
						stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
						<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
						<polyline points="14 2 14 8 20 8"></polyline>
					</svg>
				</i>
				<span>{{ doc.name }}</span>
			</NuxtLink>
			<p v-else class="no-result">
				No result found.
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useDocumentsStore } from '~/stores';

const documents = computed(() => useDocumentsStore().getAll.filter(c => c.name.toLowerCase().includes(filter.value.toLowerCase())));
const filter = ref<string>('');
const showSearchModal = ref<boolean>(false);

// Docs = max 5 docs
const docs = computed(() => documents.value.slice(0, 5));

const close = () => {
	showSearchModal.value = false;
	filter.value = '';
};
const searchContainer = ref<HTMLElement | null>(null);
const searchInput = ref<HTMLInputElement | null>(null);

const handleTab = (event: KeyboardEvent) => {
	event.preventDefault();
	if (!searchContainer.value) return;
	const focusableItems = Array.from(searchContainer.value.querySelectorAll('a'));
	const currentIndex = focusableItems.findIndex(item => item === document.activeElement);
	let nextIndex;
	if (event.shiftKey) {
		nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
	} else {
		nextIndex = (currentIndex + 1) % focusableItems.length;
	}
	focusableItems[nextIndex]?.focus();
}

onMounted(() => document.addEventListener('keydown', handleSearchShortCut));
onBeforeUnmount(() => document.removeEventListener('keydown', handleSearchShortCut));
const handleSearchShortCut = (e: KeyboardEvent) => {
	if (e.ctrlKey && e.key === 'q') {
		if (!showSearchModal.value) {
			showSearchModal.value = true;
			nextTick(() => searchInput.value?.focus());
		} else close();
	}
	if (showSearchModal.value) {
		if (e.key === 'Escape') close();
		if (e.key === 'Tab') handleTab(e);
	}
};
</script>

<style lang="scss" scoped>
.modal-container {
	width: 600px;
	margin: auto;
	padding: 20px;
	background-color: var(--bg-color);
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
}

.search-input {
	display: flex;
	align-items: center;


	input {
		background-color: var(--bg-color);
		border: none;
		outline: none;
		width: 100%;
	}

	svg {
		fill: var(--bg-contrast);
	}
}

.title {
	font-weight: 500;
	font-size: 0.75rem;
	color: #737373;
	padding: 10px 0;
}

.item {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	margin: 2.5px 0;
	padding: 10px 0;
	border-radius: 5px;
	color: var(--font-color);
	cursor: pointer;

	&.router-link-active {
		background: var(--bg-contrast-2);
	}

	&:focus {
		outline: 2px solid var(--font-color);
	}

	.icon {
		display: flex;
		align-items: center;

		&:deep(svg) {
			width: 35px;
			margin-right: 5px;
		}
	}
}

.no-result {
	text-align: center;
	font-weight: 500;
	font-size: 0.85rem;
}
</style>
