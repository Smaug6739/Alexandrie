<template>
  <div class="header">
    <div class="text">
      <p class="category">
        {{ category?.name }}
        <DocumentCardHeaderActionRow :doc_id="doc.id" class="no-print" />
      </p>
      <h1 class="title">{{ doc?.name }}</h1>
      <p class="description">{{ doc?.description }}</p>
      <div class="document-tags" v-if="doc.tags">
        <span v-for="tag in doc.tags.split(',')" :key="tag" class="tag blue">{{ tag.trim() }}</span>
      </div>
    </div>
    <div class="icon">
      <DocumentHeaderIllustration />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentCardHeaderActionRow from './DocumentCardHeaderActionRow.vue';
import DocumentHeaderIllustration from './DocumentHeaderIllustration.vue';
import type { Document } from '~/stores';
const categories_store = useCategoriesStore();
const props = defineProps<{ doc: Document }>();
const category = computed(() => categories_store.getById(props.doc?.category || ''));
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg-contrast);
  padding: 0.7rem 1rem;
  border-radius: 0.625rem;
  display: flex;
}

p {
  margin: 0;
}

.icon {
  display: none;
}

.text {
  flex: 2;
  padding-right: 10px;

  .category,
  .title {
    font-family: Inter;
  }

  .title {
    font-weight: 700;
  }

  .category {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    font-size: 20px;
    font-weight: 500;
    color: var(--font-color);
  }
}

.document-tags {
  padding-top: 5px;
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
}

@media print, screen and (min-width: 1024px) {
  .icon {
    display: block;
  }
}
</style>
