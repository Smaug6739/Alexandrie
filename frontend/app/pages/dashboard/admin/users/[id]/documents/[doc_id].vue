<template>
  <div class="card-component" style="height: 100%; overflow: auto; padding: 35px 25px">
    <h1>Node advanced view</h1>
    <div v-if="document" style="display: flex; height: 100%; min-height: 0; flex-direction: column">
      <label for="id">ID</label>
      <input id="id" v-model="document.id" disabled />
      <label for="user_id">User ID</label>
      <input id="user_id" v-model="document.user_id" disabled />
      <label for="parent_id">Parent ID</label>
      <input id="parent_id" v-model="document.parent_id" disabled />
      <label for="name">Name</label>
      <input id="name" v-model="document.name" />
      <label for="description">Description</label>
      <input id="description" v-model="document.description" />
      <label for="tags">Tags</label>
      <input id="tags" v-model="document.tags" />
      <label for="role">Role</label>
      <input id="role" v-model="document.role" type="number" />
      <label for="color">Color</label>
      <input id="color" v-model="document.color" />
      <label for="icon">Icon</label>
      <input id="icon" v-model="document.icon" />
      <label for="thumbnail">Thumbnail</label>
      <input id="thumbnail" v-model="document.thumbnail" />
      <label for="theme">Theme</label>
      <input id="theme" v-model="document.theme" />
      <label for="accessibility">Accessibility</label>
      <input id="accessibility" v-model="document.accessibility" />
      <label for="access">Access</label>
      <input id="access" v-model="document.access" />
      <label for="display">Display</label>
      <input id="display" v-model="document.display" />
      <label for="order">Order</label>
      <input id="order" v-model="document.order" />
      <label for="size">Size</label>
      <input id="size" v-model="document.size" />
      <label for="content">Content</label>
      <div style="display: flex; width: 100%; height: 500px; flex: 1; gap: 10px">
        <textarea v-model="document.content" style="flex: 1; height: 500px; overflow: auto"></textarea>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div style="flex: 1; height: 500px; overflow: auto" class="alexandrie-theme" v-html="document.content_compiled" />
      </div>
    </div>

    <div v-else>No document found.</div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Document view' });
const document = ref<Node | undefined>();
const route = useRoute();
const store = useAdminStore();

document.value = await store.fetchUserDocument(route.params.id as string, route.params.doc_id as string);
</script>

<style scoped lang="scss">
label {
  font-weight: bold;
}

button {
  margin-top: 1rem;
}
</style>
