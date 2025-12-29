<template>
  <div
    class="dropzone"
    :class="{ 'drag-over': isDragOver, 'has-files': selectedFiles.length }"
    @dragover.prevent
    @drop.prevent="handleFileDrop"
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
    @paste.prevent="handlePaste"
  >
    <input ref="fileInput" type="file" :multiple="multiple" @change="handleFileSelect" />

    <div v-if="selectedFiles.length" class="files-container">
      <div class="files-list">
        <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
          <div class="file-icon">
            <Icon :name="getFileIcon(file.type)" size="20px" />
          </div>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-meta">{{ readableFileSize(file.size) }} • {{ getFileType(file.type) }}</span>
          </div>
          <button class="remove-btn" title="Remove file" @click.stop="removeFile(index)">
            <Icon name="close" size="16px" />
          </button>
        </div>
      </div>
      <div class="files-footer">
        <span class="total-info">{{ selectedFiles.length }} file{{ selectedFiles.length > 1 ? 's' : '' }} • {{ readableFileSize(totalSize) }}</span>
        <span class="clickable" @click="triggerFileSelect">+ Add more</span>
      </div>
    </div>

    <div v-else class="empty-state">
      <Icon name="layers" size="40px" />
      <p v-if="multiple">Drop files here or <span class="clickable" @click="triggerFileSelect">click to select</span></p>
      <p v-else>Drop file here or <span class="clickable" @click="triggerFileSelect">click to select</span></p>
      <span v-if="multiple" class="hint">Maximum {{ maxFiles }} files</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { readableFileSize } from '~/helpers/ressources';

const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    maxFiles?: number;
  }>(),
  {
    multiple: false,
    maxFiles: 10,
  },
);

const selectedFiles = ref<File[]>([]);
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const totalSize = computed(() => selectedFiles.value.reduce((acc, file) => acc + file.size, 0));

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'music';
  if (mimeType.includes('pdf')) return 'file-pdf';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'file-zip';
  return 'file';
};

const getFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'Image';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('audio/')) return 'Audio';
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
  return 'File';
};

const emit = defineEmits<{
  select: [files: File | File[] | null];
}>();

const triggerFileSelect = () => fileInput.value!.click();

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement | null)?.files;
  if (!files) return;

  if (props.multiple) {
    const fileArray = Array.from(files).slice(0, props.maxFiles);
    selectedFiles.value = fileArray;
    emit('select', fileArray);
  } else {
    selectedFiles.value = files[0] ? [files[0]] : [];
    emit('select', files[0] || null);
  }
};

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const files = event.dataTransfer.files;
    if (props.multiple) {
      const fileArray = Array.from(files).slice(0, props.maxFiles);
      selectedFiles.value = fileArray;
      emit('select', fileArray);
    } else {
      const file = files[0];
      if (file) {
        selectedFiles.value = [file];
        emit('select', file);
      }
    }
    isDragOver.value = false;
  }
};

const dragEnter = () => (isDragOver.value = true);
const dragLeave = () => (isDragOver.value = false);

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
  if (props.multiple) {
    emit('select', selectedFiles.value.length ? selectedFiles.value : null);
  } else {
    emit('select', null);
  }
};

const reset = () => {
  selectedFiles.value = [];
  if (fileInput.value) fileInput.value.value = '';
};

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  const pastedFiles: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item?.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        pastedFiles.push(file);
        if (!props.multiple) break;
      }
    }
  }

  if (pastedFiles.length) {
    if (props.multiple) {
      const limitedFiles = pastedFiles.slice(0, props.maxFiles);
      selectedFiles.value = limitedFiles;
      emit('select', limitedFiles);
    } else {
      selectedFiles.value = [pastedFiles[0]];
      emit('select', pastedFiles[0]);
    }
  }
};

defineExpose({ reset });
</script>

<style scoped lang="scss">
.dropzone {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 150px;
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  color: var(--font-color-light);
  background-color: var(--dropzone-bg, transparent);
  transition: all 0.2s ease;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  &:hover {
    border-color: var(--border-color-hover, var(--border-color));
    background-color: var(--bg-contrast);
  }

  &.has-files {
    padding: 12px;
    align-items: stretch;
  }

  input[type='file'] {
    display: none;
  }
}

.drag-over {
  border-color: var(--primary);
  background-color: var(--bg-contrast);
}

.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
  }

  .hint {
    font-size: 12px;
    color: var(--font-color-lighter, var(--font-color-light));
  }
}

.files-container {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

.files-list {
  display: flex;
  max-height: 200px;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color-secondary);
  transition: all 0.15s ease;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: var(--border-color-hover, var(--border-color));
    background: var(--bg-contrast);

    .remove-btn {
      opacity: 1;
    }
  }
}

.file-icon {
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  color: var(--primary);
  background: var(--bg-ui);
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
}

.file-details {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--font-color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  font-size: 12px;
  color: var(--font-color-light);
}

.remove-btn {
  display: flex;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  color: var(--font-color-light);
  background: transparent;
  opacity: 0.6;
  transition: all 0.15s ease;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;

  &:hover {
    color: var(--danger, #e74c3c);
    background: var(--bg-ui);
    opacity: 1;
  }
}

.files-footer {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border-color);
  justify-content: space-between;
  padding-top: 8px;
}

.total-info {
  font-size: 13px;
  font-weight: 500;
  color: var(--font-color-dark);
}

.clickable {
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
