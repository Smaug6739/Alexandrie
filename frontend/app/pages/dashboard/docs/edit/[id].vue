<template>
  <LazyMarkdownEditor v-if="node" :doc="node" @save="data => save(data)" @auto-save="autoSave" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: {i18n: 'common.actions.edit'} });

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
    .then(() => notifications.add({ title: 'Document successfully updated', type: 'success' }))
    .catch(e => notifications.add({ message: e, title: 'Error', type: 'error' }));
}

function autoSave(doc: Node) {
  store.update(doc);
}

function exit() {
  useRouter().push(`/dashboard/docs/${nodeId}`);
}
</script>
