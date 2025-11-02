<template>
  <span class="row">
    <NuxtLink v-if="doc.accessibility == 3" :to="`/doc/${doc.id}`" :prefetch="false" target="_blank">
      <Icon name="link" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 2)" :to="`/dashboard/docs/edit/${doc.id}`" :prefetch="false">
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
        <path
          d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
        />
      </svg>
    </NuxtLink>
    <NuxtLink @click="exportMarkdown">
      <Icon name="markdown" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink @click="print">
      <Icon name="print" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="doc.shared" @click="openRemoveShareModal">
      <Icon name="group_off" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 2)" @click="openEditModal">
      <Icon name="settings" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 4)" @click="openPermissionsModal">
      <Icon name="manage_access" :big="true" fill="var(--font-color)" />
    </NuxtLink>
    <NuxtLink v-if="nodeStore.hasPermissions(doc, 3)" @click="openDeleteModal">
      <Icon name="delete" :big="true" fill="var(--font-color)" />
    </NuxtLink>
  </span>
</template>

<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/DeleteNodeModal.vue';
import DocumentMeta from '~/components/Node/NodeMetadata.modal.vue';
import NodePermissions from '~/components/Node/NodePermissions.modal.vue';
import RemoveSharedNode from '~/components/Node/RemoveSharedNode.modal.vue';
import type { Node } from '~/stores';

const nodeStore = useNodesStore();

const props = defineProps<{ doc: Node }>();
const print = () => window.print();
const openDeleteModal = () => useModal().add(new Modal(shallowRef(DeleteNodeModal), { props: { documentId: props.doc.id } }));
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

.row svg {
  cursor: pointer;
}

a {
  margin: 0 5px;
}

.row svg path {
  fill: var(--font-color);
}

button {
  font-size: medium;
  font-weight: 600;
}
</style>
