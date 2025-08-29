<template>
  <div class="header" :class="{ 'print-style': preferences.get('printMode').value }">
    <div class="text">
      <!-- Skeleton when doc is undefined -->
      <DocumentCardHeaderSkeleton v-if="!doc" />
      <!-- Real content -->
      <template v-else>
        <p class="category">
          <NuxtLink :to="`/dashboard/categories/${category?.id}`">{{ category?.name }}</NuxtLink>
          <DocumentCardHeaderActionRow :doc="doc" class="no-print" />
        </p>
        <h1 class="title">{{ doc?.name }}</h1>
        <p class="description">{{ doc?.description }}</p>
        <div v-if="doc.tags" class="document-tags">
          <tag v-for="tag in doc.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
      </template>
    </div>
    <div class="icon">
      <DocumentHeaderIllustration />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentCardHeaderActionRow from './DocumentCardHeaderActionRow.vue';
import DocumentHeaderIllustration from './DocumentHeaderIllustration.vue';
import DocumentCardHeaderSkeleton from './DocumentCardHeaderSkeleton.vue';
import type { Document } from '~/stores';

const categories_store = useCategoriesStore();
const preferences = usePreferences();
const props = defineProps<{ doc?: Document }>();
const category = computed(() => categories_store.getById(props.doc?.category || ''));
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 0.7rem 1.2rem;
  border-radius: 0.625rem;
  background-color: var(--bg-contrast);
  transition: background-color $transition-duration;
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
    font-size: 26px;
    font-weight: 700;
    color: var(--font-color-dark);
  }

  .category {
    display: flex;
    font-size: 20px;
    font-weight: 500;
    color: var(--font-color-light);
    align-items: baseline;
    justify-content: space-between;
  }
}

.document-tags {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding-top: 5px;
}

/* --- Skeleton Loader --- */
.skeleton {
  margin: 8px 0;
  border-radius: 6px;
  background: linear-gradient(90deg, #ddd 25%, #eee 37%, #ddd 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skeleton-category {
  width: 40%;
  height: 20px;
}

.skeleton-title {
  width: 70%;
  height: 28px;
}

.skeleton-desc {
  width: 90%;
  height: 16px;
}

.skeleton-tag {
  display: inline-block;
  width: 80px;
  height: 20px;
  margin-right: 6px;
}

.skeleton-tag.short {
  width: 50px;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}

@media print, screen and (width >= 1024px) {
  .icon {
    display: block;
  }
}

@media print {
  .print-style {
    padding: 0.4rem 0.2rem;
    background: none;
    align-items: center;

    .icon,
    .description,
    .document-tags,
    .category {
      display: none;
    }

    .title {
      font-size: 27px;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid var(--font-color);
    }
  }
}
</style>
