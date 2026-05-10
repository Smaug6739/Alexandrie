<template>
  <div class="page-card" style="height: 100%; overflow: auto">
    <h1>Node advanced view</h1>
    <div v-if="document">
      <div class="columns">
        <div class="column">
          <label for="id">ID</label>
          <input id="id" v-model="document.id" disabled />
        </div>
        <div class="column">
          <label for="user_id">User ID</label>
          <input id="user_id" v-model="document.user_id" disabled />
        </div>
        <div class="column">
          <label for="parent_id">Parent ID</label>
          <input id="parent_id" v-model="document.parent_id" disabled />
        </div>
        <div class="column">
          <label for="size">Size</label>
          <input id="size" v-model="document.size" disabled />
        </div>
      </div>
      <label for="name">Name</label>
      <input id="name" v-model="document.name" />

      <label for="description">Description</label>
      <input id="description" v-model="document.description" />
      <div class="columns">
        <div class="column">
          <label for="tags">Tags</label>
          <input id="tags" v-model="document.tags" />
        </div>
        <div class="column">
          <label for="theme">Theme</label>
          <input id="theme" v-model="document.theme" />
        </div>
        <div class="column">
          <label for="order">Order</label>
          <input id="order" v-model="document.order" />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <label for="role">Role</label>
          <input id="role" v-model="document.role" type="number" />
        </div>
        <div class="column">
          <label for="color">Color</label>
          <input id="color" v-model="document.color" />
        </div>
        <div class="column">
          <label for="accessibility">Accessibility</label>
          <input id="accessibility" v-model="document.accessibility" />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <label for="access">Access</label>
          <input id="access" v-model="document.access" />
        </div>
        <div class="column">
          <label for="display">Display</label>
          <input id="display" v-model="document.display" />
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <label for="icon">Icon</label>
          <input id="icon" v-model="document.icon" />
        </div>
        <div class="column">
          <label for="thumbnail">Thumbnail</label>
          <input id="thumbnail" v-model="document.thumbnail" />
        </div>
      </div>

      <label for="content">Content</label>
      <div style="display: flex; width: 100%; height: 500px; flex: 1; gap: 10px">
        <textarea v-model="document.content" style="height: 500px; flex: 1; overflow: auto"></textarea>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div style="height: 500px; flex: 1; overflow: auto" class="alexandrie-theme" v-html="document.content_compiled" />
      </div>
    </div>

    <div v-else>No document found.</div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Document view' });

const store = useAdminStore();

const route = useRoute();

const document = ref<Node | undefined>();

document.value = await store.fetchUserDocument(route.params.id as string, route.params.doc_id as string);
</script>

<style scoped lang="scss">
label {
  font-weight: bold;
}

button {
  margin-top: 1rem;
}

.columns {
  gap: 10px;
}

.column {
  margin: 0;
}
</style>
