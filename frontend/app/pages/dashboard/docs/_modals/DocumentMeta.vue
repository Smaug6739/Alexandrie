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
      <!-- Accessibility 3: Public document -->
      <div v-if="document.accessibility === 3" class="public-info">
        <p class="info-text">This document will be publicly accessible via a unique URL.</p>
        <p class="info-text">
          Share this link to allow anyone to view the document without needing an account:
          <br />
          <a :href="link" target="_blank" rel="noopener noreferrer" class="public-link"
            ><Icon name="new_tab" :small="true" fill="var(--font-color-light)" /><span>{{ link }}</span></a
          >
        </p>
      </div>
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
const link = computed(() => `${window.location.origin}/doc/${document.value.id}`);
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

textarea {
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  resize: none;
  font-size: 14px;
}

.public-info {
  border-radius: 7px;
  padding: 0 5px;
  margin-bottom: 10px;
}
.info-text {
  font-size: 14px;
  color: var(--font-color-light);
  margin: 5px 0;
}
.public-link {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  word-break: break-all;
  color: var(--primary);
  text-decoration: underline;
}
</style>
