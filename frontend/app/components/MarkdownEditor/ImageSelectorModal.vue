<template>
  <div class="container">
    <EditorAppHeader icon="image" title="Select Image" subtitle="Choose an image to insert into your document." />
    <div class="content">
      <AppDrop ref="dropComponent" @select="submitFile as (file: File) => void" />
      <Loader v-if="isLoading" style="margin: 12px auto" />
      <p v-if="uploadError" class="error">{{ uploadError }}</p>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Search images..." />
      </div>
      <div class="images-grid">
        <div v-for="image in filteredImages.values()" :key="image.id" class="image-item" @click="selectImage(image)">
          <img :src="resolvePreviewUrl(image)" :alt="image.name" class="image-preview" @error="handleImageError" />
          <div class="image-info">
            <span class="image-name">{{ image.name }}</span>
            <span class="image-size">{{ readableFileSize(image.size ?? 0) }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredImages.size === 0" class="no-images">
        <p>No images found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
import { readableFileSize, isImageFile, resolvePreviewUrl } from '~/helpers/resources';
import type { Node } from '~/stores';

const resourcesStore = useResourcesStore();
const nodesStore = useNodesStore();

const props = defineProps<{ onImageSelect: (imageUrl: string, altText: string) => void }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const searchQuery = ref('');
const isLoading = ref(false);
const uploadError = ref<string | null>(null);
const dropComponent = ref();
const { resourceURL } = useApi();

const submitFile = (selectedFile: File) => {
  if (!selectedFile) return;
  isLoading.value = true;
  const body = new FormData();
  body.append('file', selectedFile);
  dropComponent.value.reset(); // Reset drop component
  resourcesStore
    .post(body)
    .catch(e => (uploadError.value = e || 'An error occurred during upload.'))
    .finally(() => (isLoading.value = false));
};

const filteredImages = computed(() => {
  if (!searchQuery.value.trim()) {
    return nodesStore.resources.filter(img => isImageFile(img.metadata?.filetype as string));
  }
  return nodesStore.resources.filter(img => isImageFile(img.metadata?.filetype as string) && img.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

const selectImage = (image: Node) => {
  const altText = image.name.replace(/\.[^/.]+$/, '');
  props.onImageSelect(resourceURL(image), altText);
  emit('close');
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
}

.content {
  min-height: 0;
  padding: 0;
  gap: 24px;
  overflow-y: auto;
  padding-right: 8px;
}

.search-bar {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.images-grid {
  display: grid;
  padding: 16px 0;
  flex: 1;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.image-item {
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    border-color $transition-fast ease,
    box-shadow $transition-fast ease,
    transform $transition-fast ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    border-radius: var(--radius-sm);
  }

  .image-info {
    padding: 12px;

    .image-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .image-size {
      display: block;
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}

.no-images {
  display: flex;
  height: 200px;
  font-size: 16px;
  color: var(--text-secondary);
  align-items: center;
  justify-content: center;
}
</style>
