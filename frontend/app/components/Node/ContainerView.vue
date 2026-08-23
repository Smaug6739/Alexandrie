<template>
  <div class="page-card node-list">
    <Teleport to="#navbar-title">
      <template v-if="slots.title">
        <slot name="title" />
      </template>
      <template v-else-if="parent">
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
      <AppBtnIcon v-if="view == 'kanban'" nav icon="reset" :tooltip="t('nodes.actions.resetBoard')" @click="resetKanban" />
      <NodeFilter :nodes="nodes" @update:nodes="filteredNodes = $event" />
      <AppBtnIcon
        v-if="parent?.shared && parent.user_id != connectedId"
        nav
        icon="group_off"
        :tooltip="t('nodes.actions.removeFromShared')"
        @click="openRemoveShareModal"
      />
      <AppBtnIcon
        v-if="parent && nodesPermissionsStore.hasPermissions(parent, 4)"
        nav
        icon="manage_access"
        :tooltip="t('nodes.actions.managePermissions')"
        @click="openPermissionsModal"
      />
      <AppBtnIcon
        v-if="parent && nodesPermissionsStore.hasPermissions(parent, 2)"
        nav
        icon="settings"
        :tooltip="t('nodes.actions.editMeta')"
        @click="openEditModal"
      />
      <AppBtnIcon
        v-if="parent && nodesPermissionsStore.hasPermissions(parent, 4)"
        nav
        icon="delete"
        :tooltip="t('common.actions.delete')"
        @click="openDeleteModal"
      />
    </Teleport>
    <Teleport to="#navbar-infos">
      <header>
        <span class="doc-count no-mobile">{{ filteredNodes.length != nodes.length ? `${filteredNodes.length} /` : '' }} {{ nodes.length }}</span>
        <ViewSelection v-model="view" :show-kanban="true" />
      </header>
    </Teleport>
    <!-- Content based on view mode -->
    <div v-if="filteredNodes.length" class="node-content">
      <!-- Advanced DataTable View -->
      <div v-if="view === 'advanced'" class="line-container" style="padding-top: 10px;">
        <DataTable ref="tableRef" :headers="headers" :rows="rows">
          <template #bulk-actions="{ selected }">
            <div class="bulk-actions">
              <span class="selected-count">{{ selected.length }}</span>
              <span class="divider" />
              <AppSelect
                v-model="bulkParentId"
                :items="parentNodes"
                :placeholder="t('common.placeholder.parent')"
                size="240px"
                @update:model-value="parentId => bulkSetParent(selected, parentId)"
              />
              <span class="divider" />
              <span @click="bulkDelete(selected)"><Icon name="delete" fill="var(--text-secondary)" class="action-btn" /></span>
            </div>
          </template>
          <template #name="{ cell }">
            <div style="display:flex;align-items:center;gap:8px;">
              <Icon :name="asNode(cell?.data)?.icon || 'files'" />
              <NuxtLink :to="`/dashboard/docs/${asNode(cell?.data)?.id}`">{{ asNode(cell?.data)?.name }}</NuxtLink>
            </div>
          </template>
          <template #tags="{ cell }">
            <NodeTagList v-if="cell?.data" :tags="asNode(cell.data).tags" class="tags" />
          </template>
          <template #action="{ cell }">
            <NuxtLink :to="`/dashboard/docs/${asNode(cell?.data)?.id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
            <span style="cursor: pointer" @click="() => deleteNode(asNode(cell?.data))"><Icon name="delete" /></span>
          </template>
        </DataTable>
      </div>

      <!-- Table/List View -->
      <div v-else-if="view === 'table'" class="line-container">
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

      <!-- Fallback View (Just in case view is undefined or unrecognized) -->
      <div v-else class="line-container fallback-view">
        <div style="padding: 20px; color: red;">DEBUG: View is unrecognized or undefined. Current value: {{ view }}</div>
        <NodeListInline v-for="document of filteredNodes" :key="document.id" :document="document" class="line-item" />
      </div>
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
import { assignParent } from '~/helpers/resources-parent';
import type { ViewMode } from '~/components/ViewSelection.vue';
import type { Node } from '~/stores';
import type { Field } from '~/components/DataTable.vue';

