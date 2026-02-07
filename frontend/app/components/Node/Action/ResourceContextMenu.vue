<template>
  <div class="context-menu">
    <div class="menu-header">
      <img :src="avatarURL(user)" alt="" class="avatar" />
      <div class="header-info">
        <span class="header-name">{{ node.name }}</span>
        <span class="header-meta">{{ user?.username }} · {{ shortDate(node.updated_timestamp) }}</span>
      </div>
    </div>

    <div class="menu-group">
      <button class="menu-item" @click="action('open')"><Icon name="file_open" />Open</button>
      <button class="menu-item" @click="action('edit')"><Icon name="edit_page" />Edit meta</button>
    </div>

    <div class="menu-group">
      <button class="menu-item" @click="action('copyLink')"><Icon name="link" />Copy link</button>
      <button class="menu-item" @click="action('copyMd')"><Icon name="link" />Copy as markdown</button>
    </div>

    <div v-if="nodeStore.hasPermissions(node, 4)" class="menu-group">
      <button class="menu-item" @click="action('manageAccess')"><Icon name="manage_access" />Manage access</button>
    </div>

    <div class="menu-group">
      <button class="menu-item delete" @click="action('delete')"><Icon name="delete" />Move to trash</button>
    </div>

    <div v-if="preferences.get('developerMode').value" class="menu-group">
      <button class="menu-item" @click="action('copyId')"><Icon name="snippets" />Copy ID</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import NodePermissions from '../Modals/Permissions.vue';
import NodeDeleteModal from '../Modals/Delete.vue';
import type { Node } from '~/stores';

const props = defineProps<{ node: Node }>();
const emit = defineEmits(['close']);

const nodeStore = useNodesStore();
const userStore = useUserStore();

const preferences = usePreferences();
const { shortDate } = useDateFormatters();
const { avatarURL, resourceURL } = useApi();

userStore.fetchPublicUser(props.node.user_id);
const user = computed(() => userStore.getById(props.node.user_id || ''));

async function action(name: string) {
  switch (name) {
    case 'open':
      useRouter().push(`/dashboard/docs/${props.node.id}`);
      break;
    case 'edit':
      useRouter().push(`/dashboard/cdn/${props.node.id}`);
      break;
    case 'delete':
      useModal().add(new Modal(shallowRef(NodeDeleteModal), { props: { node: props.node }, size: 'small' }));
      break;
    case 'copyLink':
      navigator.clipboard.writeText(resourceURL(props.node));
      useNotifications().add({ type: 'success', title: 'Link copied to clipboard' });
      break;
    case 'copyMd':
      navigator.clipboard.writeText(`![${props.node.name}](${resourceURL(props.node)})`);
      useNotifications().add({ type: 'success', title: 'Markdown link copied to clipboard' });
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
  color: var(--text-color-primary);
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
  border-radius: $radius-sm;
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

  &.delete {
    color: var(--red);

    :deep(svg) {
      fill: var(--red);
    }
  }
}

@media screen and (width <= 768px) {
  .context-menu {
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
