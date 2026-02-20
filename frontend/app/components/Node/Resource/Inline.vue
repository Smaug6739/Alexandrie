<template>
  <NuxtLink class="file-card" :to="`/dashboard/cdn/${node.id}/preview`">
    <img v-if="preview" :src="preview" :alt="node.name" class="file-preview" />
    <Icon v-else :name="resolveFileIcon(node.metadata?.filetype || 'file')" display="xl" />
    <div class="file-info">
      <span class="file-name">{{ node.name }}</span>
      <span class="file-size">{{ readableFileSize(node.size ?? 0) }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { isImageFile, readableFileSize, resolveFileIcon, resolvePreviewUrl } from '~/helpers/resources';
import type { Node } from '~/stores';

const props = defineProps<{ node: Node }>();

const preview = ref<string | null>(null);

if (isImageFile(props.node.metadata?.filetype)) preview.value = resolvePreviewUrl(props.node);
</script>

<style scoped lang="scss">
.file-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background-color: var(--surface-base);
  width: 100%;
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
  flex: 1;
  min-width: 0;

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
