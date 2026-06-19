<template>
  <div>
    <Teleport to="#navbar-actions">
      <AppBtnIcon
        v-if="doc.accessibility == 3 && !isPublic"
        icon="link"
        :aria-label="t('nodes.actions.publicLink')"
        :tooltip="t('nodes.actions.publicLink')"
        :to="`/doc/${doc.id}`"
        :blank="true"
      />
      <AppBtnIcon
        v-if="nodeStore.hasPermissions(doc, 2)"
        icon="edit"
        :aria-label="t('common.actions.edit')"
        :tooltip="t('common.actions.edit')"
        :to="isPublic ? `/doc/${doc.id}/edit` : `/dashboard/docs/edit/${doc.id}`"
      />
      <AppBtnIcon icon="markdown" :aria-label="t('nodes.actions.exportAsMarkdown')" :tooltip="t('nodes.actions.exportAsMarkdown')" @click="exportMarkdown" />
      <AppBtnIcon icon="print" :aria-label="t('common.actions.print')" :tooltip="t('common.actions.print')" @click="print" />
      <AppBtnIcon
        v-if="doc.shared"
        icon="group_off"
        :aria-label="t('nodes.actions.removeFromShared')"
        :tooltip="t('nodes.actions.removeFromShared')"
        @click="openRemoveShareModal"
      />
      <AppBtnIcon
        v-if="nodeStore.hasPermissions(doc, 2)"
        icon="settings"
        :aria-label="t('nodes.actions.editMeta')"
        :tooltip="t('nodes.actions.editMeta')"
        @click="openEditModal"
      />
      <AppBtnIcon
        v-if="nodeStore.hasPermissions(doc, 4)"
        icon="manage_access"
        :aria-label="t('nodes.actions.managePermissions')"
        :tooltip="t('nodes.actions.managePermissions')"
        @click="openPermissionsModal"
      />
      <AppBtnIcon
        v-if="nodeStore.hasPermissions(doc, 3)"
        icon="delete"
        :aria-label="t('common.actions.delete')"
        :tooltip="t('common.actions.delete')"
        @click="openDeleteModal"
      />
    </Teleport>
  </div>
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
const modals = useModal();

// Actions
const print = () => window.print();
const openDeleteModal = () =>
  modals.add(
    new Modal(shallowRef(DeleteNodeModal), {
      props: { node: props.doc, redirectTo: '/dashboard' },
      size: 'small',
    }),
  );
const openEditModal = () => modals.add(new Modal(shallowRef(DocumentMeta), { props: { doc: props.doc }, size: 'small' }));
const openPermissionsModal = () => modals.add(new Modal(shallowRef(NodePermissions), { props: { node: props.doc }, size: 'small' }));
const openRemoveShareModal = () => modals.add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.doc.id }, size: 'small' }));

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
