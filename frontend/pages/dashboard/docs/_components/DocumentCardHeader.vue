<template>
  <div class="header" :class="{ 'print-style': preferences.get('printMode') }">
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
const preferences = usePreferencesStore();
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
@media print {
  .print-style {
    align-items: center;
    padding: 0.4rem 0.2rem;

    .icon,
    .description,
    .document-tags,
    .category {
      display: none;
    }
    .title {
      font-size: 27px;
      font-weight: 700;
      border-bottom: 1px solid var(--font-color);
      text-align: center;
    }
  }
}
</style>
