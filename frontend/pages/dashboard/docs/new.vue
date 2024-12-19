<template>
  <MarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';
import type { Document } from '@/stores';

const store = useDocumentsStore();
const document = ref<Partial<Document>>({
  category: useSidebar().workspaceId.value || undefined,
  accessibility: 1,
});
const notifications = useNotifications();

definePageMeta({ breadcrumb: 'New' });

function save(doc: Document) {
  store
    .post(doc)
    .then(d => {
      notifications.add({ title: 'Success:', message: 'Document posted', type: 'success', timeout: 3000 });
      useRouter().push(`/dashboard/docs/edit/${d.id}`);
    })
    .catch(e => notifications.add({ title: 'Error:', message: e, type: 'error', timeout: 3000 }));
}
function exit() {
  useRouter().push('/dashboard');
}
</script>
