<template>
	<footer>
		<p class="update">Dernière mise à jour le {{ new Date(parseInt(document.updated_timestamp)).toLocaleDateString() }}
		</p>
		<div class="items">
			<NuxtLink v-if="previous" :to="`/dashboard/doc/${previous.id}`" class="item left">
				<b class="min">Page précédente</b>
				{{ previous.name }}
			</NuxtLink>
			<NuxtLink v-if="next" :to="`/dashboard/doc/${next.id}`" class="item right">
				<b class="min">Page suivante</b>
				{{ next.name }}
			</NuxtLink>
		</div>
	</footer>
</template>

<script lang="ts" setup>
import type { Document } from "@/store";
defineProps<{ document: Document; next?: Document; previous?: Document; }>();
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

}

.item {
	display: block;
	width: 100%;
	max-width: 400px;
	border-radius: 7px;
	border: 1px solid var(--border-color);
	padding: 10px;
	margin: 5px 0;
	font-weight: 600;
	font-size: 15px;
	transition: color .25s;

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
	font-size: small;
}

.update {
	border-bottom: 1px solid lighten($grey, 20%);
}
</style>