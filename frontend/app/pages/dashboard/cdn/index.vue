<template>
  <div class="card-component">
    <header>
      <h1>File manager</h1>
      <ViewSelection v-model="view" />
    </header>
    <AppDrop ref="dropComponent" @select="selectFile" />
    <div style="display: flex; width: 100%; padding: 12px 0; align-items: center; flex-direction: column; gap: 10px">
      <AppButton type="primary" :disabled="!selectedFile" @click="submitFile">Upload on server</AppButton>
      <div v-if="isLoading" class="loading-spinner" />
    </div>
    <div v-if="fileLink" class="link-section">
      <input v-model="fileLink" type="text" readonly />
      <AppButton type="primary" @click="copyLink">Copy link</AppButton>
    </div>
    <div v-if="ressourcesStore.ressources.length" class="ressources-list">
      <DataTable v-if="view === 'table'" :headers="headers" :rows="rows">
        <template #action="{ cell }">
          <NuxtLink :href="`/dashboard/cdn/${(cell?.data as Node).id}/preview`" style="margin-right: 10px"><Icon name="view" /> </NuxtLink>
          <NuxtLink :to="`/dashboard/cdn/${(cell?.data as Node).id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
          <Icon name="delete" @click="() => deleteRessource((cell?.data as Node).id)" />
        </template>
      </DataTable>
      <div v-else>
        <div class="images-grid">
          <div v-for="image in ressourcesStore.ressources" :key="image.id" class="image-item" @click="router.push(`/dashboard/cdn/${image.id}/preview`)">
            <img :src="fileURL(image)" :alt="image.name" class="image-preview" />
            <div class="image-info">
              <span class="image-name">{{ image.name }}</span>
              <span class="image-size">{{ readableFileSize(image.size ?? 0) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoContent v-else title="No ressource found"></NoContent>
  </div>
</template>
<script setup lang="ts">
import type { Field } from '~/components/DataTable.vue';
import DeleteRessourceModal from './_modals/DeleteRessourceModal.vue';
import type { Node } from '~/stores';
definePageMeta({ breadcrumb: 'Upload' });
const router = useRouter();
const ressourcesStore = useRessourcesStore();
const view = ref<'table' | 'list'>('list');
const selectedFile: Ref<File | undefined> = ref();
const fileLink = ref('');
const isLoading = ref(false);
const selectFile = (file?: File) => (selectedFile.value = file);
const copyLink = () => navigator.clipboard.writeText(fileLink.value!);
const dropComponent = ref();
const submitFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;

  const body = new FormData();
  body.append('file', selectedFile.value);
  selectedFile.value = undefined; // Reset selected file
  dropComponent.value.reset(); // Reset drop component
  await ressourcesStore
    .post(body)
    .then(r => (fileLink.value = `${CDN}/${(r as Node).user_id}/${(r as Node).content_compiled}`))
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }))
    .finally(() => (isLoading.value = false));
};

const fileURL = (ressource: Node) => {
  if ((ressource.metadata!.filetype as string).includes('image/')) return `${CDN}/${ressource.user_id}/${ressource.content_compiled}`;
  return '/file_placeholder.png';
};
const headers = [
  { label: 'Name', key: 'name' },
  { label: 'Size', key: 'size' },
  { label: 'Type', key: 'type' },
  { label: 'Parent doc', key: 'parent' },
  { label: 'Date', key: 'date' },
  { label: 'Action', key: 'action' },
];
const color = (type: string) => (type.includes('image') ? 'green' : type.includes('video') ? 'blue' : type.includes('pdf') ? 'yellow' : 'red');
const rows: ComputedRef<Field[]> = computed(() =>
  ressourcesStore.ressources.map(res => {
    const parent = res.parent_id ? useNodesStore().getById(res.parent_id) : null;
    const category = parent ? useNodesStore().getById(parent.parent_id || '') : null;
    return {
      name: { content: res.name, type: 'text' },
      size: { content: readableFileSize(res.size ?? 0), type: 'text' },
      type: { content: `<tag class="${color(res.metadata!.filetype as string)}">${res.metadata!.filetype as string}</tag>`, type: 'html' },
      parent: { content: category ? `<tag class="${getAppColor(category.color)}">${parent?.name}</tag>` : '', type: 'html' },
      date: { content: new Date(res.created_timestamp).toLocaleDateString(), type: 'text' },
      action: { type: 'slot', data: res },
    };
  }),
);

const deleteRessource = async (id: string) => {
  useModal().add(new Modal(shallowRef(DeleteRessourceModal), { props: { ressourceId: id } }));
};
</script>

<style scoped lang="scss">
.link-section {
  display: flex;
  width: 100%;
  margin: 6px 0;
  flex-direction: column;
  gap: 10px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border-top: 5px solid var(--primary);
}

.ressources-list {
  width: 100%;
}

.images-grid {
  display: grid;
  padding: 16px 0;
  flex: 1;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.image-item {
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 8px 24px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    border-radius: 6px;
    background: var(--bg-color-secondary);
    object-fit: cover;
  }

  .image-info {
    padding: 12px;
    background: var(--bg-color-secondary);

    .image-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--font-color-dark);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .image-size {
      display: block;
      font-size: 12px;
      color: var(--font-color-light);
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
