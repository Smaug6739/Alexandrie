<template>
  <div class="context-menu" :class="{ 'is-context-menu': props.contextMenu }">
    <div class="menu-header">
      <img :src="avatarURL(user)" alt="" class="avatar" />
      <div class="header-info">
        <span class="header-name">{{ node.name }}</span>
        <span class="header-meta">{{ user?.username }} · {{ shortDate(node.updated_timestamp) }}</span>
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

const props = defineProps<{ node: Node; contextMenu?: boolean }>();
const emit = defineEmits(['close']);

const nodeStore = useNodesStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const preferences = usePreferences();
const { shortDate } = useDateFormatters();
const { avatarURL } = useApi();

const dotMenu = ref();

userStore.fetchPublicUser(props.node.user_id);
const user = computed(() => userStore.getById(props.node.user_id || ''));

async function action(name: string) {
  switch (name) {
    case 'open':
      router.push(`/dashboard/docs/${props.node.id}`);
      break;
    case 'edit':
      router.push(`/dashboard/docs/edit/${props.node.id}`);
      break;
    case 'duplicate':
      nodeStore.duplicate(props.node);
      break;
    case 'delete':
      dotMenu.value?.close();
      useModal().add(
        new Modal(shallowRef(NodeDeleteModal), {
          props: { node: props.node },
          size: 'small',
          onClose: r => {
            console.log('Delete modal closed with reason:', r);
            console.log('Current route params:', route.params);
            if (r === 'success' && route.params?.id === props.node.id) navigateTo('/dashboard');
          },
        }),
      );
      break;
    case 'copyLink':
      navigator.clipboard.writeText(`${window.location.origin}/dashboard/docs/${props.node.id}`);
      break;
    case 'pin':
      await nodeStore.update({ ...props.node, order: props.node.order === -1 ? 0 : -1 });
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
  padding: 8px 10px 12px;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  gap: 10px;
  margin-bottom: 6px;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: $radius-sm;
    object-fit: cover;
  }
}

.header-info {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.header-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--font-color-dark);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-meta {
  font-size: 11px;
  color: var(--font-color-light);
}

.menu-group {
  padding: 2px 0;

  & + & {
    border-top: 1px solid var(--border-color);
    margin-top: 2px;
    padding-top: 4px;
  }
}

.menu-item {
  display: flex;
  width: 100%;
  padding: 4px 10px;
  border: none;
  border-radius: $radius-sm;
  font: inherit;
  font-size: 13px;
  color: var(--font-color);
  text-align: left;
  background: none;
  transition: background 0.1s;
  align-items: center;
  cursor: pointer;
  gap: 10px;

  &:hover {
    background: var(--bg-contrast);
  }

  kbd {
    padding: 2px 5px;
    border-radius: 4px;
    font-family: inherit;
    font-size: 10px;
    color: var(--font-color-light);
    background: var(--bg-contrast);
    margin-left: auto;
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

@media screen and (width <= 768px) {
  .context-menu.is-context-menu {
    width: 100%;
    border: none;
    box-shadow: none;

    .menu-item {
      padding: 12px 16px;
      font-size: 16px;
    }
  }
}
</style>
