<template>
	<MarkdownEditor v-if="document" ref="editor" :doc="document" @save="(data) => save(data)" />
</template>
<script lang="ts" setup>
import { useNotifications, useDocumentsStore, type Document } from '@/store';
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';

const store = useDocumentsStore();
const route = useRoute();

const editor = ref();
const doc_id = route.params.id as string;
const document = ref<Document | undefined>(undefined);
const notifications = useNotifications();

watchEffect(async () => {
	const docFromStore = store.getById(doc_id);
	if (docFromStore?.partial) {
		try {
			document.value = await store.fetch({ id: doc_id });
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
