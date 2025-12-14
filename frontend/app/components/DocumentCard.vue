<template>
  <div class="document-card" @contextmenu.prevent="showContextMenu">
    <div class="top">
      <div class="header">
        <span style="display: flex">
          <Icon :name="category?.icon || 'files'" display="xl" :class="`category-icon ${getAppColor(document.color || category?.color as number, true)}`" />
          <NuxtLink :to="`/dashboard/docs/${document.id}`" class="document-title">{{ document.name }}</NuxtLink>
        </span>
        <NodeDotMenu :node="document" :user="user" @delete="deleteDoc" />
      </div>
      <div class="body">
        <div class="category">{{ category?.name }}</div>
        <div v-if="document.tags" class="tags">
          <tag v-for="tag in document.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
        <p class="description" v-text="document.description" />
      </div>
    </div>
    <footer>
      <div class="footer-item">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--font-color)">
          <path
            d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
          />
        </svg>
        <span>{{ formatDate(document.created_timestamp) }}</span>
      </div>
      <div class="footer-item">
        <span>Updated : {{ formatDate(document.updated_timestamp) }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import DeleteDocumentModal from '~/components/Node/DeleteNodeModal.vue';
import NodeContextMenu from '~/components/Node/NodeContextMenu.vue';

const props = defineProps<{ document: Node }>();
const nodesStore = useNodesStore();
const category = computed(() => nodesStore.getById(props.document.parent_id || ''));
useUserStore().fetchPublicUser(props.document.user_id);
const user = computed(() => useUserStore().getById(props.document.user_id || ''));
const deleteDoc = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { props: { node: props.document } }));

function showContextMenu(event: MouseEvent) {
  if (props.document.role === -1) return; // Prevent context menu on nav items
  useContextMenu().open(shallowRef(NodeContextMenu), event, {
    props: { node: props.document as Node },
  });
}
</script>

<style scoped lang="scss">
.document-card {
  display: flex;
  max-width: 380px;
  min-height: 250px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: var(--border-color-accent);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.header {
  display: flex;
  padding: 14px 14px 8px;
  align-items: center;
  justify-content: space-between;
}

.category-icon {
  padding: 8px;
  border-radius: 8px;
  margin-right: 10px;
}

.document-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--font-color-dark);
  transition: color 0.15s;
  line-height: 1.3;

  &:hover {
    color: var(--primary);
  }
}

.body {
  padding: 0 14px;
  flex: 1;
}

.category {
  font-size: 13px;
  font-weight: 500;
  color: var(--font-color-light);
  padding-bottom: 8px;
}

.description {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--font-color-light);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

footer {
  display: flex;
  padding: 10px 14px;
  font-size: 12px;
  color: var(--font-color-light);
  background: var(--bg-contrast);
  border-top: 1px solid var(--border-color);
  border-radius: 0 0 11px 11px;
  justify-content: space-between;
  align-items: center;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
}
</style>
