<template>
	<footer>
		<p class="update">Dernière mise à jour le {{ new Date(parseInt(document.updated_timestamp)).toLocaleDateString() }}
		</p>
		<div class="items">
			<div v-if="previous" class="item left">
				<NuxtLink :to="`/docs/${previous.category}/${previous.id}`">
					<b class="min">Page précédente</b>
					{{ previous.name }}
				</NuxtLink>
			</div>
			<div v-if="next" class="item right">
				<NuxtLink :to="`/docs/${next.category}/${next.id}`">
					<b class="min">Page suivante</b>
					{{ next.name }}
				</NuxtLink>
			</div>
		</div>
	</footer>
</template>

<script lang="ts" setup>
import type { Document } from "@/store";

defineProps<{
	document: Document;
	next?: Document;
	previous?: Document;
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
	color: var(--font-color);
	font-size: small;
}

.update {
	color: var(--font-color);
	border-bottom: 1px solid lighten($grey, 20%);
}
</style>