<template>
  <div class="header" :class="{ 'print-style': preferences.get('printMode').value }">
    <div class="container">
      <!-- Skeleton when doc is undefined -->
      <HeaderSkeleton v-if="!doc" />
      <!-- Real content -->
      <template v-else>
        <div class="top-row">
          <p class="user">
            <img v-if="user" :src="api.avatarURL(user)" class="avatar" />
            <span style="font-size: 16px; color: var(--text-secondary)">{{ user?.username }}</span>
          </p>
          <HeaderActionRow :doc="doc" :is-public="public" class="no-print actions" />
        </div>
        <div class="content">
          <div class="infos">
            <NuxtLink class="category" :to="`/dashboard/categories/${category?.id}`">{{ category?.name || 'Uncategorized' }}</NuxtLink>
            <h1 :class="{ public: public }">{{ doc?.name }}</h1>
            <p class="description">{{ doc?.description }}</p>
            <div v-if="doc.tags" class="tags">
              <tag v-for="tag in doc.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
            </div>
          </div>
          <div class="thumbnail">
            <Thumbnail :document="doc" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node, PublicUser } from '~/stores';
import Thumbnail from './Thumbnail.vue';
import HeaderSkeleton from './HeaderSkeleton.vue';
import HeaderActionRow from './HeaderActionRow.vue';

const preferences = usePreferences();
const api = useApi();
const nodesTree = useNodesTree();

const props = defineProps<{ doc?: Node; public?: boolean }>();
const category = computed(() => nodesTree.getAncestorCategory(props.doc?.parent_id)?.data);
const store = useUserStore();
const user = ref<PublicUser | null>(null);
watchEffect(() => {
  if (props.doc) store.fetchPublicUser(props.doc.user_id).then(u => (user.value = u));
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 1.2rem 1.2rem 0;
  border: 1px solid var(--border-subtle);
  border-radius: 0.625rem;
  background-color: var(--surface-raised);
  transition: background-color $transition-base;
}

p {
  margin: 0;
}

.container {
  flex: 2;
  padding-right: 10px;
}

.top-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 6px;

  .user {
    display: flex;
    min-width: 120px;
    align-items: center;
    gap: 12px;
  }
}

.content {
  display: flex;
  justify-content: space-between;

  .infos {
    flex: 1;
    margin-top: 10px;
  }
}

.thumbnail {
  display: none;
  max-width: 30%;
}

.public {
  margin-top: 30px;
}

h1 {
  margin: 10px 0;
  padding: 0;
  font-size: 22px;
  font-weight: 550;
  color: var(--text-primary);
}

.description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.category {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tags {
  display: flex;
  padding: 8px 0;
  flex-wrap: wrap;
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
      border-bottom: 1px solid var(--text-body);
    }
  }
}
</style>
