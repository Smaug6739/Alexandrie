<template>
  <ClientOnly>
    <LazyMarkdownEditor v-if="document && !error" :doc="document" public @save="data => save(data)" @auto-save="data => autoSave(data)" @exit="exit" />
  </ClientOnly>
</template>
<script lang="ts" setup>
import type { Node, PublicNodeResponse } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'common.actions.edit' } });

const store = useNodesStore();

const route = useRoute();
const router = useRouter();
const notifications = useNotifications();

const nodeId = route.params.id as string;
const { data: document, error } = await useAsyncData(`public-doc-e-${route.params.id}`, async (): Promise<Node | undefined> => {
  const documentId = route.params.id;
  if (!documentId || typeof documentId !== 'string') return undefined;

  const request = await makeRequest(`nodes/public/${documentId}`, 'GET', {});
  if (request.status === 'success') {
    const response = request.result as PublicNodeResponse;

    return {
      ...response.node,
      partial: false,
      shared: false,
      permissions: [],
    };
  }
  return undefined;
});
function save(doc: Node) {
  store
    .update(doc)
    .then(() => notifications.add({ title: 'Document successfully updated', type: 'success' }))
    .catch(e => notifications.add({ message: e, title: 'Error', type: 'error' }));
}

function autoSave(doc: Node) {
  store.update(doc);
}

const exit = () => router.push(`/doc/${nodeId}`);
</script>
