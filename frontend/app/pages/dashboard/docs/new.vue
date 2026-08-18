<template>
  <LazyMarkdownEditor v-model="document" @save="data => save(data)" @exit="exit" @auto-save="savePending" />
</template>
<script lang="ts" setup>
import localForage from 'localforage';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'common.actions.new' } });

const store = useNodesStore();

const notifications = useNotifications();
const route = useRoute();
const router = useRouter();
const sidebar = useSidebar();

const pendingNode = await localForage.getItem<Node>('pendingNode');

let saved = false;

const defaultParent = computed(() => (route.query.parent_id as string) || sidebar.workspaceId.value || undefined);
const document = computed<Partial<Node>>(() => {
  return {
    accessibility: 1,
    role: 3,
    ...pendingNode,
    parent_id: ['root', 'shared'].includes(defaultParent.value || '') ? undefined : defaultParent.value,
  };
});

function save(doc: Partial<Node>) {
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

function savePending(node: Partial<Node>) {
  if (saved) return;
  localForage.setItem('pendingNode', toRaw(node));
}

const exit = () => router.push('/dashboard');
</script>
