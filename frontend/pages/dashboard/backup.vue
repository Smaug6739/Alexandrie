<template>
	<div class="backup-component">
		<h2>Create a Database Backup</h2>
		<p>Click the button below to create a backup of your database.</p>
		<button @click="submitFile">Create Backup</button>
		<div v-if="isLoading" class="loading-spinner"></div>
		<div class="link-section" v-if="downloadLink">
			<p>Your backup is ready. You can copy the link to share it or download it.</p>
			<input type="text" v-model="downloadLink" readonly placeholder="Backup Link" />
			<button @click="copyLink">Copy Link</button>
			<NuxtLink :href="downloadLink" :download="downloadLink" class="download">Download Backup</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/stores';

const downloadLink = ref<string | null>(null);
const copyLink = () => navigator.clipboard.writeText(downloadLink.value!);
const isLoading = ref(false);
definePageMeta({ breadcrumb: 'Backup' });

async function submitFile() {
	isLoading.value = true;
	const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/backups`, {
		method: 'POST',
		credentials: 'include',
	});
	const result = await response.json();
	isLoading.value = false;
	if (result.status != 'success') {
		useNotifications().add({ type: "error", title: "Error", message: result.message, timeout: 5000 })
		return;
	}

	downloadLink.value = `${import.meta.env.VITE_BASE_API}/static${result.result.url}`;
}
</script>

<style scoped lang="scss">
.backup-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 2rem;
	margin: 0 auto;
	height: min-content;

	h2 {
		margin-bottom: 1rem;
	}

	input {
		margin-bottom: 1rem;
	}

	.download {
		margin-left: 15px;
	}
}

.loading-spinner {
	border: 5px solid #f3f3f3;
	border-top: 5px solid $primary-400;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>