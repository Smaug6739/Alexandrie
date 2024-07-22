<template>
	<div style="display: flex; width: 100%; height: 100%;">
		<Sidebar />
		<MediumView>
			<Navbar />
			<NuxtPage />
		</MediumView>
	</div>
</template>
<script setup lang="ts">
import Sidebar from '~/components/Sidebar/Sidebar.vue';
import { useDocumentsStore, useCategoriesStore } from '@/stores';

definePageMeta({ breadcrumb: 'Home' });
await useDocumentsStore().fetch();
await useCategoriesStore().fetch();
await useUserStore().fetch()
</script>