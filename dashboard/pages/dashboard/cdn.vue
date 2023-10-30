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
		<button @click="submitFile" :disabled="!selectedFile">Uploader on server</button>
		<div v-if="isLoading" class="loading-spinner"></div>
		<div v-if="fileLink" class="link-section">
			<input type="text" v-model="fileLink" readonly />
			<button @click="copyLink">Copy link</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useNotifications } from '~/store';

const selectedFile: Ref<File | null> = ref(null);
const isDragOver = ref(false);
const fileLink = ref('');
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const isLoading = ref(false);

const triggerFileSelect = () => fileInput.value!.click();
const handleFileSelect = (event: any) => selectedFile.value = event.target?.files[0];

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

	const response = await fetch(`${import.meta.env.VITE_BASE_API}/api/v1/cdn/image`, {
		method: "POST",
		credentials: "include",
		body: body,
	});

	const result = await response.json();
	isLoading.value = false;
	clearForm();
	if (result.status === "success") fileLink.value = `${import.meta.env.VITE_BASE_API}/static${result.result}`;
	else useNotifications().add({ type: "error", title: "Error", message: result.message, timeout: 5000 })
}

const readableFileSize = (size: number): string => {
	let i = Math.floor(Math.log(size) / Math.log(1024));
	return `${(size / Math.pow(1024, i)).toFixed(2)} ${["B", "kB", "MB", "GB", "TB"][i]}`
}

const clearForm = () => selectedFile.value = null;
</script>

<style scoped lang="scss">
.dropzone.drag-over {
	background-color: #E3F2FD;
	border-color: #2196F3;
	transition: background-color 0.3s, border-color 0.3s;
}

.file-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #2196F3;
}

.file-size {
	font-size: 0.8rem;
	color: #757575;
	margin-top: 5px;
}

.cdn-component {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.5rem;
	padding: 2rem;
	border-radius: 8px;
	width: 320px;
	margin: 0 auto;
	box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

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
	transition: background-color 0.2s;
	background-color: var(--dropzone-bg, transparent);

}

.dropzone:hover {
	background-color: var(--bg-contrast);
}

.dropzone input[type="file"] {
	display: none;
}

.clickable {
	color: #2196F3;
	cursor: pointer;
	text-decoration: underline;
}



.file-info {
	color: #2196F3;
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

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>