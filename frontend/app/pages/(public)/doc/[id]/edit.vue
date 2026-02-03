<template>
  <LazyMarkdownEditor v-if="document && !error" :doc="document" @save="data => save(data)" @auto-save="data => autoSave(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Edit' });

const store = useNodesStore();

const route = useRoute();
const notifications = useNotifications();

const nodeId = route.params.id as string;
const document = ref<Node | undefined>(undefined);
const error: Ref<string> = ref('');

watchEffect(async () => {
  const storedNode = store.getById(nodeId);
  if (!storedNode) {
    try {
      const result = await store.fetchPublic(nodeId);
      document.value = result?.node;
    } catch {
      error.value = 'Document not found';
    }
  } else if (storedNode?.partial) {
    try {
      document.value = await store.fetch({ id: nodeId });
    } catch {
      error.value = 'Document not found';
    }
  } else document.value = storedNode;
});

function save(doc: Node) {
  store
    .update(doc)
    .then(() => notifications.add({ type: 'success', title: 'Document successfully updated' }))
    .catch(e => notifications.add({ type: 'error', title: 'Error', message: e }));
}

function autoSave(doc: Node) {
  store.update(doc);
}

const exit = () => useRouter().push(`/doc/${nodeId}`);
</script>