const props = defineProps<{ parent?: Node; nodes: Node[]; parentId?: string }>();

const asNode = (data: unknown) => data as Node;

const nodesStore = useNodesStore();
const nodesPermissionsStore = useNodesPermissionsStore();
const userStore = useUserStore();

const modals = useModal();
const { getAppAccent } = useAppColors();
const { t } = useI18nT();
const router = useRouter();
const slots = useSlots();
const { numericDate } = useDateFormatters();
const notifications = useNotifications();
const tree = useNodesTree();
const parentNodes = tree.getTreeUpToRole(3);

const connectedId = userStore.user?.id;
const tableRef = ref<{ selectedRows: Field[] } | null>(null);
const bulkParentId = ref<string | number>('');

const headers = [
  { key: 'name', label: t('common.labels.name') },
  { key: 'type', label: t('common.labels.type') },
  { key: 'parent', label: t('common.labels.parent') },
  { key: 'tags', label: 'Tags' },
  { key: 'date', label: t('common.labels.date') },
  { key: 'action', label: t('common.labels.action') },
];
const view = ref<ViewMode>();
const filteredNodes = ref<Node[]>(props.nodes);
const kanbanBoard = ref<InstanceType<typeof KanbanBoard> | null>(null);

// Watch for nodes changes to update filtered nodes
watch(
  () => props.nodes,
  newNodes => (filteredNodes.value = newNodes),
  { immediate: true },
);

const rows: ComputedRef<Field[]> = computed(() =>
  filteredNodes.value.map(res => {
    const parent = res.parent_id ? nodesStore.getById(res.parent_id) : null;
    return {
      action: { data: res, type: 'slot' },
      date: { content: numericDate(res.updated_timestamp), type: 'text' },
      name: { data: res, type: 'slot' },
      parent: { content: parent ? `<tag class="${getAppAccent(parent.color as number, true)}">${parent.name}</tag>` : '', type: 'html' },
      tags: { data: res.tags, type: 'slot' },
      type: { content: `<tag class="primary">Document</tag>`, type: 'html' },
    };
  }),
);

// Actions
const bulkDelete = async (lines: Field[]) => {
  const nodes = lines.map(line => line.action?.data as Node);
  modals.add(new Modal(shallowRef(NodeDeleteModal), { props: { nodes: nodes, redirectTo: '/dashboard' }, size: 'small' }));
};

const bulkSetParent = async (lines: Field[], parentId: string | number) => {
  if (!parentId) return;
  const nodesToUpdate = assignParent(
    lines.map(line => line.action?.data as Node),
    parentId as string,
  );
  try {
    await Promise.all(nodesToUpdate.map(node => nodesStore.update(node)));
    bulkParentId.value = '';
    if (tableRef.value) tableRef.value.selectedRows = [];
    notifications.add({ title: t('common.actions.update'), type: 'success' });
  } catch (e) {
    notifications.add({ message: String(e), title: 'Error', type: 'error' });
  }
};

const deleteNode = (node: Node) => {
  modals.add(new Modal(shallowRef(NodeDeleteModal), { props: { node: node, redirectTo: '/dashboard' }, size: 'small' }));
};

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
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
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

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.action-btn {
  cursor: pointer;

  &:hover {
    background: var(--surface-transparent);
  }
}

.selected-count {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 34px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-secondary);
}

.divider {
  height: 32px;
  margin-left: 4px;
  border-left: 1px solid var(--border);
}

.line-container {
  display: flex;
  flex-direction: column;
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.line-item:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.line-item:last-child {
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
}

@media screen and (width <= 768px) {
  .parent-icon {
    margin-right: 0;
  }
}
</style>
