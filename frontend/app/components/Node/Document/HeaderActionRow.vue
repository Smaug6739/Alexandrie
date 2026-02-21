<template>
  <span class="actions-row">
    <NuxtLink
      v-if="doc.accessibility == 3 && !isPublic"
      class="btn-icon"
      :aria-label="t('nodes.actions.publicLink')"
      :to="`/doc/${doc.id}`"
      :prefetch="false"
      target="_blank"
    >
      <Icon name="link" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.actions.publicLink') }}</p>
    </NuxtLink>
    <NuxtLink
      v-if="nodeStore.hasPermissions(doc, 2)"
      class="btn-icon"
      :aria-label="t('common.actions.edit')"
      :to="isPublic ? `/doc/${doc.id}/edit` : `/dashboard/docs/edit/${doc.id}`"
      :prefetch="false"
    >
      <Icon name="edit" display="lg" />
      <p class="hint-tooltip">{{ t('common.actions.edit') }}</p>
    </NuxtLink>
    <button class="btn-icon" :aria-label="t('nodes.actions.exportAsMarkdown')" @click="exportMarkdown">
      <Icon name="markdown" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.actions.exportAsMarkdown') }}</p>
    </button>
    <button class="btn-icon" :aria-label="t('common.actions.print')" @click="print">
      <Icon name="print" display="lg" />
      <p class="hint-tooltip">{{ t('common.actions.print') }}</p>
    </button>
    <button v-if="doc.shared" class="btn-icon" :aria-label="t('nodes.actions.removeFromShared')" @click="openRemoveShareModal">
      <Icon name="group_off" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.actions.removeFromShared') }}</p>
    </button>
    <button v-if="nodeStore.hasPermissions(doc, 2)" class="btn-icon" :aria-label="t('nodes.actions.editMeta')" @click="openEditModal">
      <Icon name="settings" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.actions.editMeta') }}</p>
    </button>
    <button v-if="nodeStore.hasPermissions(doc, 4)" class="btn-icon" :aria-label="t('nodes.actions.managePermissions')" @click="openPermissionsModal">
      <Icon name="manage_access" display="lg" />
      <p class="hint-tooltip">{{ t('nodes.actions.managePermissions') }}</p>
    </button>
    <button v-if="nodeStore.hasPermissions(doc, 3)" class="btn-icon" :aria-label="t('common.actions.delete')" @click="openDeleteModal">
      <Icon name="delete" display="lg" />
      <p class="hint-tooltip">{{ t('common.actions.delete') }}</p>
    </button>
  </span>
</template>

<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import DocumentMeta from '~/components/Node/Modals/Metadata.vue';
import NodePermissions from '~/components/Node/Modals/Permissions.vue';
import RemoveSharedNode from '~/components/Node/Modals/RemoveShared.vue';
import { generateMarkdownWithMetadata } from '~/helpers/node';
import type { Node } from '~/stores';

const props = defineProps<{ doc: Node; isPublic?: boolean }>();

const nodeStore = useNodesStore();
const { t } = useI18nT();

const print = () => window.print();
const openDeleteModal = () =>
  useModal().add(
    new Modal(shallowRef(DeleteNodeModal), {
      props: { node: props.doc, redirectTo: '/dashboard' },
      size: 'small',
    }),
  );
const openEditModal = () => useModal().add(new Modal(shallowRef(DocumentMeta), { props: { doc: props.doc }, size: 'small' }));
const openPermissionsModal = () => useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: props.doc }, size: 'small' }));
const openRemoveShareModal = () => useModal().add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.doc.id }, size: 'small' }));

function exportMarkdown() {
  const blob = new Blob([generateMarkdownWithMetadata(props.doc)], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${props.doc.name}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
</script>

<style lang="scss" scoped>
.btn-icon {
  position: relative;

  &:hover .hint-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

.actions-row {
  flex-wrap: wrap;
}
</style>
