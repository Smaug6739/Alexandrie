<template>
  <MarkdownEditor ref="editor" :doc="document" @save="data => save(data)" />
</template>
<script lang="ts" setup>
import type { Document } from '@/stores';
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';

const store = useDocumentsStore();
const editor = ref();
const document = ref<Document | undefined>();
const notifications = useNotifications();

definePageMeta({ breadcrumb: 'New' });

function save(doc: Document) {
  store
    .post(doc)
    .then(() => notifications.add({ title: 'Success:', message: 'Document posted', type: 'success', timeout: 5000 }))
    .catch(e => notifications.add({ title: 'Error:', message: e, type: 'error', timeout: 5000 }));
}
</script>
