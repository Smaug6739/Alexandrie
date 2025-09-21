<template>
  <MarkdownEditor v-if="document" ref="editor" :doc="document" @save="data => save(data)" @auto-save="data => autoSave(data)" @exit="exit" />
</template>
<script lang="ts" setup>
import type { Node } from '~/stores';
import MarkdownEditor from '~/components/MarkdownEditor/LazyMarkdownEditor.vue';

const store = useNodesStore();
const route = useRoute();

const editor = ref();
const doc_id = route.params.id as string;
const document = ref<Node | undefined>(undefined);
const notifications = useNotifications();

watchEffect(async () => {
  const docFromStore = store.getById(doc_id);
  if (docFromStore?.partial) {
    try {
      document.value = await store.fetch({ id: doc_id });
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  } else document.value = docFromStore;
});

definePageMeta({ breadcrumb: 'Edit' });

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
  useRouter().push(`/dashboard/docs/${doc_id}`);
}
</script>
