<template>
	<div class="cdn-component">
		<h2>Uploader un fichier sur le CDN</h2>
		<div class="dropzone" :class="{ 'drag-over': isDragOver }" @dragover.prevent @drop.prevent="handleFileDrop"
			@dragenter.prevent="dragEnter" @dragleave.prevent="dragLeave">
			<input type="file" ref="fileInput" @change="handleFileSelect" />
			<div v-if="selectedFile" class="file-info">
				<span>{{ selectedFile.name }}</span>
				<div class="file-size">{{ readableFileSize(selectedFile.size) }}</div>
			</div>
			<div v-else>
				Glissez et déposez un fichier ici ou <span class="clickable" @click="triggerFileSelect">cliquez pour
					sélectionner</span>.
			</div>
		</div>
		<button @click="submitFile" :disabled="!selectedFile">Uploader sur le serveur</button>
		<div v-if="isLoading" class="loading-spinner"></div>
		<div v-if="fileLink" class="link-section">
			<input type="text" v-model="fileLink" readonly />
			<button @click="copyLink">Copy link</button>
		</div>
		<h2>Ressources existantes</h2>
		<div v-if="ressources.length" class="ressources-list">
			<div v-for="ressource in ressources" :key="ressource.id" class="ressource-item">
				<div class="ressource-info">
					<span class="ressource-name">{{ ressource.filename }}</span>
					<span class="ressource-size">{{ readableFileSize(ressource.file_size) }}</span>
					<span class="ressource-type">{{ ressource.file_type }}</span>
					<span class="ressource-date">{{ formatDate(ressource.created_timestamp) }}</span>
				</div>
				<a :href="`/static${ressource.transformed_path || ressource.original_path}`" target="_blank">View</a>
			</div>
		</div>
		<div v-else>
			Aucune ressource disponible.
		</div>
	</div>
</template>
<script setup lang="ts">
import { useNotifications, useRessourcesStore } from '~/store';
const ressourcesStore = useRessourcesStore();
await ressourcesStore.fetch();

const selectedFile: Ref<File | null> = ref(null);
const isDragOver = ref(false);
const fileLink = ref('');
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const isLoading = ref(false);
const ressources = ressourcesStore.ressources;
const triggerFileSelect = () => fileInput.value!.click();
const handleFileSelect = (event: Event) => selectedFile.value = (event.target as HTMLInputElement | null)?.files?.[0] || null;
definePageMeta({ breadcrumb: 'CDN' });

const handleFileDrop = (event: DragEvent) => {
	if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
		selectedFile.value = event.dataTransfer.files[0];
		isDragOver.value = false;
	}
}

const copyLink = () => navigator.clipboard.writeText(fileLink.value!);
const dragEnter = () => isDragOver.value = true;
const dragLeave = () => isDragOver.value = false;

const submitFile = async () => {
	if (!selectedFile.value) return;
	isLoading.value = true;

	const body = new FormData();
	body.append("file", selectedFile.value);
	clearForm();

	const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/ressources`, {
		method: "POST",
		credentials: "include",
		body: body,
	});

	const result = await response.json();
	isLoading.value = false;
	if (result.status === "success") fileLink.value = `${import.meta.env.VITE_BASE_API}/static${result.result.transformed_path || result.result.original_path}`;
	else useNotifications().add({ type: "error", title: "Error", message: result.message, timeout: 5000 })
}

const readableFileSize = (size: number): string => {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`
}

const formatDate = (timestamp: string): string => {
	const date = new Date(parseInt(timestamp));
	return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

const clearForm = () => selectedFile.value = null;
</script>

<style scoped lang="scss">
.cdn-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	padding: 2rem;
	border-radius: 8px;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

	.dropzone {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 150px;
		border: 2px dashed #9e9e9e;
		border-radius: 4px;
		font-size: 14px;
		color: #9e9e9e;
		position: relative;
		transition: background-color $transition-duration;
		background-color: var(--dropzone-bg, transparent);

		&:hover {
			background-color: var(--bg-contrast);
		}

		input[type="file"] {
			display: none;
		}
	}

	.file-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #2196F3;
		color: #2196F3;

		.file-size {
			font-size: 0.8rem;
			color: #757575;
			margin-top: 5px;
		}
	}

	.link-section {
		margin-top: 15px;
		display: flex;
		gap: 10px;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.loading-spinner {
		border: 5px solid #f3f3f3;
		border-top: 5px solid $primary-400;
		border-radius: 50%;
		width: 50px;
		height: 50px;
		animation: spin 1s linear infinite;
	}

	.clickable {
		color: #2196F3;
		cursor: pointer;
		text-decoration: underline;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	.ressources-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.ressource-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 1rem;
			border: 1px solid #ddd;
			/* Lighter border for a subtler effect */
			border-radius: 8px;
			background-color: #fafafa;
			/* Light gray background for list items */
			transition: background-color 0.2s ease, box-shadow 0.2s ease;

			&:hover {
				background-color: #e3e3e3;
				/* Slightly darker on hover */
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
				/* Subtle shadow on hover */
			}

			.ressource-info {
				display: flex;
				justify-content: space-around;
				width: 100%;

				.ressource-name {
					font-weight: bold;
					color: #333;
					/* Darker text for better contrast */
				}

				.ressource-size,
				.ressource-type,
				.ressource-date {
					font-size: 0.9rem;
					color: #757575;
				}
			}

			a {
				color: #2196f3;
				text-decoration: none;
				font-weight: bold;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}
}

.dropzone.drag-over {
	background-color: #E3F2FD;
	border-color: #2196F3;
	transition: background-color $transition-duration, border-color $transition-duration;
}

.file-info {
	color: #2196F3;
}
</style>
