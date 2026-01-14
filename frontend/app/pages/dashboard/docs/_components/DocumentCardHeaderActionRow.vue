<template>
  <span class="row">
    <NuxtLink v-if="doc.accessibility == 3" :to="`/doc/${doc.id}`" :prefetch="false" target="_blank">
      <Icon name="link" display="lg" />
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 2)" :to="`/dashboard/docs/edit/${doc.id}`" :prefetch="false">
      <Icon name="edit" display="lg" />
      <p class="hint-tooltip">Edit</p>
    </NuxtLink>
    <NuxtLink @click="exportMarkdown">
      <Icon name="markdown" display="lg" />
      <p class="hint-tooltip">Export as Markdown</p>
    </NuxtLink>
    <NuxtLink @click="print">
      <Icon name="print" display="lg" />
      <p class="hint-tooltip">Print</p>
    </NuxtLink>
    <NuxtLink v-if="doc.shared" @click="openRemoveShareModal">
      <Icon name="group_off" display="lg" />
      <p class="hint-tooltip">Remove from shared</p>
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 2)" @click="openEditModal">
      <Icon name="settings" display="lg" />
      <p class="hint-tooltip">Edit metadata</p>
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 4)" @click="openPermissionsModal">
      <Icon name="manage_access" display="lg" />
      <p class="hint-tooltip">Manage permissions</p>
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 3)" @click="openDeleteModal">
      <Icon name="delete" display="lg" />
      <p class="hint-tooltip">Delete</p>
    </NuxtLink>
  </span>
</template>

<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/DeleteNodeModal.vue';
import DocumentMeta from '~/components/Node/NodeMetadata.modal.vue';
import NodePermissions from '~/components/Node/NodePermissions.modal.vue';
import RemoveSharedNode from '~/components/Node/RemoveSharedNode.modal.vue';
import type { Node } from '~/stores';

const props = defineProps<{ doc: Node }>();

const nodeStore = useNodesStore();
const router = useRouter();

const print = () => window.print();
const openDeleteModal = () =>
  useModal().add(
    new Modal(shallowRef(DeleteNodeModal), {
      props: { node: props.doc },
      size: 'small',
      onClose: r => {
        if (r === 'success') router.push('/dashboard');
      },
    }),
  );
const openEditModal = () => useModal().add(new Modal(shallowRef(DocumentMeta), { props: { doc: props.doc }, size: 'small' }));
const openPermissionsModal = () => useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: props.doc }, size: 'small' }));
const openRemoveShareModal = () => useModal().add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.doc.id }, size: 'small' }));

function exportMarkdown() {
  const blob = new Blob([props.doc.content || ''], { type: 'text/markdown' });
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
.row {
  display: flex;
  margin: 0 0.5rem 6px 0;
}

a {
  position: relative;
  margin: 0 5px;
  &:hover .hint-tooltip {
    opacity: 1;
    visibility: visible;
  }
}
</style>
