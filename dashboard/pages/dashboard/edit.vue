<template>
	<div v-if="document" class="edit-component">
		<MarkdownEditorVue ref="editor" :doc="document" @save="(data) => save(data)" />
	</div>
</template>
<script lang="ts" setup>
import { useNotifications, useDocumentsStore, type Document } from '@/store';
import MarkdownEditorVue from '@/components/MarkdownEditor/MarkdownEditor.vue';

const store = useDocumentsStore();
const route = useRoute();

const editor = ref();
const doc_id = computed(() => route.query.doc as string);
const document = ref<Document | undefined>(undefined);
const notifications = useNotifications();

watchEffect(async () => {
	const docFromStore = store.getById(doc_id.value);
	if (docFromStore?.partial) {
		try {
			document.value = await store.fetch({ id: doc_id.value as string });
		} catch (error) {
			console.error("Error fetching document:", error);
		}
	} else document.value = docFromStore;
});
function save(doc: Document) {
	store.update(doc)
		.then(() => notifications.add({ title: "Success:", message: "Document updated", type: "success", timeout: 5000 }))
		.catch((e) => notifications.add({ title: "Error:", message: e, type: "error", timeout: 5000 }))
}

</script>
<style lang="scss" scoped>
.edit-component {
	width: 100%;
	height: 100%;
}
</style>