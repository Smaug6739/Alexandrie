<template>
  <div>
    <button @click="action('open')"><Icon name="file_open" /> Open</button>
    <NuxtLink :to="`/dashboard/docs/${props.node.id}`" target="_blank"
      ><button><Icon name="new_tab" />Open in new tab</button></NuxtLink
    >
    <template v-if="nodesStore.hasPermissions(node, 2)">
      <button @click="action('edit')"><Icon name="edit_page" /> Edit</button>
      <button @click="action('pin')"><Icon :name="node.order === -1 ? 'pin_off' : 'pin'" /> {{ node.order === -1 ? 'Unpin' : 'Pin' }}</button>
      <button @click="action('duplicate')"><Icon name="duplicate" /> Duplicate</button>
    </template>
    <button @click="action('copyLink')"><Icon name="link" /> Copy link</button>
    <button v-if="preferences.get('developerMode').value" @click="action('copyId')"><Icon name="snippets" /> Copy ID</button>
    <template v-if="nodesStore.hasPermissions(node, 2)">
      <hr style="margin: 2px 0" />
      <button @click="action('delete')"><Icon name="delete" fill="red" /> Delete</button>
    </template>
    <hr style="margin: 2px 0" />
    <div class="foot-menu">
      <p style="display: flex; align-items: center; gap: 8px">
        <img :src="useAvatar(user)" alt="Avatar" style="width: 20px; height: 20px; margin: 0; border-radius: 50%" />{{ user?.username }}
      </p>
      <p>Updated on {{ numericDate(node.updated_timestamp) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node, PublicUser } from '~/stores';
import DeleteDocumentModal from '~/components/Node/DeleteNodeModal.vue';
const props = defineProps<{ node: Node }>();
const emit = defineEmits(['close']);
const user = ref<PublicUser | null>(null);

const userStore = useUserStore();
const nodesStore = useNodesStore();
const preferences = usePreferences();

watchEffect(async () => {
  if (props.node) user.value = await userStore.fetchPublicUser(props.node.user_id);
});

const numericDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

function action(actionName: string) {
  if (actionName === 'open') useRouter().push(`/dashboard/docs/${props.node.id}`);
  else if (actionName === 'edit') useRouter().push(`/dashboard/docs/edit/${props.node.id}`);
  else if (actionName === 'copyLink') {
    const link = `${window.location.origin}/dashboard/docs/${props.node.id}`;
    navigator.clipboard.writeText(link);
  } else if (actionName === 'copyId') {
    navigator.clipboard.writeText(props.node.id);
  } else if (actionName === 'duplicate') {
    nodesStore.duplicate(props.node);
  } else if (actionName === 'delete') {
    useModal().add(new Modal(shallowRef(DeleteDocumentModal), { props: { documentId: props.node.id } }));
    emit('close');
  } else if (actionName === 'pin') {
    nodesStore.update({ ...props.node, order: props.node.order === -1 ? 0 : -1 });
  }
  emit('close');
}
</script>

<style scoped lang="scss">
button {
  display: flex;
  width: 100%;
  padding: 6px 8px;
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

.foot-menu {
  display: flex;
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
