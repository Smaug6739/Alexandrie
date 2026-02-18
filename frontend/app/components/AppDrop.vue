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
        <div v-for="(file, index) in selectedFiles" :key="file.name + '-' + file.size + '-' + file.lastModified" class="item">
          <NodeResourceInline :file="file" :remove-file="() => removeFile(index)" class="file-card" />
        </div>
      </div>
      <footer>
        <span class="total">{{ selectedFiles.length }} file{{ selectedFiles.length > 1 ? 's' : '' }} • {{ readableFileSize(totalSize) }}</span>
        <span class="link" @click="triggerFileSelect">+ {{ t('cdn.appdrop.addMore') }}</span>
      </footer>
    </div>

    <div v-else class="empty">
      <Icon name="layers" size="40px" />
      <p v-if="multiple">
        <i18n-t scope="global" keypath="cdn.appdrop.promptPlural">
          <template #link>
            <span class="link" @click="triggerFileSelect">{{ t('cdn.appdrop.link') }}</span>
          </template>
        </i18n-t>
      </p>
      <p v-else>
        <i18n-t scope="global" keypath="cdn.appdrop.prompt">
          <template #link>
            <span class="link" @click="triggerFileSelect">{{ t('cdn.appdrop.link') }}</span>
          </template>
        </i18n-t>
      </p>
      <span v-if="multiple" class="hint">{{ t('cdn.appdrop.max', { n: props.maxFiles }) }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { readableFileSize } from '~/helpers/resources';

const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    maxFiles?: number;
  }>(),
  {
    maxFiles: 10,
    multiple: false,
  },
);

const { t } = useI18nT();
const selectedFiles = ref<File[]>([]);
const isDragOver = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const totalSize = computed(() => selectedFiles.value.reduce((acc, file) => acc + file.size, 0));

const emit = defineEmits<{
  select: [files: File | File[] | null];
}>();

const triggerFileSelect = () => fileInput.value!.click();

const addFiles = (files?: FileList | File[] | null) => {
  if (!files) return;
  const fileArray = Array.from(files);
  if (props.multiple) {
    const newFiles = fileArray.slice(0, props.maxFiles - selectedFiles.value.length);
    for (const file of newFiles) {
      if (file && !selectedFiles.value.some(f => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified)) {
        selectedFiles.value.push(file);
      }
    }
    emit('select', selectedFiles.value);
  } else {
    const file = fileArray[0];
    if (!file) return;
    selectedFiles.value = [file];
    emit('select', file);
  }
};

const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement | null)?.files;
  addFiles(files);
};

const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const files = event.dataTransfer.files;
    addFiles(files);
    isDragOver.value = false;
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const items = event.clipboardData?.items;
  if (!items) return;

  const pastedFiles: File[] = [];
  for (const item of items) {
    const file = item.getAsFile();
    if (!file) continue;
    pastedFiles.push(file);
    if (!props.multiple) break;
  }
  addFiles(pastedFiles);
};

const dragEnter = () => (isDragOver.value = true);
const dragLeave = () => (isDragOver.value = false);

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
  if (fileInput.value) fileInput.value.value = '';
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

defineExpose({ reset });
</script>

<style scoped lang="scss">
.drop {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 150px;
  border: 2px dashed var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
  background-color: transparent;
  transition:
    border-color $transition-base ease,
    background-color $transition-base ease;
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
  max-height: 300px;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}

.item {
  display: flex;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-base);
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
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
  border-radius: var(--radius-sm);
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
  border-radius: var(--radius-xs);
  color: var(--text-secondary);
  background: transparent;
  opacity: 0.6;
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    opacity 0.15s ease;
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
