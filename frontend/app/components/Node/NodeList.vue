<template>
  <div class="card-component">
    <header>
      <h1 v-if="parent">
        <Icon
          :name="parent.icon || parent?.icon || 'files'"
          display="xl"
          :class="`parent-icon ${getAppColor(parent.color || parent?.color as number, true)}`"
        />
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
      <div style="display: flex; align-items: center; gap: 4px">
        <NodeFilter v-show="!isMobile()" :nodes="nodes" @update:nodes="filteredNodes = $event" />
        <NuxtLink v-if="parent?.shared && parent.user_id != connectedId" class="btn-icon no-mobile" @click="openRemoveShareModal"
          ><Icon name="group_off" display="lg"
        /></NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 4)" class="btn-icon no-mobile" @click="openPermissionsModal"
          ><Icon name="manage_access" display="lg"
        /></NuxtLink>
        <NuxtLink v-if="parent && nodesStore.hasPermissions(parent, 2)" class="btn-icon" :to="`/dashboard/categories/${parent?.id}/edit`"
          ><Icon name="settings" display="lg"
        /></NuxtLink>
        <span class="doc-count no-mobile">{{ filteredNodes.length != nodes.length ? `${filteredNodes.length} /` : '' }} {{ nodes.length }} </span>
        <ViewSelection v-model="view" />
      </div>
    </header>
    <div v-if="filteredNodes.length">
      <div v-if="view == 'table'" class="line-container">
        <DocumentLine v-for="document of filteredNodes" :key="document.id" :document="document" class="line-item" />
      </div>
      <div v-else class="document-list">
        <DocumentsGrid :documents="filteredNodes" />
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
import NodePermissions from '~/components/Node/NodePermissions.modal.vue';
import RemoveSharedNode from '~/components/Node/RemoveSharedNode.modal.vue';
import NodeFilter from '~/components/Node/Filter.vue';
import type { Node } from '~/stores';

const props = defineProps<{ parent?: Node; nodes: Node[]; parentId?: string }>();
const nodesStore = useNodesStore();
const connectedId = useUserStore().user?.id;

const view: Ref<'table' | 'list'> = ref('list');
const filteredNodes = ref<Node[]>(props.nodes);

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
  padding: 4px 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
}

.parent-icon {
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
