<template>
  <MarkdownEditor ref="editor" :doc="document" @save="data => save(data)" />
</template>
<script lang="ts" setup>
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';
import type { Document } from '@/stores';

const store = useDocumentsStore();
const editor = ref();
const document = ref<Partial<Document>>({
  category: useSidebar().workspaceId.value || undefined,
  accessibility: 1,
});
const notifications = useNotifications();

definePageMeta({ breadcrumb: 'New' });

function save(doc: Document) {
  store
    .post(doc)
    .then(() => notifications.add({ title: 'Success:', message: 'Document posted', type: 'success', timeout: 3000 }))
    .catch(e => notifications.add({ title: 'Error:', message: e, type: 'error', timeout: 3000 }));
}
</script>
