<template>
  <div class="header" :class="{ 'print-style': preferences.get('printMode').value }">
    <div class="text">
      <!-- Skeleton when doc is undefined -->
      <Skeleton v-if="!doc" />
      <!-- Real content -->
      <template v-else>
        <p class="top-row">
          <span style="display: flex; align-items: center; gap: 12px"
            ><img v-if="user" :src="api.avatarURL(user)" class="avatar" />
            <span style="font-size: 16px; color: var(--font-color-light)">{{ user?.username }}</span>
          </span>
          <HeaderActionRow :doc="doc" :is-public="public" class="no-print" />
        </p>
        <NuxtLink class="category" :to="`/dashboard/categories/${category?.id}`">{{ category?.name || 'Uncategorized' }}</NuxtLink>
        <h1 :class="{ public: public }">{{ doc?.name }}</h1>
        <p class="description">{{ doc?.description }}</p>
        <div v-if="doc.tags" class="tags">
          <tag v-for="tag in doc.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
      </template>
    </div>
    <div class="thumbnail">
      <Thumbnail :document="doc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node, PublicUser } from '~/stores';
import Thumbnail from './Thumbnail.vue';
import Skeleton from './Skeleton.vue';
import HeaderActionRow from './HeaderActionRow.vue';

const preferences = usePreferences();
const api = useApi();

const props = defineProps<{ doc?: Node; public?: boolean }>();
const category = computed(() => useSidebarTree().getCategoryFromNode(props.doc?.parent_id)?.data);
const store = useUserStore();
const user = ref<PublicUser | null>(null);
watchEffect(() => {
  if (props.doc) store.fetchPublicUser(props.doc.user_id).then(u => (user.value = u));
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 1rem 1.2rem;
  border: 1px solid var(--border-color-light);
  border-radius: 0.625rem;
  background-color: var(--bg-contrast);
  transition: background-color $transition-duration;
}

p {
  margin: 0;
}

.thumbnail {
  display: none;
  max-width: 30%;
}

.text {
  flex: 2;
  padding-right: 10px;

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }

  .public {
    margin-top: 30px;
  }

  h1 {
    margin: 4px 0;
    padding: 0;
    font-size: 22px;
    font-weight: 550;
    color: var(--font-color-dark);
  }

  .description {
    font-size: 14px;
    color: var(--font-color-light);
    margin-bottom: 8px;
  }

  .category {
    display: block;
    font-size: 18px;
    font-weight: 500;
    color: var(--font-color-light);
    padding-top: 8px;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  padding-top: 5px;
}

@media print, screen and (width >= 1024px) {
  .thumbnail {
    display: block;
  }
}

.avatar {
  width: 25px;
  height: 25px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
}

@media print {
  .print-style {
    padding: 0;
    border: none;
    background: none;
    align-items: center;

    .thumbnail,
    .description,
    .category,
    .tags,
    .top-row,
    .user {
      display: none;
    }

    h1 {
      font-size: 27px;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid var(--font-color);
    }
  }
}
</style>
