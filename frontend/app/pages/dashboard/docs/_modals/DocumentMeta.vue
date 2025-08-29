<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal">
    <h2>Document Metadata <tag blue>New</tag></h2>
    <form @submit.prevent>
      <label for="title">Title</label>
      <input id="title" v-model="document.name" type="text" />

      <label for="description">Description</label>
      <textarea id="description" v-model="document.description"></textarea>
      <label for="accessibility">Accessibility</label>
      <AppRadio v-model="document.accessibility" :items="accessibilities" placeholder="Access" />
      <div style="display: flex; align-items: center; gap: 10px">
        <label for="pinned">Pinned</label>
        <AppToggle id="pinned" v-model="pinnedToggle" />
      </div>

      <label for="category">Category</label>
      <AppSelect v-model="document.category" :items="categories" placeholder="Select category" />
      <label for="parent">Parent Document</label>
      <AppSelect
        v-model="document.parent_id as string"
        :items="documentsTree"
        :disabled="(i) => (i as Item).data?.type !== 'document'"
        placeholder="Select a document parent"
        :nullable="true"
      />

      <hr />
      <div style="display: flex; gap: 5px">
        <AppButton type="secondary" @click="close">Cencel</AppButton>
        <AppButton type="primary" @click="save">Save</AppButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '@/stores';

const store = useDocumentsStore();
const notifications = useNotifications();

const props = defineProps<{ doc: Document }>();
const emit = defineEmits(['close']);
const document = ref<Document>(props.doc);
const pinnedToggle = ref(!!document.value.pinned);

const categories = new TreeStructure(useSidebarTree().categories.value).generateTree().filter(i => i.data.type === 'category' && i.data.role == 2);
const documentsTree = computed(() => useSidebarTree().groupedByWorkspace());

const accessibilities: ANode[] = [
  { id: 1, label: 'Visible', parent_id: '' },
  { id: 2, label: 'Draft', parent_id: '' },
  { id: 3, label: 'Archive', parent_id: '' },
];

const close = () => emit('close');
watch(pinnedToggle, val => (document.value.pinned = val ? 1 : 0));

function save() {
  store
    .update(document.value)
    .then(() => notifications.add({ type: 'success', title: 'Document successfully updated' }))
    .catch(e => notifications.add({ type: 'error', title: 'Error', message: e }));
}
</script>

<style scoped>
.modal {
  padding: 0 6px;
}
</style>
