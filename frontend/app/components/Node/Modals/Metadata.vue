<template>
  <div class="modal-content">
    <h2><Icon :name="node.icon || 'files'" display="xl" :class="['parent-icon', getAppAccent(node.color as number, true)]" /> {{ node.name }}</h2>
    <form @submit.prevent>
      <section>
        <span class="sec-title">{{ t('nodes.modals.metadata.labelOrganization') }}</span>
        <template v-if="node.role == 1 || node.role == 2">
          <label for="category">{{ t('common.labels.name') }}</label>
          <input id="category" v-model="node.name" />
          <label>{{ t('common.labels.role') }}</label>
          <AppRadio v-model="node.role" :items="CATEGORY_ROLES" />
        </template>

        <label for="parent">{{ t('common.labels.parent') }}</label>
        <AppSelect
          v-model="node.parent_id"
          :items="parentsTree"
          :placeholder="t('common.labels.parent')"
          nullable
          :disabled="i => i.id == node.id || nodeStore.isDescendant(node, i.id as string)"
        />

        <div class="setting-row">
          <div class="setting-info">
            <label for="pinned">{{ t('common.labels.pinned') }}</label>
            <span class="setting-description">{{ t('nodes.modals.metadata.pinDescription') }}</span>
          </div>
          <AppToggle id="pinned" v-model="pinnedToggle" />
        </div>
      </section>

      <section>
        <span class="sec-title">{{ t('nodes.modals.metadata.labelAppearance') }}</span>
        <template v-if="node.role == 3">
          <label for="category">{{ t('settings.documents.theme') }}</label>
          <AppSelect v-model="node.theme" :items="DOCUMENT_THEMES" :placeholder="t('settings.documents.theme')" />
        </template>
        <div class="setting-row">
          <label for="accessibility">{{ t('common.labels.color') }}</label>
          <AppColorPicker v-model="node.color" nullable />
        </div>
      </section>

      <section>
        <span class="sec-title">{{ t('nodes.modals.metadata.labelMedia') }}</span>
        <label for="icon">{{ t('nodes.modals.metadata.emojiOrIcon') }} <AppHint :text="t('nodes.modals.metadata.emojiOrIconHint')" /></label>
        <textarea id="icon" v-model="node.icon"></textarea>
        <label for="thumbnail">{{ t('nodes.modals.metadata.thumbnail') }} <AppHint :text="t('nodes.modals.metadata.thumbnailHint')" /></label>
        <textarea id="thumbnail" v-model="node.thumbnail"></textarea>
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import { DOCUMENT_THEMES, CATEGORY_ROLES } from '~/helpers/constants';
import type { Node } from '~/stores';

const props = defineProps<{ doc: Node }>();

const nodeStore = useNodesStore();
const nodesTree = useNodesTree();

const { t } = useI18nT();
const { getAppAccent } = useAppColors();

const node = ref<Node>({ ...props.doc });
const pinnedToggle = ref(node.value.order == -1);
const parentsTree = nodesTree.getTreeUpToRole(node.value.role);

onBeforeMount(async () => {
  const latestNode = await nodeStore.fetch({ id: node.value.id });
  if (latestNode) node.value = { ...latestNode }; // CLONE
});

watch(pinnedToggle, val => (node.value.order = val ? -1 : 0));
watch(
  node,
  debounce(async val => {
    await nodeStore.update({ ...(val as Node) }); // clone → avoid mutating the original object which is still used in the parent component
  }, 500),
  { deep: true },
);
</script>

<style scoped lang="scss">
.modal-content {
  display: flex;
  flex-direction: column;
  font-family: $font-ui;
}

h2 {
  display: flex;
}

form {
  flex: 1;
  padding-bottom: 10px;
  overflow-y: auto;
}

label {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

textarea {
  height: 50px;
  min-height: 50px;
  max-height: 50px;
  font-size: 14px;
  resize: none;
}
</style>
