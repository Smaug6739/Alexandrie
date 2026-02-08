<template>
  <div class="page-card node-list">
    <header>
      <h1 v-if="parent">
        <Icon :name="parent.icon || 'files'" display="xl" :class="`parent-icon ${getAppAccent(parent.color as number, true)}`" />
        {{ parent.name }}
      </h1>
      <h1 v-else-if="parentId === 'shared'">
        <Icon name="users" display="xl" class="parent-icon grey" />
        Shared with me
      </h1>
      <h1 v-else>
        <Icon name="workspace" display="xl" class="parent-icon primary" />
        All workspaces
      </h1>
      <div class="header-actions">
        <NuxtLink v-if="view == 'kanban'" class="btn-icon no-mobile" @click="resetKanban">
          <Icon name="reset" display="lg" />
          <p class="hint-tooltip">Reset board</p>
        </NuxtLink>
        <NodeFilter v-show="!isMobile" :nodes="nodes" @update:nodes="filteredNodes = $event" />
        <NuxtLink v-if="parent?.shared && parent.user_id != connectedId" class="btn-icon no-mobile" @click="openRemoveShareModal">
          <Icon name="group_off" display="lg" />
          <p class="hint-tooltip">Remove from shared</p>
        </NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 4)" class="btn-icon no-mobile" @click="openPermissionsModal">
          <Icon name="manage_access" display="lg" />
          <p class="hint-tooltip">Manage permissions</p>
        </NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 2)" class="btn-icon" @click="openEditModal">
          <Icon name="settings" display="lg" />
          <p class="hint-tooltip">Edit metadata</p>
        </NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 4)" class="btn-icon" @click="openDeleteModal">
          <Icon name="delete" display="lg" />
          <p class="hint-tooltip">Delete</p>
        </NuxtLink>
        <span class="doc-count no-mobile">{{ filteredNodes.length != nodes.length ? `${filteredNodes.length} /` : '' }} {{ nodes.length }}</span>
        <ViewSelection v-model="view" :show-kanban="true" />
      </div>
    </header>

    <!-- Content based on view mode -->
    <div v-if="filteredNodes.length" class="node-content">
      <!-- Table/List View -->
      <div v-if="view === 'table'" class="line-container">
        <NodeListInline v-for="document of filteredNodes" :key="document.id" :document="document" class="line-item" />
      </div>

      <!-- Grid View -->
      <div v-else-if="view === 'list'" class="document-grid">
        <NodeCard v-for="document in filteredNodes" :key="document.id" :node="document" />
      </div>

      <!-- Kanban View -->
      <KanbanBoard
        v-else-if="view === 'kanban' && parent"
        ref="kanbanBoard"
        :workspace="parent"
        :documents="filteredNodes"
        @update-metadata="updateKanbanMetadata"
        @create-document="createDocumentInColumn"
      />
    </div>

    <NoContent
      v-else-if="!nodesStore.isFetching"
      style="width: 100%; height: 100%"
      title="No documents found"
      description="There are no documents in this category"
    >
      <NuxtLink to="/dashboard/docs/new">
        <AppButton type="link">+ Create new document</AppButton>
      </NuxtLink>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from '~/components/Node/Modals/Permissions.vue';
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import RemoveSharedNode from '~/components/Node/Modals/RemoveShared.vue';
import NodeMetadataModal from '~/components/Node/Modals/Metadata.vue';
import KanbanBoard, { type KanbanMetadata } from '~/components/Kanban/Board.vue';
import ResetBoardModal from '../Kanban/ResetBoard.modal.vue';
import type { ViewMode } from '~/components/ViewSelection.vue';
import type { Node } from '~/stores';

const props = defineProps<{ parent?: Node; nodes: Node[]; parentId?: string }>();

const nodesStore = useNodesStore();

const router = useRouter();
const userStore = useUserStore();
const { isMobile } = useDevice();
const { getAppAccent } = useAppColors();

const connectedId = userStore.user?.id;
const view = ref<ViewMode>();
const filteredNodes = ref<Node[]>(props.nodes);

// Kanban board reference
const kanbanBoard = ref<InstanceType<typeof KanbanBoard> | null>(null);
const resetKanban = () => {
  useModal().add(
    new Modal(shallowRef(ResetBoardModal), {
      props: {
        onConfirm: () => kanbanBoard.value?.resetKanbanData(),
      },
      size: 'small',
    }),
  );
};

// Watch for nodes changes to update filtered nodes
watch(
  () => props.nodes,
  newNodes => {
    filteredNodes.value = newNodes;
  },
  { immediate: true },
);

const openPermissionsModal = () => {
  if (props.parent) useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: props.parent }, size: 'small' }));
};
const openRemoveShareModal = () => {
  if (props.parent) useModal().add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.parent.id }, size: 'small' }));
};
const openEditModal = () => useModal().add(new Modal(shallowRef(NodeMetadataModal), { props: { doc: props.parent }, size: 'small' }));

const openDeleteModal = () => {
  if (props.parent)
    useModal().add(
      new Modal(shallowRef(NodeDeleteModal), {
        size: 'small',
        props: {
          node: props.parent,
          redirect: '/dashboard',
        },
      }),
    );
};

// Kanban functionality
async function updateKanbanMetadata(metadata: KanbanMetadata) {
  if (!props.parent) return;

  try {
    await nodesStore.update({
      ...props.parent,
      metadata: {
        ...props.parent.metadata,
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Failed to update kanban metadata:', error);
  }
}

function createDocumentInColumn(columnId: string) {
  if (!props.parent) return;
  router.push({
    path: '/dashboard/docs/new',
    query: {
      parent: String(props.parent.id),
      kanbanColumn: columnId,
    },
  });
}
</script>

<style scoped lang="scss">
header {
  flex-wrap: wrap;
  gap: 12px;
}

h1 {
  display: flex;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

a {
  position: relative;
}

a:hover > .hint-tooltip {
  opacity: 1;
  visibility: visible;
}

.parent-icon {
  padding: 6px;
  border-radius: var(--radius-sm);
  margin-right: 10px;
}

.doc-count {
  padding: 8px 10px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: var(--surface-raised);
}

.node-content {
  margin-top: 8px;
}

.line-container {
  display: flex;
  flex-direction: column;
}

.document-grid {
  display: grid;
  width: 100%;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.line-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.line-item:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

@media screen and (width <= 768px) {
  .parent-icon {
    margin-right: 0;
  }

  .header-actions {
    gap: 0;
  }
}
</style>
