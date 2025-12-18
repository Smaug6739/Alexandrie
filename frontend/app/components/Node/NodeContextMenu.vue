<template>
  <div class="context-menu" :class="{ 'is-context-menu': props.contextMenu }">
    <div class="menu-header">
      <img :src="useAvatar(user)" alt="" class="header-avatar" />
      <div class="header-info">
        <span class="header-name">{{ node.name }}</span>
        <span class="header-meta">{{ user?.username }} · {{ formatDate(node.updated_timestamp) }}</span>
      </div>
    </div>

    <div class="menu-group">
      <button class="menu-item" @click="action('open')"><Icon name="file_open" />Open<kbd>Enter</kbd></button>
      <button class="menu-item" @click="action('edit')"><Icon name="edit_page" />Edit<kbd>E</kbd></button>
    </div>

    <div class="menu-group">
      <button class="menu-item" @click="action('duplicate')"><Icon name="duplicate" />Duplicate<kbd>Ctrl+D</kbd></button>
      <button class="menu-item" @click="action('copyLink')"><Icon name="link" />Copy link<kbd>Ctrl+L</kbd></button>
      <button class="menu-item" @click="action('pin')">
        <Icon :name="node.order === -1 ? 'pin_off' : 'pin'" />{{ node.order === -1 ? 'Unpin' : 'Pin to top' }}<kbd>P</kbd>
      </button>
    </div>

    <div v-if="nodeStore.hasPermissions(node, 4)" class="menu-group">
      <button class="menu-item" @click="action('manageAccess')"><Icon name="manage_access" />Manage access</button>
    </div>

    <div class="menu-group">
      <button class="menu-item delete" @click="action('delete')"><Icon name="delete" />Move to trash<kbd>Del</kbd></button>
    </div>

    <div v-if="preferences.get('developerMode').value" class="menu-group">
      <button class="menu-item" @click="action('copyId')"><Icon name="snippets" />Copy ID</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from './NodePermissions.modal.vue';
import NodeDeleteModal from './DeleteNodeModal.vue';
import type { Node } from '~/stores';

const nodeStore = useNodesStore();
const preferences = usePreferences();
const emit = defineEmits(['close']);
const dotMenu = ref();
const props = defineProps<{ node: Node; contextMenu?: boolean }>();

useUserStore().fetchPublicUser(props.node.user_id);
const user = computed(() => useUserStore().getById(props.node.user_id || ''));
defineExpose({ close: () => dotMenu.value?.close() });

async function action(name: string) {
  switch (name) {
    case 'open':
      useRouter().push(`/dashboard/docs/${props.node.id}`);
      break;
    case 'edit':
      useRouter().push(`/dashboard/docs/edit/${props.node.id}`);
      break;
    case 'duplicate':
      nodeStore.duplicate(props.node);
      break;
    case 'delete':
      dotMenu.value?.close();
      useModal().add(new Modal(shallowRef(NodeDeleteModal), { props: { node: props.node }, size: 'small' }));
      break;
    case 'copyLink':
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/docs/${props.node.id}`);
      break;
    case 'pin':
      await useNodesStore().update({ ...props.node, order: props.node.order === -1 ? 0 : -1 });
      break;
    case 'manageAccess':
      useModal().add(new Modal(shallowRef(NodePermissions), { props: { node: props.node }, size: 'small' }));
      break;
    case 'copyId':
      navigator.clipboard.writeText(props.node.id);
      break;
  }
  emit('close');
}
</script>

<style scoped lang="scss">
.context-menu {
  padding: 6px;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 12px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 6px;
}

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.header-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--font-color-dark);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-meta {
  font-size: 11px;
  color: var(--font-color-light);
}

.menu-group {
  padding: 2px 0;

  & + .menu-group {
    border-top: 1px solid var(--border-color);
    margin-top: 2px;
    padding-top: 4px;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 4px 10px;
  border: none;
  border-radius: 8px;
  background: none;
  color: var(--font-color);
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: var(--bg-contrast);
  }

  :deep(svg) {
    width: 16px;
    height: 16px;
    fill: var(--font-color-light);
    flex-shrink: 0;
  }

  kbd {
    margin-left: auto;
    padding: 2px 5px;
    font-family: inherit;
    font-size: 10px;
    color: var(--font-color-light);
    background: var(--bg-contrast);
    border-radius: 4px;
  }

  &.delete {
    color: var(--red);
    :deep(svg) {
      fill: var(--red);
    }
    kbd {
      color: var(--red);
      background: var(--red-bg);
    }
  }
}

@media screen and (max-width: 768px) {
  .context-menu.is-context-menu {
    width: 100%;
    box-shadow: none;
    border: none;
    .menu-item {
      font-size: 16px;
      padding: 12px 16px;
    }
  }
}
</style>
