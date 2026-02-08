<template>
  <div class="document-card" @contextmenu.prevent="showContextMenu">
    <div class="top">
      <div class="header">
        <span style="display: flex">
          <Icon :name="category?.icon || 'files'" display="xl" :class="`category-icon ${getAppAccent(node.color || category?.color, true)}`" />
          <NuxtLink :to="`/dashboard/docs/${node.id}`" class="document-title">{{ node.name }}</NuxtLink>
        </span>
        <NodeActionDotMenu :node="node" :user="user" @delete="deleteDoc" />
      </div>
      <div class="body">
        <div class="category">{{ category?.name }}</div>
        <div v-if="node.tags" class="tags">
          <tag v-for="tag in node.tags.split(',')" :key="tag" class="primary">{{ tag.trim() }}</tag>
        </div>
        <p class="description" v-text="node.description" />
      </div>
    </div>
    <footer>
      <div class="footer-item">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--text-body)">
          <path
            d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
          />
        </svg>
        <span>{{ shortDate(node.created_timestamp) }}</span>
      </div>
      <div class="footer-item">
        <span>Updated : {{ shortDate(node.updated_timestamp) }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import DeleteDocumentModal from '~/components/Node/Modals/Delete.vue';
import NodeContextMenu from '~/components/Node/Action/ContextMenu.vue';
import type { Node } from '~/stores';

const props = defineProps<{ node: Node }>();

const nodesStore = useNodesStore();
const userStore = useUserStore();

const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

const category = computed(() => nodesStore.getById(props.node.parent_id || ''));
userStore.fetchPublicUser(props.node.user_id);
const user = computed(() => userStore.getById(props.node.user_id || ''));
const deleteDoc = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { props: { node: props.node } }));

function showContextMenu(event: MouseEvent) {
  if (props.node.role === -1) return; // Prevent context menu on nav items
  useContextMenu().open(shallowRef(NodeContextMenu), event, {
    props: { node: props.node, contextMenu: true },
  });
}
</script>

<style scoped lang="scss">
.document-card {
  display: flex;
  max-width: 380px;
  min-height: 250px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
  box-shadow: 0 1px 3px rgb(0 0 0 / 4%);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
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
  border-radius: var(--radius-md);
  margin-right: 10px;
}

.document-title {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
  transition: color 0.15s;

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
  color: var(--text-secondary);
  padding-bottom: 8px;
}

.description {
  display: -webkit-box;
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
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
  border-radius: 0 0 11px 11px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--surface-raised);
  align-items: center;
  border-top: 1px solid var(--border);
  justify-content: space-between;
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
