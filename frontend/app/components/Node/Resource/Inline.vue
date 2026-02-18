<template>
  <div class="file-card">
    <img v-if="preview" :src="preview" :alt="file.name" class="file-preview" />
    <Icon v-else :name="resolveFileIcon(file.type)" display="lg" />
    <div class="file-info">
      <span class="file-name">{{ file.name }}</span>
      <span class="file-size">{{ readableFileSize(file.size) }}</span>
    </div>
    <button class="file-remove" @click="removeFile">
      <Icon name="close" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { readableFileSize, resolveFileIcon } from '~/helpers/resources';


const props = defineProps<{
  file: File;
  removeFile: () => void;
}>();

const preview = ref<string | null>(null);

onMounted(async () => {
  if (props.file.type.startsWith('image/')) {
    preview.value = URL.createObjectURL(props.file);
  }
});

onBeforeUnmount(() => {
  if (preview.value) URL.revokeObjectURL(preview.value);
});

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

  .file-remove {
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    color: var(--text-muted);
    cursor: pointer;

    &:hover {
      background: var(--bg-tertiary);
      color: var(--red);
    }
  }
}
</style>
