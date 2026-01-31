<template>
  <div class="line" @contextmenu.prevent="showContextMenu">
    <header>
      <div class="title-row">
        <Icon
          :name="document.icon || category?.icon || 'files'"
          display="xl"
          :class="['icon', getAppAccent(document.color || (category?.color as number), true)]"
        />
        <NuxtLink :to="`/dashboard/docs/${document.id}`" class="name">{{ document.name }}</NuxtLink>
      </div>
      <NodeActionDotMenu :node="document" :user="user" @delete="deleteDoc" />
    </header>
    <div v-if="document.tags" class="tags">
      <tag v-for="tag in document.tags?.split(', ')" :key="tag" class="primary">{{ tag }}</tag>
    </div>
    <p class="desc">{{ document.description }}</p>
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="var(--font-color)">
        <path
          d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
        />
      </svg>
      <span class="date">{{ shortDate(document.updated_timestamp) }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import DeleteDocumentModal from '~/components/Node/Modals/Delete.vue';
import NodeContextMenu from '~/components/Node/Action/ContextMenu.vue';
import type { Node } from '~/stores';

const props = defineProps<{ document: Node }>();

const categoriesStore = useNodesStore();
const userStore = useUserStore();

const { shortDate } = useDateFormatters();
const { getAppAccent } = useAppColors();

const category = computed(() => categoriesStore.getById(props.document.parent_id || ''));
userStore.fetchPublicUser(props.document.user_id);
const user = computed(() => userStore.getById(props.document.user_id || ''));
const deleteDoc = () => useModal().add(new Modal(shallowRef(DeleteDocumentModal), { props: { node: props.document } }));

function showContextMenu(event: MouseEvent) {
  if (props.document.role === -1) return; // Prevent context menu on nav items
  useContextMenu().open(shallowRef(NodeContextMenu), event, {
    props: { node: props.document as Node, contextMenu: true },
  });
}
</script>

<style scoped lang="scss">
.line {
  display: flex;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  transition: background 0.15s ease;
  border-bottom: none;
  flex-direction: column;

  &:first-child {
    border-radius: $radius-md $radius-md 0 0;
  }

  &:last-child {
    border-radius: 0 0 $radius-md $radius-md;
    border-bottom: 1px solid var(--border-color);
  }

  &:only-child {
    border-radius: $radius-md;
    border-bottom: 1px solid var(--border-color);
  }

  &:hover {
    background: var(--bg-contrast);
  }
}

header {
  display: flex;
  border: none;
  align-items: center;
  justify-content: space-between;
}

.title-row {
  display: flex;
  align-items: center;
}

.icon {
  padding: 6px;
  border-radius: $radius-sm;
  margin-right: 8px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: var(--font-color-dark);
  transition: color 0.15s;
  text-decoration: none;

  &:hover {
    color: var(--primary);
  }
}

.desc {
  margin: 0;
  padding: 6px 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--font-color-light);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

footer {
  display: flex;
  font-size: 12px;
  color: var(--font-color-light);
  align-items: center;
  gap: 6px;
  margin-top: 4px;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
</style>
