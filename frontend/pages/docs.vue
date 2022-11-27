<template>
	<div>
		<Sidebar />
		<NuxtPage />
	</div>
</template>
<script lang="ts" setup>
import Sidebar from "../components/sidebar/Sidebar.vue";
import { useArticlesStore } from "../store";
const articlesStore = useArticlesStore();
articlesStore.fetchArticles();
</script>