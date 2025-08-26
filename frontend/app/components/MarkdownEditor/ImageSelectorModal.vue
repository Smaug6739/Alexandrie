<template>
  <div class="image-selector-modal">
    <EditorAppHeader icon="image" title="Select Image" subtitle="Choose an image to insert into your document." />
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Search images..." class="search-input" />
    </div>
    <div class="modal-content">
      <div class="images-grid">
        <div v-for="image in filteredImages" :key="image.id" class="image-item" @click="selectImage(image)">
          <img :src="CDN + `/${useUserStore().user?.id}/` + image.transformed_path" :alt="image.filename" class="image-preview" @error="handleImageError" />
          <div class="image-info">
            <span class="image-name">{{ image.filename }}</span>
            <span class="image-size">{{ formatFileSize(image.filesize) }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredImages.length === 0" class="no-images">
        <p>No images found</p>
      </div>
    </div>

    <div class="modal-footer">
      <button class="cancel-btn" @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
import { useRessourcesStore, type Ressource } from '~/stores';

const props = defineProps<{
  onImageSelect: (imageUrl: string, altText: string) => void;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const ressourcesStore = useRessourcesStore();
const searchQuery = ref('');
const images = ref<Ressource[]>([]);
const loading = ref(false);

const filteredImages = computed(() => {
  if (!searchQuery.value.trim()) {
    return images.value.filter(img => isImageFile(img.filetype));
  }

  return images.value.filter(img => isImageFile(img.filetype) && img.filename.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const isImageFile = (filetype: string): boolean => {
  return filetype.startsWith('image/');
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

const selectImage = (image: Ressource) => {
  const imageUrl = CDN + `/${useUserStore().user?.id}/` + image.transformed_path;
  const altText = image.filename.replace(/\.[^/.]+$/, '');
  props.onImageSelect(imageUrl, altText);
  emit('close');
};

const closeModal = () => {
  emit('close');
};

const loadImages = async () => {
  try {
    loading.value = true;
    await ressourcesStore.fetch();
    images.value = ressourcesStore.getAll;
  } catch (error) {
    console.error('Failed to load images:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadImages();
});
</script>

<style scoped lang="scss">
.image-selector-modal {
  display: flex;
  width: 100%;
  height: 100%;
  background: transparent;
  flex-direction: column;
}

.modal-content {
  display: flex;
  padding: 0;
  flex: 1;
  flex-direction: column;
  overflow: auto;
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

.modal-footer {
  display: flex;
  padding: 20px 0;
  flex-shrink: 0;
  gap: 12px;
  justify-content: flex-end;

  .cancel-btn {
    padding: 10px 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 14px;
    color: var(--font-color-dark);
    background: var(--bg-color-secondary);
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      background: var(--border-color);
    }
  }
}
</style>
