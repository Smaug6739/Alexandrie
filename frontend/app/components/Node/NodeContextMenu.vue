<template>
  <button @click="action('open')"><Icon name="file_open" /> Open</button>
  <button @click="action('edit')"><Icon name="edit_page" /> Edit</button>
  <button><Icon name="duplicate" /> Duplicate</button>
  <button @click="action('copyLink')"><Icon name="link" /> Copy link</button>
  <button @click="action('pin')"><Icon :name="node.order === -1 ? 'pin_off' : 'pin'" /> {{ node.order === -1 ? 'Unpin' : 'Pin' }}</button>
  <button v-if="nodeStore.hasPermissions(node, 4)" @click="action('manageAccess')"><Icon name="manage_access" />Manage Access</button>
  <hr />
  <button @click="action('delete')"><Icon name="delete" fill="red" /> Delete</button>
  <button v-if="preferences.get('developerMode').value"><Icon name="snippets" /> Copy ID</button>
  <hr />
  <div class="footer">
    <p style="display: flex; align-items: center; gap: 8px">
      <img :src="useAvatar(user)" alt="Avatar" style="width: 20px; height: 20px; margin: 0; border-radius: 50%" />{{ user?.username }}
    </p>
    <p>Updated on {{ numericDate(node.updated_timestamp) }}</p>
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
const props = defineProps<{ node: Node }>();

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
  }
  emit('close');
}
</script>

<style scoped lang="scss">
button {
  display: flex;
  width: 100%;
  padding: 4px;
  border: none;
  font-family: ui-sans-serif, sans-serif;
  font-size: 14px;
  color: var(--font-color);
  background: none;
  align-items: center;
  cursor: pointer;
  gap: 8px;

  &:hover {
    background-color: var(--bg-contrast);
  }
}

.footer {
  display: flex;
  margin-top: 4px;
  padding: 4px 8px;
  font-size: 0.85rem;
  color: var(--font-color-light);
  flex-direction: column;
  gap: 5px;

  p {
    margin: 0;
  }
}
</style>
