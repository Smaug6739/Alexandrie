<template>
	<footer>
		<p class="update">Dernière mise à jour le {{ timestampToString(article.updated_timestamp) }}</p>
		<hr />
		<div class="items">
			<NuxtLink class="item left" v-if="previous"
				:to="`/docs/${previous.main_category}/${previous.sub_category}/${previous.path}`">
				<span class="min">Page précédente</span>
				{{ previous.name }}
			</NuxtLink>
			<NuxtLink class="item right" v-if="next" :to="`/docs/${next.main_category}/${next.sub_category}/${next.path}`">
				<span class="min">Page suivante</span>
				{{ next.name }}
			</NuxtLink>
		</div>
	</footer>
</template>

<script lang="ts" setup>
import { timestampToString } from "@/helpers/date";
import type { Article } from "@/store";

defineProps<{
	article: Article;
	next?: Article;
	previous?: Article;
}>();
</script>

<style scoped lang="scss">
footer {
	margin-top: 50px;
}

.items {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	margin-bottom: 20px;
}

.item {
	width: 100%;
	max-width: 300px;
	border-radius: 7px;
	border: 1px solid var(--border-color);
	padding: 5px 10px 5px 10px;
	font-weight: 600;
	font-size: 15px;
	transition: border .25s;

	span {
		display: block;
	}

	&:hover {
		border: 1px solid $primary-400;
	}
}

.left {
	text-align: left;
	margin-right: auto;
}

.right {
	text-align: right;
	margin-left: auto;
}

.min {
	color: $grey;
	font-size: small;
}

.update {
	color: $grey;

}
</style>