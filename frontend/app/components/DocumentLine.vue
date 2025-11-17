<template>
  <div class="document-line" @contextmenu.prevent="showContextMenu">
    <header style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center; justify-content: flex-start">
        <Icon
          :name="document.icon || category?.icon || 'files'"
          display="xl"
          :class="`category-icon ${getAppColor(document.color || category?.color as number, true)}`"
        />
        <NuxtLink :to="`/dashboard/docs/${document.id}`" class="document-title">{{ document.name }}</NuxtLink>
      </div>
      <NodeDotMenu :node="document" :user="user" @delete="deleteDoc" />
    </header>
    <div v-if="document.tags" class="tags">
      <tag v-for="tag in document.tags?.split(', ')" :key="tag" class="primary">{{ tag }}</tag>
    </div>
    <p class="description">{{ document.description }}</p>
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--font-color)">
        <path
          d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
        />
      </svg>
      <span class="date">{{ formatDate(document.updated_timestamp) }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';
import DeleteDocumentModal from '~/components/Node/DeleteNodeModal.vue';
import NodeContextMenu from '~/components/Node/NodeContextMenu.vue';

const props = defineProps<{ document: Node }>();
const categoriesStore = useNodesStore();
const category = computed(() => categoriesStore.getById(props.document.parent_id || ''));
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
.document-line {
  display: flex;
  padding: 12px;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-top: 1px solid var(--border-color);
  flex-direction: column;
}

header {
  border: none;
}

.category-icon {
  padding: 6px;
  border-radius: 6px;
  margin-right: 5px;
}

.document-title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 5px;
  text-decoration: none;
}

.description {
  height: 100%;
  margin: 0;
  padding: 4px 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
}

footer {
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: flex-start;
  margin-top: 8px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}
</style>
