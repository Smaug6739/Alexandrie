<template>
  <div class="card-component node-list">
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
        </NuxtLink>
        <NodeFilter v-show="!isMobile" :nodes="nodes" @update:nodes="filteredNodes = $event" />
        <NuxtLink v-if="parent?.shared && parent.user_id != connectedId" class="btn-icon no-mobile" @click="openRemoveShareModal">
          <Icon name="group_off" display="lg" />
        </NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 4)" class="btn-icon no-mobile" @click="openPermissionsModal">
          <Icon name="manage_access" display="lg" />
        </NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 2)" class="btn-icon" @click="openEditModal">
          <Icon name="settings" display="lg" />
        </NuxtLink>
        <span class="doc-count no-mobile">{{ filteredNodes.length != nodes.length ? `${filteredNodes.length} /` : '' }} {{ nodes.length }}</span>
        <ViewSelection v-model="view" :show-kanban="true" />
      </div>
    </header>

    <!-- Content based on view mode -->
    <div v-if="filteredNodes.length" class="node-content">
      <!-- Table/List View -->
      <div v-if="view === 'table'" class="line-container">
        <DocumentLine v-for="document of filteredNodes" :key="document.id" :document="document" class="line-item" />
      </div>

      <!-- Grid View -->
      <div v-else-if="view === 'list'" class="document-list">
        <DocumentsGrid :documents="filteredNodes" />
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
import NodePermissions from '~/components/Node/NodePermissions.modal.vue';
import RemoveSharedNode from '~/components/Node/RemoveSharedNode.modal.vue';
import NodeFilter from '~/components/Node/Filter.vue';
import KanbanBoard, { type KanbanMetadata } from '~/components/Kanban/KanbanBoard.vue';
import NodeMetadataModal from './NodeMetadata.modal.vue';
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

.parent-icon {
  padding: 6px;
  border-radius: 6px;
  margin-right: 10px;
}

.doc-count {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--font-color-light);
  background: var(--bg-contrast);
}

.node-content {
  margin-top: 8px;
}

.line-container {
  display: flex;
  flex-direction: column;
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
