<template>
  <div class="header" :class="{ 'print-style': preferences.get('printMode').value }">
    <div class="text">
      <!-- Skeleton when doc is undefined -->
      <DocumentCardHeaderSkeleton v-if="!doc" />
      <!-- Real content -->
      <template v-else>
        <p class="top-row">
          <span style="display: flex; align-items: center; gap: 12px"
            ><img v-if="user" :src="useAvatar(user)" class="avatar" />
            <span style=" font-size: 18px;color: var(--font-color-light)">{{ user?.username }}</span>
          </span>
          <DocumentCardHeaderActionRow :doc="doc" class="no-print" />
        </p>
        <NuxtLink class="category" :to="`/dashboard/categories/${category?.id}`">{{ category?.name || 'Uncategorized' }}</NuxtLink>
        <h1 class="title" :class="{ public: public }">{{ doc?.name }}</h1>
        <p class="description">{{ doc?.description }}</p>
        <div v-if="doc.tags" class="tags">
          <tag v-for="tag in doc.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
      </template>
    </div>
    <div class="icon">
      <DocumentHeaderIllustration :document="doc" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DocumentCardHeaderActionRow from './DocumentCardHeaderActionRow.vue';
import DocumentHeaderIllustration from './DocumentHeaderIllustration.vue';
import DocumentCardHeaderSkeleton from './DocumentCardHeaderSkeleton.vue';
import type { Node, PublicUser } from '~/stores';

const preferences = usePreferences();
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

  .top-row,
  .title {
    font-family: Inter;
  }

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }

  .public {
    margin-top: 30px;
  }

  .title {
    margin: 6px 0;
    padding: 0;
    font-size: 26px;
    font-weight: 550;
    color: var(--font-color-dark);
  }

  .category {
    display: block;
    font-size: 20px;
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
  .icon {
    display: block;
  }
}

.avatar {
  width: 30px;
  height: 30px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
}

@media print {
  .print-style {
    padding: 0;
    background: none;
    align-items: center;

    .icon,
    .description,
    .tags,
    .top-row,
    .user {
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
