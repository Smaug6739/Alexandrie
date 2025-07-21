<template>
  <AppDotMenu ref="dotMenu">
    <button @click="open"><Icon name="file_open" /> Open</button>
    <button @click="edit"><Icon name="edit_page" /> Edit</button>
    <button @click="copyLink"><Icon name="link" /> Copy link</button>
    <button @click="emitDelete"><Icon name="delete" fill="red" /> Delete</button>
    <hr style="margin: 2px 0" />
    <div class="foot-menu">
      <p style="display: flex; align-items: center; gap: 8px"><img :src="useAvatar(user)" alt="Avatar" style="width: 20px; height: 20px; border-radius: 50%; margin: 0" />{{ user?.username }}</p>
      <p>Updated on {{ numericDate(document.updated_timestamp) }}</p>
    </div>
  </AppDotMenu>
</template>

<script setup lang="ts">
import type { Document, User } from '~/stores';

const dotMenu = ref();
const props = defineProps<{ document: Document; user?: User }>();
const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'edit'): void;
  (e: 'rename'): void;
  (e: 'delete'): void;
}>();
defineExpose({ close: () => dotMenu.value?.close() });

const numericDate = (timestamp: string): string => {
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
</script>

<style scoped lang="scss">
button {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  width: 100%;
  gap: 8px;
  border: none;
  background: none;
  font-size: 14px;
  font-family: ui-sans-serif, sans-serif;
  cursor: pointer;
  color: var(--font-color);
  &:hover {
    background-color: var(--bg-contrast);
  }
}
.foot-menu {
  font-size: 0.85rem;
  color: var(--font-color-light);
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  p {
    margin: 0;
  }
}
</style>
