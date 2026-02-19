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
      <button class="menu-item" @click="action('open')"><Icon name="file_open" />{{ t('common.actions.open') }}<kbd>Enter</kbd></button>
      <button class="menu-item" @click="action('edit')"><Icon name="edit_page" />{{ t('common.actions.edit') }}<kbd>E</kbd></button>
    </div>

    <div class="menu-group">
      <button class="menu-item" @click="action('duplicate')"><Icon name="duplicate" />{{ t('common.actions.duplicate') }}<kbd>Ctrl+D</kbd></button>
      <button class="menu-item" @click="action('copyLink')"><Icon name="link" />{{ t('common.actions.copyLink') }}<kbd>Ctrl+L</kbd></button>
      <button class="menu-item" @click="action('pin')">
        <Icon :name="node.order === -1 ? 'pin_off' : 'pin'" />{{ node.order === -1 ? t('common.actions.unpin') : t('common.actions.pin') }}<kbd>P</kbd>
      </button>
    </div>

    <div v-if="nodeStore.hasPermissions(node, 4)" class="menu-group">
      <button class="menu-item" @click="action('manageAccess')"><Icon name="manage_access" />{{ t('nodes.actions.managePermissions') }}</button>
    </div>

    <div class="menu-group">
      <button class="menu-item delete" @click="action('delete')"><Icon name="delete" />{{ t('common.actions.delete') }}<kbd>Del</kbd></button>
    </div>

    <div v-if="developerMode" class="menu-group">
      <button class="menu-item" @click="action('copyId')"><Icon name="snippets" />{{ t('common.actions.copy') }} {{ t('common.labels.id') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from '../Modals/Permissions.vue';
import NodeDeleteModal from '../Modals/Delete.vue';
import type { Node } from '~/stores';

const props = defineProps<{ node: Node; contextMenu?: boolean }>();
const emit = defineEmits(['close']);

const nodeStore = useNodesStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const preferences = usePreferences();
const { t } = useI18nT();
const { shortDate } = useDateFormatters();
const { avatarURL } = useApi();

userStore.fetchPublicUser(props.node.user_id);
const user = computed(() => userStore.getById(props.node.user_id || ''));
const developerMode = preferences.get('developerMode');

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
      useModal().add(
        new Modal(shallowRef(NodeDeleteModal), {
          props: { node: props.node, redirectTo: route.params?.id === props.node.id ? '/dashboard' : undefined },
          size: 'small',
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
  border-bottom: 1px solid var(--border);
  gap: 10px;
  margin-bottom: 6px;

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
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
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

.menu-group {
  padding: 2px 0;

  & + & {
    border-top: 1px solid var(--border);
    margin-top: 2px;
    padding-top: 4px;
  }
}

.menu-item {
  display: flex;
  width: 100%;
  padding: 4px 10px;
  border: none;
  border-radius: var(--radius-sm);
  font: inherit;
  font-size: 13px;
  color: var(--text-body);
  text-align: left;
  background: none;
  transition: background 0.1s;
  align-items: center;
  cursor: pointer;
  gap: 10px;

  &:hover {
    background: var(--surface-raised);
  }

  kbd {
    padding: 2px 5px;
    font-size: 10px;
    color: var(--text-secondary);
    background: var(--surface-raised);
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
