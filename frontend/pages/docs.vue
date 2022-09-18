<template>
	<div>
		<Sidebar />
		<BackToTop />
		<NuxtPage />
	</div>
</template>
<script lang="ts" setup>
import BackToTop from "../components/common/back-to-top/index"
import Sidebar from "../components/layout/sidebar/Sidebar.vue";
import { useArticlesStore } from "../store";
const articlesStore = useArticlesStore();
articlesStore.fetchAll();
</script>