<template>
  <div class="card-component">
    <div v-if="resource">
      <header style="display: flex; align-items: center; justify-content: space-between">
        <h1>Preview <tag blue>New</tag></h1>
        <div style="display: flex">
          <NuxtLink :to="`/dashboard/cdn/${resource.id}`"><AppButton type="primary">Edit</AppButton></NuxtLink>
          <AppButton type="secondary" @click="copyLink">Copy link</AppButton>
        </div>
      </header>
      Name: <strong>{{ resource.name }}</strong>
      <p>
        Type: <strong>{{ resource.metadata?.filetype }}</strong>
      </p>
      <p>
        Size: <strong>{{ readableFileSize(resource.size ?? 0) }}</strong>
      </p>
      <div class="preview">
        <img
          v-if="(resource?.metadata?.filetype as string)?.startsWith('image/')"
          :src="`${CDN}/${resource!.user_id}/${resource!.metadata?.transformed_path || resource!.content}`"
          alt="Preview"
        />
        <iframe
          v-else-if="(resource?.metadata?.filetype as string)?.startsWith('application/pdf')"
          :src="`${CDN}/${resource!.user_id}/${resource!.metadata?.transformed_path || resource!.content}`"
          width="100%"
          height="500px"
          frameborder="0"
          allowfullscreen
        />
        <p v-else>Preview not available for this file type.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readableFileSize } from '~/helpers/resources';
definePageMeta({ breadcrumb: 'Preview' });
const resource = computed(() => useNodesStore().getById(useRoute().params.id as string));
const { CDN } = useApi();

const copyLink = () => {
  const link = `${CDN}/${resource.value?.user_id}/${resource.value?.metadata?.transformed_path || resource.value?.content}`;
  navigator.clipboard.writeText(link);
};
</script>
<style scoped lang="scss">
.preview {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
}
</style>
