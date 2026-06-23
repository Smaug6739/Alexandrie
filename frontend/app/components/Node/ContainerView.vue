<template>
  <div class="page-card node-list">
    <Teleport to="#navbar-title">
      <template v-if="parent">
        <Icon :name="parent.icon || 'files'" display="xl" :class="['parent-icon', getAppAccent(parent.color as number, true)]" />
        {{ parent.name }}
      </template>
      <template v-else-if="parentId === 'shared'">
        <Icon name="users" display="xl" class="parent-icon grey" />
        {{ t('nodes.workspace.shared') }}
      </template>
      <template v-else>
        <Icon name="workspace" display="xl" class="parent-icon primary" />
        {{ t('nodes.workspace.all') }}
      </template>
    </Teleport>
    <Teleport to="#navbar-actions">
      <AppBtnIcon nav v-if="view == 'kanban'" icon="reset" :tooltip="t('nodes.actions.resetBoard')" @click="resetKanban" />
      <NodeFilter v-show="!isMobile" :nodes="nodes" @update:nodes="filteredNodes = $event" />
      <AppBtnIcon
        nav
        v-if="parent?.shared && parent.user_id != connectedId"
        icon="group_off"
        :tooltip="t('nodes.actions.removeFromShared')"
        @click="openRemoveShareModal"
      />
      <AppBtnIcon
        nav
        v-if="parent && nodesStore.hasPermissions(parent, 4)"
        icon="manage_access"
        :tooltip="t('nodes.actions.managePermissions')"
        @click="openPermissionsModal"
      />
      <AppBtnIcon nav v-if="parent && nodesStore.hasPermissions(parent, 2)" icon="settings" :tooltip="t('nodes.actions.editMeta')" @click="openEditModal" />
      <AppBtnIcon nav v-if="parent && nodesStore.hasPermissions(parent, 4)" icon="delete" :tooltip="t('common.actions.delete')" @click="openDeleteModal" />
    </Teleport>
    <Teleport to="#navbar-infos">
      <header>
        <span class="doc-count no-mobile">{{ filteredNodes.length != nodes.length ? `${filteredNodes.length} /` : '' }} {{ nodes.length }}</span>
        <ViewSelection v-model="view" :show-kanban="true" />
      </header>
    </Teleport>
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

    <NoContent v-else-if="!nodesStore.isFetching" :title="t('nodes.container.noDocuments')" :description="t('nodes.container.noDocumentsDescription')">
      <NuxtLink to="/dashboard/docs/new">
        <AppButton type="link">{{ t('nodes.container.createNewDocument') }}</AppButton>
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
const userStore = useUserStore();

const { isMobile } = useDevice();
const modals = useModal();
const { getAppAccent } = useAppColors();
const { t } = useI18nT();
const router = useRouter();

const connectedId = userStore.user?.id;
const view = ref<ViewMode>();
const filteredNodes = ref<Node[]>(props.nodes);
const kanbanBoard = ref<InstanceType<typeof KanbanBoard> | null>(null);

// Watch for nodes changes to update filtered nodes
watch(
  () => props.nodes,
  newNodes => (filteredNodes.value = newNodes),
  { immediate: true },
);

// Actions
const resetKanban = () => {
  modals.add(
    new Modal(shallowRef(ResetBoardModal), {
      props: {
        onConfirm: () => kanbanBoard.value?.resetKanbanData(),
      },
      size: 'small',
    }),
  );
};

const openPermissionsModal = () => {
  if (props.parent) modals.add(new Modal(shallowRef(NodePermissions), { props: { node: props.parent }, size: 'small' }));
};
const openRemoveShareModal = () => {
  if (props.parent) modals.add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.parent.id }, size: 'small' }));
};
const openEditModal = () => modals.add(new Modal(shallowRef(NodeMetadataModal), { props: { doc: props.parent }, size: 'small' }));

const openDeleteModal = () => {
  if (props.parent) modals.add(new Modal(shallowRef(NodeDeleteModal), { size: 'small', props: { node: props.parent, redirect: '/dashboard' } }));
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
  display: flex;
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
}
</style>
