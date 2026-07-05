<template>
  <LazyMarkdownEditor :doc="document" @save="data => save(data)" @exit="exit" @auto-save="savePending" />
</template>
<script lang="ts" setup>
import localForage from 'localforage';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'common.actions.new' } });

interface NewDocumentQuery {
  parent_id?: string;
}

const store = useNodesStore();

const notifications = useNotifications();
const route = useRoute();
const router = useRouter();
const sidebar = useSidebar();

const pendingNode = await localForage.getItem<Node>('pendingNode');

let saved = false;

const routeQuery = computed<NewDocumentQuery>(() => route.query);
const defaultParent = computed(() => routeQuery.value.parent_id || sidebar.workspaceId.value || undefined);
const document = computed<Partial<Node>>(() => ({
  accessibility: 1,
  parent_id: ['root', 'shared'].includes(defaultParent.value || '') ? undefined : defaultParent.value,
  role: 3,
  ...pendingNode,
}));

function save(doc: Node) {
  store
    .post(doc)
    .then(async d => {
      notifications.add({ title: 'Document successfully posted', type: 'success' });
      await localForage.removeItem('pendingNode');
      saved = true;
      router.push(`/dashboard/docs/edit/${d.id}`);
    })
    .catch(e => notifications.add({ message: e, title: 'Error', type: 'error' }));
}

function savePending(node: Node) {
  if (saved) return;
  localForage.setItem('pendingNode', toRaw(node));
}

const exit = () => router.push('/dashboard');
</script>
