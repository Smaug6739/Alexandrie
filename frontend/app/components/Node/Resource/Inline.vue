<template>
  <NuxtLink class="file-card" :to="`/dashboard/cdn/${node.id}/preview`">
    <img v-if="preview" :src="preview" :alt="node.name" class="file-preview" />
    <Icon v-else :name="resolveFileIcon(node.metadata?.filetype || 'file')" display="xl" />
    <div class="file-info">
      <span class="file-name">{{ node.name }}</span>
      <span class="file-size">{{ readableFileSize(node.size ?? 0) }}</span>
    </div>

    <button v-if="editable" class="btn-icon file-edit" @click.prevent="openDrawioEditor">
      <Icon name="edit" />
    </button>
    <button class="btn-icon file-remove" @click.prevent="openDeleteModal">
      <Icon name="close" />
    </button>
  </NuxtLink>
</template>

<script setup lang="ts">
import NodeDeleteModal from '../Modals/Delete.vue';
import DrawioEditorModal from '../Modals/DrawioEditor.vue';
import { isImageFile, readableFileSize, resolveFileIcon, resolvePreviewUrl } from '~/helpers/resources';
import type { Node } from '~/stores';

const props = defineProps<{
  node: Node;
}>();

const modal = useModal();

const editable = computed(() => props.node.metadata?.drawio);

const preview = ref<string | null>(null);

if (isImageFile(props.node.metadata?.filetype)) preview.value = resolvePreviewUrl(props.node);

const openDeleteModal = () => {
  modal.add(new Modal(shallowRef(NodeDeleteModal), { size: 'small', props: { node: props.node, redirect: '/dashboard' } }));
};

function openDrawioEditor() {
  modal.add(
    new Modal(shallowRef(DrawioEditorModal), {
      props: {
        node: props.node,
      },
      size: 'large',
      noPadding: true,
    }),
  );
}
</script>

<style scoped lang="scss">
.file-card {
  display: flex;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background-color: var(--surface-base);
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background-color: var(--surface-raised);
  }
}

.file-preview {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.file-info {
  min-width: 0;
  flex: 1;

  .file-name {
    display: block;
    font-weight: 500;
    color: var(--text-body);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .file-size {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
}
</style>
