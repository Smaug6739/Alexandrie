<template>
  <LazyMarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';

interface NewDocumentQuery {
  cat?: string;
  parent_id?: string
}

definePageMeta({ breadcrumb: {i18n: 'common.actions.new'} });

const store = useNodesStore();
const notifications = useNotifications();
const route = useRoute();
const sidebar = useSidebar();

const routeQuery = computed<NewDocumentQuery>(() => route.query);
const defaultParent = computed(() => routeQuery.value.parent_id || routeQuery.value.cat || sidebar.workspaceId.value || undefined);
const document = computed<Partial<Node>>(() => ({
  accessibility: 1,
  parent_id: ['root', 'shared'].includes(defaultParent.value || '') ? undefined : defaultParent.value,
  role: 3,
}));

function save(doc: Node) {
  store
    .post(doc)
    .then(d => {
      notifications.add({ title: 'Document successfully posted', type: 'success' });
      useRouter().push(`/dashboard/docs/edit/${d.id}`);
    })
    .catch(e => notifications.add({ message: e, title: 'Error', type: 'error' }));
}
const exit = () => useRouter().push('/dashboard');
</script>
