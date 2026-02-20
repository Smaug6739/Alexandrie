<template>
  <div class="page-card">
    <template v-if="resource">
      <header>
        <h1>{{ t('cdn.preview.title') }} <tag orange>Beta</tag> • {{ resource.name }}</h1>
        <div class="actions-row">
          <AppSelect v-if="isPdfFile(mimeType)" v-model="zoom" :items="PDF_SCALES" :searchable="false" label="Scale" style="width: 200px" />
          <NuxtLink :to="`/dashboard/cdn/${resource.id}`" class="btn-icon">
            <Icon name="edit" display="lg" />
            <p class="hint-tooltip">{{ t('common.actions.edit') }}</p>
          </NuxtLink>
          <span class="btn-icon" @click="copyLink">
            <Icon name="copy" display="lg" />
            <p class="hint-tooltip">{{ t('common.actions.copyLink') }}</p>
          </span>
          <NuxtLink :href="resourceURL(resource, true)" download rel="noopener" class="btn-icon">
            <Icon name="download" display="lg" />
            <p class="hint-tooltip">{{ t('common.actions.download') }}</p>
          </NuxtLink>
          <NuxtLink class="btn-icon" @click="showDeleteModal">
            <Icon name="delete" display="lg" />
            <p class="hint-tooltip">{{ t('common.actions.delete') }}</p>
          </NuxtLink>
        </div>
      </header>
      <div class="preview">
        <img v-if="isImageFile(mimeType)" :src="resourceURL(resource)" alt="Preview" />
        <LazyPDFViewer v-else-if="isPdfFile(mimeType)" :src="resourceURL(resource)" :zoom="zoom" />
        <video v-else-if="isVideoFile(mimeType)" :src="resourceURL(resource)" controls />
        <audio v-else-if="isAudioFile(mimeType)" :src="resourceURL(resource)" controls />
        <div v-else class="no-preview">
          <p>{{ t('cdn.preview.unavailable') }}</p>
          <p>
            <NuxtLink :href="resourceURL(resource, true)" download rel="noopener">
              <AppButton type="primary">{{ t('cdn.actions.download') }}</AppButton>
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

definePageMeta({ breadcrumb: { i18n: 'common.actions.preview' } });

const { t } = useI18nT();
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
  flex-wrap: wrap;
  justify-content: space-between;
}

.preview {
  display: flex;
  flex: 1;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

.no-preview {
  display: flex;
  text-align: center;
  flex-direction: column;
}
</style>
