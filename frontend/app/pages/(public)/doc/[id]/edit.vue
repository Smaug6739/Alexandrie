<template>
  <MarkdownEditor v-if="document && !error" ref="editor" :doc="document" @save="data => save(data)" @auto-save="data => autoSave(data)" @exit="exit" />
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
const error: Ref<string> = ref('');

watchEffect(async () => {
  const docFromStore = store.getById(doc_id);
  if (!docFromStore) {
    try {
      document.value = await store.fetchPublic(doc_id);
      console.log(document.value);
    } catch {
      error.value = 'Document not found';
    }
  } else if (docFromStore?.partial) {
    try {
      document.value = await store.fetch({ id: doc_id });
      console.log(document.value);
    } catch {
      error.value = 'Document not found';
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

const exit = () => useRouter().push(`/doc/${doc_id}`);
</script>
