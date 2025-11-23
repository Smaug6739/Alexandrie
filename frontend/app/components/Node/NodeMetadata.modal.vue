<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal-content">
    <h2>Metadata</h2>
    <form @submit.prevent>
      <template v-if="node.role == 1 || node.role == 2">
        <label for="category">Name</label>
        <input id="category" v-model="node.name" />
        <label>Role</label>
        <AppRadio v-model="node.role" :items="CATEGORY_ROLES" />
      </template>

      <template v-if="node.role == 3">
        <label for="category">Theme</label>
        <AppSelect v-model="node.theme" :items="DOCUMENT_THEMES" placeholder="Select theme" />
      </template>

      <label for="icon">Emoji or icon <AppHint text="SVG or emojis supported" /></label>
      <textarea id="icon" v-model="node.icon"></textarea>
      <template v-if="node.role == 3">
        <label for="thumbnail">Thumbnail <AppHint text="SVG supported" /></label>
        <textarea id="thumbnail" v-model="node.thumbnail"></textarea>
        <div style="display: flex; align-items: center; gap: 10px">
          <label for="pinned">Pinned</label>
          <AppToggle id="pinned" v-model="pinnedToggle" />
        </div>
      </template>
      <label for="parent">Parent</label>
      <AppSelect
        v-model="node.parent_id"
        :items="parentsTree"
        placeholder="Select a parent"
        :nullable="true"
        :disabled="(i) => i.id == node.id || nodeStore.isDescendant(node, (i as Item).id)"
      />
      <div style="display: flex; align-items: center; gap: 10px">
        <label for="accessibility">Color</label>
        <AppColorPicker v-model="node.color" :nullable="true" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const nodeStore = useNodesStore();

const props = defineProps<{ doc: Node }>();
const node = ref<Node>(props.doc);
const pinnedToggle = ref(node.value.order == -1);
const parentsTree = computed(() => new TreeStructure(useSidebarTree().nodes.value.filter(n => n.data.role <= node.value.role)).generateTree());

watch(pinnedToggle, val => (node.value.order = val ? -1 : 0));
watch(
  node.value,
  debounce(() => nodeStore.update(node.value), 500),
);
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
}

form {
  padding: 0 5px 25px;
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
  font-size: 14px;
  resize: none;
}
</style>
