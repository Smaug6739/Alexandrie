<template>
	<footer>
		<p class="update">Dernière mise à jour le {{ timestampToString(article.updated_timestamp || 0) }}</p>
		<hr />
		<div class="items">
			<div v-if="previous" class="item left">
				<NuxtLink :to="`/docs/${previous.main_category}/${previous.sub_category}/${previous.path}`">
					<b class="min">Page précédente</b>
					{{ previous.name }}
				</NuxtLink>
			</div>
			<div v-if="next" class="item right">
				<NuxtLink :to="`/docs/${next.main_category}/${next.sub_category}/${next.path}`">
					<b class="min">Page suivante</b>
					{{ next.name }}
				</NuxtLink>
			</div>
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
	margin: 50px 0 40px;
}

@media screen and (min-width: 768px) {
	.items {
		display: flex;
		justify-content: space-between;
	}

	.item {
		max-width: 400px;
	}
}

.item {
	width: 100%;
	border-radius: 7px;
	border: 1px solid var(--border-color);
	padding: 10px;
	margin: 5px 0;
	font-weight: 600;
	font-size: 15px;
	transition: border .25s;

	b {
		display: block;
	}

	&:hover {
		border: 1px solid $primary-400;
	}
}


.right {
	margin-left: auto;
	text-align: right;
}

.left {
	margin-right: auto;
	text-align: left;
}

.min {
	color: var(--font-color-dimmed);
	font-size: small;
}

.update {
	color: var(--font-color-dimmed);
}
</style>