<template>
  <div class="card-component">
    <template v-if="resource">
      <header>
        <h1>Preview <tag yellow>Beta</tag> • {{ resource.name }}</h1>
        <div class="actions-row">
          <AppSelect v-if="isPdfFile(mimeType)" v-model="zoom" :items="PDF_SCALES" :searchable="false" label="Scale" style="width: 200px" />
          <NuxtLink :to="`/dashboard/cdn/${resource.id}`"><AppButton type="primary">Edit</AppButton></NuxtLink>
          <AppButton type="secondary" class="no-mobile" @click="copyLink">Copy link</AppButton>
          <NuxtLink :href="resourceURL(resource, true)" download rel="noopener" class="btn-icon">
            <Icon name="download" display="lg" />
          </NuxtLink>
        </div>
      </header>
      <div class="preview">
        <img v-if="isImageFile(mimeType)" :src="resourceURL(resource)" alt="Preview" />
        <LazyPDFViewer v-else-if="isPdfFile(mimeType)" :src="resourceURL(resource)" :zoom="zoom" />
        <video v-else-if="isVideoFile(mimeType)" :src="resourceURL(resource)" controls />
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
import { PDF_SCALES } from '~/helpers/constants';
import { isImageFile, isPdfFile, isVideoFile } from '~/helpers/resources';

definePageMeta({ breadcrumb: 'Preview' });

const { resourceURL } = useApi();

const zoom = ref<(typeof PDF_SCALES)[number]['id']>('automatic_zoom');

const resource = computed(() => useNodesStore().getById(useRoute().params.id as string));
const mimeType = computed(() => resource.value?.metadata?.filetype || '');

const copyLink = () => {
  const link = resourceURL(resource.value!);
  navigator.clipboard.writeText(link);
};
</script>
<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
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
