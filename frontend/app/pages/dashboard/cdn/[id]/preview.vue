<template>
  <div class="card-component">
    <div v-if="ressource">
      <header style="display: flex; align-items: center; justify-content: space-between">
        <h1>Preview <tag blue>New</tag></h1>
        <div style="display: flex">
          <NuxtLink :to="`/dashboard/cdn/${ressource.id}`"><AppButton type="primary">Edit</AppButton></NuxtLink>
          <AppButton type="secondary" @click="copyLink">Copy link</AppButton>
        </div>
      </header>
      Name: <strong>{{ ressource.name }}</strong>
      <p>
        Type: <strong>{{ ressource.metadata?.filetype }}</strong>
      </p>
      <p>
        Size: <strong>{{ readableFileSize(ressource.size ?? 0) }}</strong>
      </p>
      <div class="preview">
        <img
          v-if="(ressource?.metadata?.filetype as string).startsWith('image/')"
          :src="`${CDN}/${ressource!.user_id}/${ressource!.content_compiled || ressource!.content}`"
          alt="Preview"
        />
        <iframe
          v-else-if="(ressource?.metadata?.filetype as string).startsWith('application/pdf')"
          :src="`${CDN}/${ressource!.user_id}/${ressource!.content_compiled || ressource!.content}`"
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
definePageMeta({ breadcrumb: 'Preview' });
const ressource = computed(() => useRessourcesStore().getById(useRoute().params.id as string));

const copyLink = () => {
  const link = `${CDN}/${ressource.value?.user_id}/${ressource.value?.content_compiled || ressource.value?.content}`;
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
