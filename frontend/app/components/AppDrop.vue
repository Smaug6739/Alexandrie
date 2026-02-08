<template>
  <div
    class="drop"
    :class="{ dragging: isDragOver, 'has-files': selectedFiles.length }"
    @dragover.prevent
    @drop.prevent="handleFileDrop"
    @dragenter.prevent="dragEnter"
    @dragleave.prevent="dragLeave"
    @paste.prevent="handlePaste"
  >
    <input ref="fileInput" type="file" :multiple="multiple" @change="handleFileSelect" />

    <div v-if="selectedFiles.length" class="files">
      <div class="list">
        <div v-for="(file, index) in selectedFiles" :key="index" class="item">
          <div class="icon">
            <Icon :name="resolveFileIcon(file.type)" />
          </div>
          <div class="details">
            <span class="name">{{ file.name }}</span>
            <span class="meta">{{ readableFileSize(file.size) }} • {{ resolveFileType(file.type) }}</span>
          </div>
          <button class="remove" title="Remove file" @click.stop="removeFile(index)">
            <Icon name="close" size="16px" />
          </button>
        </div>
      </div>
      <footer>
        <span class="total">{{ selectedFiles.length }} file{{ selectedFiles.length > 1 ? 's' : '' }} • {{ readableFileSize(totalSize) }}</span>
        <span class="link" @click="triggerFileSelect">+ Add more</span>
      </footer>
    </div>

    <div v-else class="empty">
      <Icon name="layers" size="40px" />
      <p v-if="multiple">Drop files here or <span class="link" @click="triggerFileSelect">click to select</span></p>
      <p v-else>Drop file here or <span class="link" @click="triggerFileSelect">click to select</span></p>
      <span v-if="multiple" class="hint">Maximum {{ maxFiles }} files</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { readableFileSize, resolveFileIcon, resolveFileType } from '~/helpers/resources';

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
      const file = pastedFiles[0];
      if (file) {
        selectedFiles.value = [file];
        emit('select', file);
      }
    }
  }
};

defineExpose({ reset });
</script>

<style scoped lang="scss">
.drop {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 150px;
  border: 2px dashed var(--border);
  border-radius: $radius-md;
  font-size: 14px;
  color: var(--text-secondary);
  background-color: transparent;
  transition: all 0.2s ease;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  &:hover {
    border-color: var(--border-strong);
    background-color: var(--surface-raised);
  }

  &.has-files {
    padding: 12px;
    align-items: stretch;
  }

  &.dragging {
    border-color: var(--primary);
    background-color: var(--surface-raised);
  }

  input[type='file'] {
    display: none;
  }
}

.empty {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
  }

  .hint {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.files {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

.list {
  display: flex;
  max-height: 200px;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.item {
  display: flex;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: $radius-sm;
  background: var(--surface-base);
  transition: all 0.15s ease;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: var(--border-strong);
    background: var(--surface-raised);

    .remove {
      opacity: 1;
    }
  }
}

.icon {
  display: flex;
  width: 36px;
  height: 36px;
  border-radius: $radius-sm;
  color: var(--primary);
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
}

.details {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  font-size: 12px;
  color: var(--text-secondary);
}

.remove {
  display: flex;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  color: var(--text-secondary);
  background: transparent;
  opacity: 0.6;
  transition: all 0.15s ease;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;

  &:hover {
    color: var(--red);
    background: var(--surface-transparent);
    opacity: 1;
  }
}

footer {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--border);
  justify-content: space-between;
  padding-top: 8px;
}

.total {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
}

.link {
  font-size: 13px;
  color: var(--primary);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
