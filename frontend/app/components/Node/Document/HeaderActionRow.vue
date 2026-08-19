<template>
  <AppBtnIcon v-if="isPublic" nav icon="link" :tooltip="t('nodes.actions.copyPublicLink')" @click="copyPublicLink" />
  <AppBtnIcon v-if="isPublic" nav icon="qr_code" :tooltip="t('nodes.actions.qrCode')" @click="openQrModal" />
  <AppBtnIcon v-if="isPublic" nav icon="share" :tooltip="t('nodes.actions.share')" @click="share" />
  <AppBtnIcon v-if="doc.accessibility == 3 && !isPublic" nav icon="link" :tooltip="t('nodes.actions.publicLink')" :to="`/doc/${doc.id}`" :blank="true" />
  <AppBtnIcon
    v-if="nodesPermissionsStore.hasPermissions(doc, 2)"
    nav
    icon="edit"
    :tooltip="t('common.actions.edit')"
    :to="isPublic ? `/doc/${doc.id}/edit` : `/dashboard/docs/edit/${doc.id}`"
  />
  <AppBtnIcon nav icon="markdown" :tooltip="t('nodes.actions.exportAsMarkdown')" @click="exportMarkdown" />
  <AppBtnIcon nav icon="print" :tooltip="t('common.actions.print')" @click="print" />
  <AppBtnIcon v-if="doc.shared" nav icon="group_off" :tooltip="t('nodes.actions.removeFromShared')" @click="openRemoveShareModal" />
  <AppBtnIcon v-if="nodesPermissionsStore.hasPermissions(doc, 2)" nav icon="settings" :tooltip="t('nodes.actions.editMeta')" @click="openEditModal" />
  <AppBtnIcon
    v-if="nodesPermissionsStore.hasPermissions(doc, 4)"
    nav
    icon="manage_access"
    :tooltip="t('nodes.actions.managePermissions')"
    @click="openPermissionsModal"
  />
  <AppBtnIcon v-if="nodesPermissionsStore.hasPermissions(doc, 3)" nav icon="delete" :tooltip="t('common.actions.delete')" @click="openDeleteModal" />
</template>

<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import DocumentMeta from '~/components/Node/Modals/Metadata.vue';
import NodePermissions from '~/components/Node/Modals/Permissions.vue';
import QrCodeModal from '~/components/Node/Modals/QrCode.vue';
import RemoveSharedNode from '~/components/Node/Modals/RemoveShared.vue';
import { generateMarkdownWithMetadata } from '~/helpers/node';
import type { Node } from '~/stores';

const props = defineProps<{ doc: Node; isPublic?: boolean }>();

const nodesPermissionsStore = useNodesPermissionsStore();

const { t } = useI18nT();
const modals = useModal();
const notifications = useNotifications();
const requestUrl = useRequestURL();

const publicUrl = computed(() => `${requestUrl.origin}/doc/${props.doc.id}`);

// Actions
const copyPublicLink = async () => {
  try {
    await navigator.clipboard.writeText(publicUrl.value);
    notifications.add({ type: 'success', title: t('nodes.notifications.linkCopied') });
  } catch (e) {
    notifications.add({ type: 'error', title: t('common.errors.generic'), message: e as string });
  }
};
const openQrModal = () =>
  modals.add(new Modal(shallowRef(QrCodeModal), { props: { url: publicUrl.value, name: props.doc.name }, size: 'small' }));
const share = async () => {
  // Not every browser exposes the Web Share API (and it needs a secure context): fall back to copying the link.
  if (!navigator.share) return copyPublicLink();
  try {
    await navigator.share({ title: props.doc.name, text: props.doc.description, url: publicUrl.value });
  } catch {
    // The user dismissed the share sheet, nothing to report.
  }
};
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

<style scoped lang="scss">
@media print {
  button {
    display: none !important;
  }
}
</style>
