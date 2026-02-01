<template>
  <div class="card-component">
    <template v-if="resource">
      <header>
        <h1>Preview <tag yellow>Beta</tag> • {{ resource.name }}</h1>
        <div class="actions-row">
          <AppSelect v-if="isPdfFile(mimeType)" v-model="zoom" :items="PDF_SCALES" :searchable="false" label="Scale" style="width: 200px" />
          <NuxtLink :to="`/dashboard/cdn/${resource.id}`" class="btn-icon">
            <Icon name="edit" display="lg" />
            <p class="hint-tooltip">Edit</p>
          </NuxtLink>
          <span class="btn-icon" @click="copyLink">
            <Icon name="copy" display="lg" />
            <p class="hint-tooltip">Copy link</p>
          </span>
          <NuxtLink :href="resourceURL(resource, true)" download rel="noopener" class="btn-icon">
            <Icon name="download" display="lg" />
            <p class="hint-tooltip">Download</p>
          </NuxtLink>
          <NuxtLink @click="showDeleteModal" class="btn-icon">
            <Icon name="delete" display="lg" />
            <p class="hint-tooltip">Delete</p>
          </NuxtLink>
        </div>
      </header>
      <div class="preview">
        <img v-if="isImageFile(mimeType)" :src="resourceURL(resource)" alt="Preview" />
        <LazyPDFViewer v-else-if="isPdfFile(mimeType)" :src="resourceURL(resource)" :zoom="zoom" />
        <video v-else-if="isVideoFile(mimeType)" :src="resourceURL(resource)" controls />
        <audio v-else-if="isAudioFile(mimeType)" :src="resourceURL(resource)" controls />
        <div v-else class="no-preview">
          <p>Preview not available for this file type.</p>
          <p>
            <NuxtLink :href="resourceURL(resource, true)" download rel="noopener">
              <AppButton type="primary">Download file</AppButton>
            </NuxtLink>
          </p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import { PDF_SCALES } from '~/helpers/constants';
import { isImageFile, isPdfFile, isVideoFile, isAudioFile } from '~/helpers/resources';

definePageMeta({ breadcrumb: 'Preview' });

const { resourceURL } = useApi();

const zoom = ref<(typeof PDF_SCALES)[number]['id']>('automatic_zoom');

const resource = computed(() => useNodesStore().getById(useRoute().params.id as string));
const mimeType = computed(() => resource.value?.metadata?.filetype || '');

const copyLink = () => {
  const link = resourceURL(resource.value!);
  navigator.clipboard.writeText(link);
};

const showDeleteModal = () => {
  useModal().add(new Modal(shallowRef(DeleteNodeModal), { props: { nodes: [resource.value], redirectTo: '/dashboard/cdn' }, size: 'small' }));
};
</script>
<style scoped lang="scss">
.btn-icon {
  position: relative;
  margin: 0 1px;
  &:hover .hint-tooltip {
    opacity: 1;
    visibility: visible;
  }
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.preview {
  display: flex;
  flex: 1;
  overflow: hidden;
  justify-content: center;
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.no-preview {
  display: flex;
  flex-direction: column;
  text-align: center;
}
</style>
