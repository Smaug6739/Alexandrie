<template>
  <MarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'New' });

const store = useNodesStore();

const defaultParent = (useRoute().query.cat as string | undefined) || useSidebar().workspaceId.value || undefined;

const document = ref<Partial<Node>>({
  parent_id: ['root', 'shared'].includes(defaultParent || '') ? undefined : defaultParent,
  accessibility: 1,
  role: 3,
});
const notifications = useNotifications();

function save(doc: Node) {
  store
    .post(doc)
    .then(d => {
      notifications.add({ type: 'success', title: 'Document successfully posted' });
      useRouter().push(`/dashboard/docs/edit/${d.id}`);
    })
    .catch(e => notifications.add({ type: 'error', title: 'Error', message: e }));
}
const exit = () => useRouter().push('/dashboard');
</script>
