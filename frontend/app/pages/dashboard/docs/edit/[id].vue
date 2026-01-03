<template>
  <MarkdownEditor v-if="node" :doc="node" @save="data => save(data)" @auto-save="autoSave" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Edit' });

const store = useNodesStore();
const route = useRoute();

const nodeId = route.params.id as string;
const node = ref<Node | undefined>(undefined);
const notifications = useNotifications();

watchEffect(async () => {
  const docFromStore = store.getById(nodeId);
  if (docFromStore?.partial) {
    try {
      node.value = await store.fetch({ id: nodeId });
    } catch (error) {
      console.error('Error fetching node:', error);
    }
  } else node.value = docFromStore;
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

function exit() {
  useRouter().push(`/dashboard/docs/${nodeId}`);
}
</script>
