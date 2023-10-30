<template>
	<main>
		<DocumentList class="list" />
		<Preview class="preview" />
	</main>
</template>

<script lang="ts" setup>
import DocumentList from "../components/documents-list/List.vue";
import Preview from "../components/Preview.vue";
</script>

<style scoped lang="scss">
main {
	display: flex;
	height: 100vh;
	width: 100%;
}

.list {
	width: 30%;
}

.preview {
	width: 70%;
}

@media screen and (max-width: 1024px) {
	.list {
		width: 50%;
	}

	.preview {
		width: 50%;
	}
}

@media screen and (max-width: 768px) {
	.list {
		width: 100%;
	}

	.preview {
		display: none;
	}
}
</style>

