<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal">
    <h2>Document Metadata <tag blue>New</tag></h2>
    <form @submit.prevent>
      <label for="category">Theme</label>
      <AppSelect v-model="document.theme" :items="DOCUMENT_THEMES" placeholder="Select theme" />
      <label for="icon">Icon <AppHint text="SVG or emojis supported" /></label>
      <textarea id="icon" v-model="document.icon"></textarea>
      <label for="thumbnail">Thumbnail <AppHint text="SVG supported" /></label>
      <textarea id="thumbnail" v-model="document.thumbnail"></textarea>
      <label for="accessibility">Accessibility</label>
      <AppRadio v-model="document.accessibility" :items="DOCUMENT_ACCESSIBILITIES" placeholder="Accessibility" />
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

      <div style="display: flex; align-items: center; gap: 10px">
        <label for="accessibility">Color</label>
        <AppColorPicker v-model="document.color" :nullable="true" />
      </div>
      <hr />
      <div style="display: flex; justify-content: flex-end; gap: 5px">
        <AppButton type="secondary" @click="close">Cancel</AppButton>
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

const close = () => emit('close');
watch(pinnedToggle, val => (document.value.pinned = val ? 1 : 0));

function save() {
  store
    .update(document.value)
    .then(() => emit('close'))
    .catch(e => notifications.add({ type: 'error', title: 'Error', message: e }));
}
</script>

<style scoped>
.modal {
  padding: 0 6px;
}

label {
  display: flex;
  align-items: center;
}
</style>
