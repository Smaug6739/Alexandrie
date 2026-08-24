<template>
  <div class="line-container" style="padding-top: 10px;">
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
</template>

<script setup lang="ts">
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import { assignParent } from '~/helpers/resources-parent';
import type { Node } from '~/stores';
import type { Field } from '~/components/DataTable.vue';

const props = defineProps<{ nodes: Node[] }>();

const asNode = (data: unknown) => data as Node;
const nodesStore = useNodesStore();
const modals = useModal();
const { getAppAccent } = useAppColors();
const { t } = useI18nT();
const { numericDate } = useDateFormatters();
const notifications = useNotifications();
const tree = useNodesTree();
const parentNodes = tree.getTreeUpToRole(3);

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

const rows: ComputedRef<Field[]> = computed(() =>
  props.nodes.map(res => {
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
</script>

<style scoped lang="scss">
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
</style>
