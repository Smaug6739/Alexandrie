<template>
  <div class="dropzone" :class="{ 'drag-over': isDragOver }" @dragover.prevent @drop.prevent="handleFileDrop" @dragenter.prevent="dragEnter" @dragleave.prevent="dragLeave">
    <input type="file" ref="fileInput" @change="handleFileSelect" />
    <div v-if="selectedFile" class="file-info">
      <span>{{ selectedFile.name }}</span>
      <div class="file-size">{{ readableFileSize(selectedFile.size) }}</div>
    </div>
    <div v-else>Drop file here or <span class="clickable" @click="triggerFileSelect">click to select from computer</span>.</div>
  </div>
</template>
<script setup lang="ts">
const selectedFile: Ref<File | null | undefined> = ref(null);
const isDragOver = ref(false);
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const triggerFileSelect = () => fileInput.value!.click();
const handleFileSelect = (event: Event) => {
  emit('select', (event.target as HTMLInputElement | null)?.files?.[0] || null);
  selectedFile.value = (event.target as HTMLInputElement | null)?.files?.[0] || null;
};
const emit = defineEmits(['select']);
const handleFileDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    selectedFile.value = event.dataTransfer.files[0];
    emit('select', event.dataTransfer.files[0]);
    isDragOver.value = false;
  }
};
const dragEnter = () => (isDragOver.value = true);
const dragLeave = () => (isDragOver.value = false);

const reset = () => {
  selectedFile.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

defineExpose({ reset });
</script>

<style scoped lang="scss">
.dropzone {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 150px;
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  color: var(--font-color-light);
  position: relative;
  transition: background-color $transition-duration;
  background-color: var(--dropzone-bg, transparent);

  &:hover {
    background-color: var(--bg-contrast);
  }

  input[type='file'] {
    display: none;
  }
}

.drag-over {
  background-color: var(--bg-contrast);
  border-color: var(--primary);
  transition: background-color $transition-duration, border-color $transition-duration;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--primary);
  color: var(--primary);

  .file-size {
    font-size: 0.8rem;
    color: var(--font-color-dark);
    margin-top: 5px;
  }
}

.clickable {
  color: var(--primary);
  cursor: pointer;
  text-decoration: underline;
}
</style>
