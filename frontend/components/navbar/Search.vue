<template>
	<div class="search-box">
		<input v-model="inputText" type="text" placeholder="Search..." @focus="isActive = true" @blur="isActive = false"
			ref="inputElement" />
		<ul v-if="isActive && inputText.length > 0" class="suggestions">
			<li v-if="results.length" v-for="result in results" :key="result.id" class="suggestion"
				@mousedown="(e) => e.preventDefault()">
				<NuxtLink :to="result.path" class="a-classic" @click="leave()"> {{ result.name }} </NuxtLink>
			</li>
			<li v-else>Aucun résultat...</li>
		</ul>
	</div>
</template>

<style scoped lang="scss">
input {
	-webkit-appearance: none;
	appearance: none;
	cursor: text;
	width: 180px;
	height: 2rem;
	color: var(--font-color);
	display: inline-block;
	border: 1px solid var(--border-color);
	border-radius: 2rem;
	font-size: 0.9rem;
	line-height: 2rem;
	padding: 0 0.5rem 0 2rem;
	transition: all ease 0.3s;
	background: var(--bg-color) url('search.svg') 0.6rem 0.5rem no-repeat;
	background-size: 1rem;
}

input:focus {
	box-shadow: 0 0 0 1px var(--border-color);
	outline: none;
	width: 250px;
}

ul {
	margin: 0;
	padding: 0;
	list-style: none;
}


.search-box {
	display: inline-block;
	position: relative;
}

.suggestions {
	background: var(--bg-color);
	width: 20rem;
	position: absolute;
	top: 2.5rem;
	right: 0;
	border: 1px solid var(--border-color);
	border-radius: 6px;
	padding: 0.3rem;
	list-style-type: none;
	z-index: 2;
}

.suggestion {
	line-height: 1.4;
	border-radius: 4px;
	cursor: pointer;
	margin: 0;
	padding: 0.4em;
	font-size: calc(100% - 2px);

	&:hover {
		background: var(--contrast-color);
	}

	a {
		display: block;
	}

}


@media (max-width: 768px) {
	input:focus {
		width: 12.5rem;
	}
}

@media (max-width: 719px) {
	input {
		cursor: pointer;
		width: 0;
		border-color: transparent;
		position: relative;
	}

	input:focus {
		cursor: text;
		left: 0;
		width: 10rem;
	}
}
</style>

<script setup lang="ts">
import { useCategoriesStore, useArticlesStore } from "@/store";

const inputText = ref("");
const inputElement = ref<HTMLInputElement>();
const isActive = ref(false);

const categories = useCategoriesStore();
const articles = useArticlesStore();

// Return max 5 results
const results = computed(() => {
	if (!inputText.value) return [];
	const results = [];
	const categoryResults = categories.search(inputText.value).map(c => ({ id: c.id, name: c.name, path: `/docs/${c.path}` }));
	const articleResults = articles.search(inputText.value).map(a => ({ id: a.id, name: a.name, path: `/docs/${a.main_category}/${a.sub_category}/${a.path}` }));

	results.push(...categoryResults);
	results.push(...articleResults);

	return results.slice(0, 5);
});
const leave = () => {
	isActive.value = false;
	inputText.value = "";
	inputElement.value?.blur();
};
</script>