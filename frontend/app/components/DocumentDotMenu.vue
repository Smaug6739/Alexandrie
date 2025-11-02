<template>
  <AppDotMenu ref="dotMenu" @open="() => emit('open')" @close="() => emit('close')">
    <button @click="open"><Icon name="file_open" /> Open</button>
    <NuxtLink :to="`/dashboard/docs/${props.document.id}`" target="_blank"
      ><button><Icon name="new_tab" />Open in new tab</button></NuxtLink
    >
    <button @click="edit"><Icon name="edit_page" /> Edit</button>
    <button @click="copyLink"><Icon name="link" /> Copy link</button>
    <button @click="pin"><Icon :name="document.order === -1 ? 'pin_off' : 'pin'" /> {{ document.order === -1 ? 'Unpin' : 'Pin' }}</button>
    <hr style="margin: 2px 0" />
    <button @click="emitDelete"><Icon name="delete" fill="red" /> Delete</button>
    <hr style="margin: 2px 0" />
    <div class="foot-menu">
      <p style="display: flex; align-items: center; gap: 8px">
        <img :src="useAvatar(user)" alt="Avatar" style="width: 20px; height: 20px; margin: 0; border-radius: 50%" />{{ user?.username }}
      </p>
      <p>Updated on {{ numericDate(document.updated_timestamp) }}</p>
    </div>
  </AppDotMenu>
</template>

<script setup lang="ts">
import type { Node, PublicUser } from '~/stores';

const dotMenu = ref();
const props = defineProps<{ document: Node; user?: PublicUser }>();
const emit = defineEmits<{
  (e: 'open' | 'close' | 'edit' | 'rename' | 'delete'): void;
}>();
defineExpose({ close: () => dotMenu.value?.close() });

const numericDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const open = () => useRouter().push(`/dashboard/docs/${props.document.id}`);
const edit = () => useRouter().push(`/dashboard/docs/edit/${props.document.id}`);
const copyLink = () => {
  const link = `${window.location.origin}/dashboard/docs/${props.document.id}`;
  navigator.clipboard.writeText(link).then(() => {});
};
const emitDelete = () => {
  dotMenu.value?.close();
  emit('delete');
};
const pin = async () => {
  await useNodesStore().update({ ...props.document, order: props.document.order === -1 ? 0 : -1 });
};
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
