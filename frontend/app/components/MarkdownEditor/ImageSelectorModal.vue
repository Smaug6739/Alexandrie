<template>
  <div class="image-selector-modal">
    <div class="modal-header">
      <h3>Select Image from CDN</h3>
    </div>

    <div class="modal-content">
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Search images..." class="search-input" @input="filterImages" />
      </div>

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
import { ref, computed, onMounted } from 'vue';
import { useRessourcesStore } from '~/stores/ressources.store';
import type { Ressource } from '~/stores/db_strustures';

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

const filterImages = () => {
  // Filtering is handled by computed property
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
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  flex-shrink: 0;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--font-color-dark);
  }
}

.modal-content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 0;
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
    background: var(--bg-color-secondary);
    color: var(--font-color-dark);
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
    }

    &::placeholder {
      color: var(--font-color-light);
    }
  }
}

.images-grid {
  flex: 1;
  padding: 16px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.image-item {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    object-fit: cover;
    background: var(--bg-color-secondary);
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--font-color-light);
  font-size: 16px;
}

.modal-footer {
  padding: 20px 0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;

  .cancel-btn {
    padding: 10px 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--bg-color-secondary);
    color: var(--font-color-dark);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--border-color);
    }
  }
}
</style>
