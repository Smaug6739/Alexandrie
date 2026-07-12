<template>
  <div class="header" :class="{ 'print-style': printMode }">
    <div class="container">
      <!-- Skeleton when doc is undefined -->
      <NodeDocumentHeaderSkeleton v-if="!doc" />
      <!-- Real content -->
      <template v-else>
        <Teleport to="#navbar-actions" :disabled="public">
          <NodeDocumentHeaderActionRow :doc="doc" :is-public="public" />
        </Teleport>

        <div class="content">
          <div class="infos">
            <p class="user">
              <img v-if="user" :src="avatarURL(user)" alt="avatar" class="avatar" />
              <span style="font-size: 16px; color: var(--text-secondary)">{{ user?.username }}</span>
            </p>
            <NuxtLink class="category" :to="`/dashboard/categories/${category?.id}`">{{ category?.name || 'Uncategorized' }}</NuxtLink>
            <h1 :class="{ public: public }">{{ doc?.name }}</h1>
            <Teleport v-if="!public" to="#navbar-title">
              <Icon :name="doc.icon || 'files'" display="xl" :class="['parent-icon', getAppAccent(doc.color as number, true)]" />
              {{ doc.name }}
            </Teleport>
            <p class="description">{{ doc?.description }}</p>
            <NodeTagList v-if="doc.tags" :tags="doc.tags" :clickable="!public" class="tags" />
          </div>
          <div class="thumbnail">
            <NodeDocumentThumbnail :document="doc" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node, PublicUser } from '~/stores';

const props = defineProps<{ doc?: Node; public?: boolean }>();

const userStore = useUserStore();
const preferences = usePreferencesStore();

const { avatarURL } = useApi();
const nodesTree = useNodesTree();
const { getAppAccent } = useAppColors();

const user = ref<PublicUser | null>(null);

const category = computed(() => nodesTree.getClosestCategoryAncestor(props.doc?.id)?.data);
const printMode = preferences.get('printMode');

watch(
  () => props.doc?.user_id,
  async newUserId => {
    if (!newUserId || newUserId === 'undefined') {
      user.value = null;
      return;
    }
    try {
      const u = await userStore.fetchPublicUser(newUserId);
      user.value = u;
    } catch {
      user.value = null;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  padding: 1.2rem 1.2rem 0;
  border: 1px solid var(--border-subtle);
  border-radius: 0.625rem;
  background: radial-gradient(circle at top right, color-mix(in srgb, var(--primary) 18%, transparent), var(--surface-raised) 28%);
  transition: background-color $transition-base;
}

p {
  margin: 0;
}

.container {
  flex: 2;
  padding-right: 10px;
}

.user {
  display: flex;
  min-width: 120px;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
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
