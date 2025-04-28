<template>
  <div style="padding: 24px; gap: 16px" class="card-component">
    <header>
      <h3>Update ressource&nbsp;<tag blue>New</tag></h3>
      Manage ressources and files on the server. You can edit metadata and delete file from the server.
    </header>
    <form @submit.prevent v-if="ressource">
      <div class="form-row">
        <div class="form-column">
          <label>ID</label>
          <input type="text" :value="ressource.id" id="id" disabled />
        </div>
        <div class="form-column">
          <label>Size</label>
          <input type="text" :value="readableFileSize(ressource.filesize)" id="size" disabled />
        </div>
      </div>
      <label>Name</label>
      <input type="text" v-model="ressource.filename" id="name" required />
      <label style="display: flex; align-items: center">Parent <AppHint text="To organize your uploads" /></label>
      <AppSelect v-model="ressource.parent_id" :items="tree" placeholder="Select a ressource parent" />
      <label>Type</label>
      <input type="text" :value="ressource.filetype" id="id" disabled />
      <label>Original path</label>
      <input type="text" :value="ressource.original_path" id="original_path" disabled />
      <label>Path</label>
      <input type="text" :value="ressource.transformed_path" id="path" disabled />
      <p>
        Ressource: <a :href="`${CDN}/${ressource.author_id}/${ressource.transformed_path || ressource.original_path}`" target="_blank">{{ `${CDN}/${ressource.author_id}/${ressource.transformed_path || ressource.original_path}` }}</a>
      </p>
      <div style="display: flex; justify-content: flex-end">
        <AppButton type="primary" class="btn primary" @click="updateCategory">Update</AppButton>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
const ressourcesStore = useRessourcesStore();
const route = useRoute();
const ressource = computed(() => ressourcesStore.getById(route.params.id as string));
const defaultItem: ANode = {
  id: '',
  label: 'None',
  parent_id: '',
  childrens: [],
};
const tree = computed(() => [defaultItem, ...useSidebarTree().tree.value]);

definePageMeta({ breadcrumb: 'Edit' });

const updateCategory = async () => {
  if (ressource.value)
    ressourcesStore
      .update(ressource.value)
      .then(() => {
        useNotifications().add({ type: 'success', title: 'Ressource updated' });
        useRouter().push('/dashboard/cdn');
      })
      .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>

<style scoped lang="scss">
h2 {
  font-size: 26px;
}
label {
  margin-top: 10px;
}
.card-component {
  display: block;
  margin: 2px 0;
  width: 100%;
}
input,
textarea,
select {
  width: 100%;
}
.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.form-column {
  flex: 1;
  min-width: 200px;
}
a {
  color: $primary-color;
  text-decoration: underline;
}
</style>
