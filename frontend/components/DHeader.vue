<template>
	<nav aria-label="breadcrumb">
		<ol class="breadcrumb">
			<li v-for="(segment, index) in breadcrumbs" :key="index" class="breadcrumb-item">
				<NuxtLink :to="segment.path"> {{ segment.name }} </NuxtLink>
			</li>
		</ol>
	</nav>
</template>

<script setup lang="ts">
import type { RouteLocation } from 'vue-router';

const route: RouteLocation = useRoute();
const router = useRouter();
const breadcrumbs: Ref<Array<{ name: string, path: string }>> = ref([]);
declare module 'vue-router' {
	interface RouteMeta {
		breadcrumb: () => string;
	}
}

watchEffect(() => {
	breadcrumbs.value = [];
	route.matched.forEach((match) => {
		let name = '';
		if (typeof match.meta.breadcrumb == 'function') name = match.meta.breadcrumb();
		else if (typeof match.meta.breadcrumb == 'string') name = match.meta.breadcrumb;
		if (!name) return;
		const r = router.resolve(match);
		breadcrumbs.value.push({
			name,
			path: r.path
		});
	});

})
</script>

<style scoped>
.breadcrumb {
	display: flex;
	flex-wrap: wrap;
	padding: 0;
	list-style: none;
	border-radius: 0.25rem;
	font-family: Inter;
}

.breadcrumb-item+.breadcrumb-item::before {
	content: "/";
	padding: 0 0.5rem;
}

.breadcrumb-item a {
	font-size: 20px;
	font-weight: 600;
}
</style>
