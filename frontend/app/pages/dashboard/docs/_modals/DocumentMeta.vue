<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal-content">
    <h2>Document Metadata <tag yellow>Beta</tag></h2>
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

      <label for="parent">Parent Document</label>
      <AppSelect
        v-model="document.parent_id as string"
        :items="documentsTree"
        :disabled="(i:Item) => i.data?.type !== 'document'"
        placeholder="Select a document parent"
        :nullable="true"
      />
      <div style="display: flex; align-items: center; gap: 10px">
        <label for="accessibility">Color</label>
        <AppColorPicker v-model="document.color" :nullable="true" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '@/stores';

const store = useDocumentsStore();

const props = defineProps<{ doc: Document }>();
const document = ref<Document>(props.doc);
const pinnedToggle = ref(!!document.value.pinned);

const documentsTree = computed(() => useSidebarTree().groupedByWorkspace());

watch(pinnedToggle, val => (document.value.pinned = val ? 1 : 0));
watch(
  document.value,
  debounce(() => store.update(document.value), 500),
);
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}
form {
  padding: 0px 5px 25px 5px;
  flex: 1;
  overflow-y: auto;
}
label {
  display: flex;
  align-items: center;
}
</style>
