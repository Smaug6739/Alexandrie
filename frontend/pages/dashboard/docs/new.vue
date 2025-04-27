<template>
  <MarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import MarkdownEditor from '~/components/MarkdownEditor/MarkdownEditor.vue';
import type { Document } from '~/stores';

const store = useDocumentsStore();
const document = ref<Partial<Document>>({
  category: (useRoute().query.cat as string | undefined) || useSidebar().workspaceId.value || undefined,
  accessibility: 1,
});
const notifications = useNotifications();

definePageMeta({ breadcrumb: 'New' });

function save(doc: Document) {
  store
    .post(doc)
    .then(d => {
      notifications.add({ type: 'success', title: 'Document successfully posted' });
      useRouter().push(`/dashboard/docs/edit/${d.id}`);
    })
    .catch(e => notifications.add({ type: 'error', title: 'Error', message: e }));
}
function exit() {
  useRouter().push('/dashboard');
}
</script>
