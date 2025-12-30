<template>
  <div class="modal-ctn">
    <EditorAppHeader icon="image" title="Select Image" subtitle="Choose an image to insert into your document." />
    <div class="modal-content">
      <AppDrop ref="dropComponent" @select="submitFile" />
      <Loader v-if="isLoading" style="margin: 12px auto" />
      <p v-if="uploadError" class="error">{{ uploadError }}</p>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Search images..." class="search-input" />
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
const { CDN } = useApi();

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
  const imageUrl = (CDN + `/${useUserStore().user?.id}/` + image.metadata?.transformed_path) as string;
  const altText = image.name.replace(/\.[^/.]+$/, '');
  props.onImageSelect(imageUrl, altText);
  emit('close');
};
</script>

<style scoped lang="scss">
.modal-ctn {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: transparent;
  flex-direction: column;
  overflow: hidden;
}

.modal-content {
  min-height: 0;
  padding: 0;
  gap: 24px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: var(--bg-color-secondary);
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: var(--border-color);

    &:hover {
      background: var(--primary);
    }
  }
}

.search-bar {
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;

  .search-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    color: var(--font-color-dark);
    background: var(--bg-color-secondary);

    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgb(var(--primary-rgb), 0.1);
      outline: none;
    }

    &::placeholder {
      color: var(--font-color-light);
    }
  }
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
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 24px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    border-radius: 6px;
    background: var(--bg-color-secondary);
    object-fit: cover;
  }

  .image-info {
    padding: 12px;
    background: var(--bg-color-secondary);

    .image-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--font-color-dark);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .image-size {
      display: block;
      font-size: 12px;
      color: var(--font-color-light);
    }
  }
}

.no-images {
  display: flex;
  height: 200px;
  font-size: 16px;
  color: var(--font-color-light);
  align-items: center;
  justify-content: center;
}
</style>
