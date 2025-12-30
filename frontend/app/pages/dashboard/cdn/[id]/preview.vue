<template>
  <div class="card">
    <template v-if="resource">
      <header>
        <h1>Preview <tag yellow>Beta</tag> • {{ resource.name }}</h1>
        <div class="actions">
          <AppSelect v-if="isPdfFile(mimeType)" v-model="scale" :items="PDF_SCALES" :searchable="false" label="Scale" style="margin-right: 12px" />
          <NuxtLink :to="`/dashboard/cdn/${resource.id}`"><AppButton type="primary">Edit</AppButton></NuxtLink>
          <AppButton type="secondary" @click="copyLink">Copy link</AppButton>
        </div>
      </header>
      <div class="preview">
        <img v-if="isImageFile(mimeType)" :src="`${CDN}/${resource!.user_id}/${resource!.metadata?.transformed_path || resource!.content}`" alt="Preview" />
        <LazyPDFViewer
          v-else-if="isPdfFile(mimeType)"
          :src="`${CDN}/${resource!.user_id}/${resource!.metadata?.transformed_path || resource!.content}`"
          :scale="scale"
        />
        <p v-else>Preview not available for this file type.</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { PDF_SCALES, DEFAULT_PDF_SCALE } from '~/helpers/constants';
import { isImageFile, isPdfFile } from '~/helpers/resources';

definePageMeta({ breadcrumb: 'Preview' });

const { CDN } = useApi();
const { isMobile } = useDevice();

const scale = ref(isMobile.value ? DEFAULT_PDF_SCALE.mobile : DEFAULT_PDF_SCALE.desktop);

const resource = computed(() => useNodesStore().getById(useRoute().params.id as string));
const mimeType = computed(() => resource.value?.metadata?.filetype || '');

const copyLink = () => {
  const link = `${CDN}/${resource.value?.user_id}/${resource.value?.metadata?.transformed_path || resource.value?.content}`;
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
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
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
</style>
