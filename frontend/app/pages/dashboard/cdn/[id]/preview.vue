<template>
  <div class="card-component">
    <div v-if="ressource">
      <header style="display: flex; justify-content: space-between; align-items: center">
        <h1>Preview <tag blue>New</tag></h1>
        <div style="display: flex">
          <NuxtLink :to="`/dashboard/cdn/${ressource.id}`"><AppButton type="primary">Edit</AppButton></NuxtLink>
          <AppButton type="secondary" @click="copyLink">Copy link</AppButton>
        </div>
      </header>
      Name: <strong>{{ ressource.filename }}</strong>
      <p>
        Type: <strong>{{ ressource.filetype }}</strong>
      </p>
      <p>
        Size: <strong>{{ readableFileSize(ressource.filesize) }}</strong>
      </p>
    </div>
    <div class="preview">
      <img v-if="ressource!.filetype.startsWith('image/')" :src="`${CDN}/${ressource!.author_id}/${ressource!.transformed_path || ressource!.original_path}`" alt="Preview" />
      <iframe v-else-if="ressource!.filetype.startsWith('application/pdf')" :src="`${CDN}/${ressource!.author_id}/${ressource!.transformed_path || ressource!.original_path}`" width="100%" height="500px" frameborder="0" allowfullscreen></iframe>
      <p v-else>Preview not available for this file type.</p>
    </div>
    <div style="display: flex; justify-content: flex-end"></div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ breadcrumb: 'Preview' });
const ressource = useRessourcesStore().getById(useRoute().params.id as string);

const copyLink = () => {
  const link = `${CDN}/${ressource?.author_id}/${ressource?.transformed_path || ressource?.original_path}`;
  navigator.clipboard.writeText(link);
};
</script>
<style scoped lang="scss">
.preview {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
