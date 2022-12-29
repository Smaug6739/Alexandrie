<template>
	<div>
		<h2>Sitemap generator</h2>
		<button type="button" class="btn btn-theme" @click="generate">Generate</button>
		<fieldset>
			<legend>URLs</legend>
			<p v-for="url in urls" :key="url">{{ url }}</p>
		</fieldset>
		<button type="button" class="btn btn-theme" @click="copy">Copy</button>
	</div>

</template>
<script setup lang="ts">
import { useArticlesStore, useCategoriesStore } from '@/store';

const articlesStore = useArticlesStore();
const categoriesStore = useCategoriesStore();

const urls = ref([] as string[])

const generate = () => {
	urls.value = [];
	for (const category of categoriesStore.getAll) {
		urls.value.push(`${document.location}/docs/${category.path}`);
	}
	for (const article of articlesStore.getAll) {
		urls.value.push(`https://alexandrie-hub.fr/docs/${article.main_category}/${article.sub_category}/${article.path}`);
	}
}
function copy() {
	navigator.clipboard.writeText(urls.value.join("\n"))
}
</script>