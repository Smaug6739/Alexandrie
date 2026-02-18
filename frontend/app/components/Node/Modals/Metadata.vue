<!-- This components is a modal for advanced editing document metadata -->
<template>
  <div class="modal-content">
    <h2>{{ t('nodes.modals.metadata.title') }}</h2>
    <form @submit.prevent>
      <template v-if="node.role == 1 || node.role == 2">
        <label for="category">{{ t('common.labels.name') }}</label>
        <input id="category" v-model="node.name" />
        <label>{{ t('common.labels.role') }}</label>
        <AppRadio v-model="node.role" :items="CATEGORY_ROLES" />
      </template>

      <template v-if="node.role == 3">
        <label for="category">{{ t('settings.documents.theme') }}</label>
        <AppSelect v-model="node.theme" :items="DOCUMENT_THEMES" :placeholder="t('settings.documents.theme')" />
      </template>

      <label for="icon">{{ t('nodes.modals.metadata.emojiOrIcon') }} <AppHint :text="t('nodes.modals.metadata.emojiOrIconHint')" /></label>
      <textarea id="icon" v-model="node.icon"></textarea>
      <template v-if="node.role == 3">
        <label for="thumbnail">{{ t('nodes.modals.metadata.thumbnail') }} <AppHint :text="t('nodes.modals.metadata.thumbnailHint')" /></label>
        <textarea id="thumbnail" v-model="node.thumbnail"></textarea>
        <div class="inline-input">
          <label for="pinned">{{ t('common.labels.pinned') }}</label>
          <AppToggle id="pinned" v-model="pinnedToggle" />
        </div>
      </template>
      <label for="parent">{{ t('common.labels.parent') }}</label>
      <AppSelect
        v-model="node.parent_id"
        :items="parentsTree"
        :placeholder="t('common.labels.parent')"
        nullable
        :disabled="i => i.id == node.id || nodeStore.isDescendant(node, i.id as string)"
      />
      <div class="inline-input">
        <label for="accessibility">{{ t('common.labels.color') }}</label>
        <AppColorPicker v-model="node.color" nullable />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { DOCUMENT_THEMES, CATEGORY_ROLES } from '~/helpers/constants';
import type { Node } from '~/stores';

const props = defineProps<{ doc: Node }>();
const { t } = useI18nT();

const nodeStore = useNodesStore();
const nodesTree = useNodesTree();

const node = ref<Node>(props.doc);
const pinnedToggle = ref(node.value.order == -1);
const parentsTree = nodesTree.treeUpToRole(node.value.role);

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

.inline-input {
  display: flex;
  align-items: center;
  gap: 10px;
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
