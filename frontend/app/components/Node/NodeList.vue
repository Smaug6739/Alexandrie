<template>
  <div class="card-component">
    <header>
      <h1 v-if="parent">
        <Icon :name="parent.icon || parent?.icon || 'files'" :class="`parent-icon ${getAppColor(parent.color || parent?.color as number, true)}`" />
        {{ parent.name }}
      </h1>
      <h1 v-else-if="parentId === 'shared'">
        <Icon name="users" :class="`parent-icon grey`" />
        All workspaces
      </h1>
      <h1 v-else>
        <Icon name="workspace" :class="`parent-icon primary`" />
        All workspaces
      </h1>
      <div style="display: flex; align-items: center; gap: 8px">
        <NuxtLink v-if="parent?.shared && parent.user_id != connectedId" @click="openRemoveShareModal"
          ><Icon name="group_off" :big="true" fill="var(--font-color)"
        /></NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 4)" @click="openPermissionsModal"
          ><Icon name="manage_access" :big="true" fill="var(--font-color)"
        /></NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 2)" :to="`/dashboard/categories/${parent?.id}/edit`"
          ><Icon name="settings" :big="true" fill="var(--font-color)"
        /></NuxtLink>
        <span class="doc-count">{{ nodes.length }}</span>
        <ViewSelection v-model="view" />
      </div>
    </header>
    <div v-if="nodes.length">
      <div v-if="view == 'table'" class="line-container">
        <DocumentLine v-for="document of nodes" :key="document.id" :document="document" class="line-item" />
      </div>
      <div v-else class="document-list">
        <DocumentsGrid :documents="nodes" />
      </div>
    </div>
    <NoContent
      v-else-if="!nodesStore.isFetching"
      style="width: 100%; height: 100%"
      title="No documents found"
      description="There are no documents in this category"
      ><NuxtLink to="/dashboard/docs/new"><AppButton type="link" style="font-weight: bold">+ Create new document </AppButton></NuxtLink>
    </NoContent>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from '@/components/Node/NodePermissions.modal.vue';
import RemoveSharedNode from '@/components/Node/RemoveSharedNode.modal.vue';
import type { Node } from '~/stores';

const props = defineProps<{ parent?: Node; nodes: Node[]; parentId?: string }>();
const nodesStore = useNodesStore();
const connectedId = useUserStore().user?.id;

const view: Ref<'table' | 'list'> = ref('list');

const openPermissionsModal = () => {
  if (props.parent) useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: props.parent }, size: 'small' }));
};
const openRemoveShareModal = () => {
  if (props.parent) useModal().add(new Modal(shallowRef(RemoveSharedNode), { props: { nodeId: props.parent.id }, size: 'small' }));
};
</script>

<style scoped lang="scss">
h1 {
  display: flex;
  align-items: center;
}

.doc-count {
  font-weight: bold;
  font-size: 1rem;
  border-radius: 4px;
  padding: 4px 6px;
  border: 1px solid var(--border-color);
}

.parent-icon {
  width: 30px;
  height: 30px;
  padding: 6px;
  border-radius: 6px;
  margin-right: 10px;
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
</style>
