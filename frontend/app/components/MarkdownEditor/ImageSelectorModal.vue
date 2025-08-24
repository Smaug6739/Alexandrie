<template>
  <div class="image-selector-modal">
    <div class="modal-header">
      <div class="header-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#fff">
          <path
            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"
          />
        </svg>
      </div>
      <h3>Image selector</h3>
      <p class="header-subtitle">Choose image from your library</p>
    </div>
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
  background: transparent;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 20px 0;
  flex-shrink: 0;
  text-align: center;

  .header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)));
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: white;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  h3 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 800;
    color: var(--font-color-dark);
    letter-spacing: -0.8px;
    background: linear-gradient(135deg, var(--font-color-dark), var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .header-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--font-color-light);
    font-weight: 500;
    line-height: 1.4;
    max-width: 280px;
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

  &:hover {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .image-preview {
    border-radius: 6px;
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
