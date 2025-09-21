<template>
  <MarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';
import type { Node } from '~/stores';

const defaultParent = (useRoute().query.cat as string | undefined) || useSidebar().workspaceId.value || undefined;

const store = useNodesStore();
const document = ref<Partial<Node>>({
  parent_id: ['root', 'shared'].includes(defaultParent || '') ? undefined : defaultParent,
  accessibility: 1,
  role: 3,
});
const notifications = useNotifications();

definePageMeta({ breadcrumb: 'New' });

function save(doc: Node) {
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
