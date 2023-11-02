<template>
	<div class="container">
		<MarkdownEditorVue ref="editor" :doc="document" @save="(data) => save(data)" />
	</div>
</template>
<script lang="ts" setup>
import { useNotifications, useDocumentsStore, type Document } from '@/store';
import MarkdownEditorVue from '@/components/MarkdownEditor/MarkdownEditor.vue';

const store = useDocumentsStore();

const editor = ref();
const document = ref<Document | undefined>(undefined);
const notifications = useNotifications();


function save(doc: Document) {
	store.post(doc)
		.then(() => notifications.add({ title: "Success:", message: "Document posted", type: "success", timeout: 5000 }))
		.catch((e) => notifications.add({ title: "Error:", message: e, type: "error", timeout: 5000 }))
}

</script>
<style lang="scss" scoped>
.container {
	width: 100%;
	padding: 12px;
}
</style>