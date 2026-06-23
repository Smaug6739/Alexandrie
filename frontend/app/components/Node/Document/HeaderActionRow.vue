<template>
  <div>
    <Teleport to="#navbar-actions">
      <AppBtnIcon nav v-if="doc.accessibility == 3 && !isPublic" icon="link" :tooltip="t('nodes.actions.publicLink')" :to="`/doc/${doc.id}`" :blank="true" />
      <AppBtnIcon
        nav
        v-if="nodeStore.hasPermissions(doc, 2)"
        icon="edit"
        :tooltip="t('common.actions.edit')"
        :to="isPublic ? `/doc/${doc.id}/edit` : `/dashboard/docs/edit/${doc.id}`"
      />
      <AppBtnIcon nav icon="markdown" :tooltip="t('nodes.actions.exportAsMarkdown')" @click="exportMarkdown" />
      <AppBtnIcon nav icon="print" :tooltip="t('common.actions.print')" @click="print" />
      <AppBtnIcon nav v-if="doc.shared" icon="group_off" :tooltip="t('nodes.actions.removeFromShared')" @click="openRemoveShareModal" />
      <AppBtnIcon nav v-if="nodeStore.hasPermissions(doc, 2)" icon="settings" :tooltip="t('nodes.actions.editMeta')" @click="openEditModal" />
      <AppBtnIcon
        nav
        v-if="nodeStore.hasPermissions(doc, 4)"
        icon="manage_access"
        :tooltip="t('nodes.actions.managePermissions')"
        @click="openPermissionsModal"
      />
      <AppBtnIcon nav v-if="nodeStore.hasPermissions(doc, 3)" icon="delete" :tooltip="t('common.actions.delete')" @click="openDeleteModal" />
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
