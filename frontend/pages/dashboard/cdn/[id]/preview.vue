<template>
  <div style="padding: 24px; gap: 16px" class="card-component">
    <div v-if="ressource">
      <h2>Preview <tag blue>New</tag></h2>
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
const ressource = useRessourcesStore().getById(useRoute().params.id as string);
</script>
<style lang="scss">
.card-component {
  display: block;
  margin: 2px 0;
  width: 100%;
}
.preview {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
