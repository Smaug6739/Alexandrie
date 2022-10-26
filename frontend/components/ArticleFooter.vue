<template>
	<footer>
		<p>Dernière mise à jour le {{ timestampToString(article.updated_timestamp) }}</p>
		<span v-if="next" class="next">
			<NuxtLink :to="`/docs/${next.main_category}/${next.sub_category}/${next.path}`">{{ next.name }}</NuxtLink>→
		</span>
		<span class="previous" v-if="previous">
			←<NuxtLink :to="`/docs/${previous.main_category}/${previous.sub_category}/${previous.path}`"
				v-text="previous.name"></NuxtLink>
		</span>
	</footer>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { timestampToString } from "@/helpers/date";
import type { Article } from "@/store";
defineProps<{
	article: Article;
	next?: Article;
	previous?: Article;
}>();
</script>

<style scoped>
.next {
	float: right;
}

.previous {
	float: left;
}
</style>