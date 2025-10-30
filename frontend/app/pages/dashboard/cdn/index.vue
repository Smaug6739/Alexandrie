<template>
  <div class="card-component">
    <header>
      <h1>File manager</h1>
      <ViewSelection v-model="view" />
    </header>
    <AppDrop ref="dropComponent" @select="selectFile" />
    <div style="display: flex; width: 100%; padding: 12px 0; align-items: center; flex-direction: column; gap: 10px">
      <AppButton type="primary" :disabled="!selectedFile" @click="submitFile">Upload on server</AppButton>
      <LoaderSpinner v-if="isLoading" />
    </div>
    <div v-if="fileLink" class="link-section">
      <input v-model="fileLink" type="text" readonly />
      <AppButton type="primary" @click="copyLink">Copy link</AppButton>
    </div>
    <div v-if="sortedRessources.length" class="ressources-list">
      <DataTable v-if="view === 'table'" :headers="headers" :rows="rows">
        <template #bulk-actions="{ selected }">
          <div class="bulk-actions">
            <span class="selected-count">{{ selected.length }}</span>
            <span style="height: 32px; border-left: 1px solid var(--border-color); margin-left: 4px"></span>
            <Icon name="delete" fill="var(--font-color-light)" class="action-btn" @click="bulkDelete(selected)" />
          </div>
        </template>
        <template #action="{ cell }">
          <NuxtLink :href="`/dashboard/cdn/${(cell?.data as Node).id}/preview`" style="margin-right: 10px"><Icon name="view" /> </NuxtLink>
          <NuxtLink :to="`/dashboard/cdn/${(cell?.data as Node).id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
          <Icon name="delete" @click="() => deleteRessource((cell?.data as Node).id)" />
        </template>
      </DataTable>
      <div v-else>
        <FilterBar :filter="filter" :sortKey="sortKey" @update:filter="val => filter = val" @update:sortKey="val => sortKey = val" />
        <hr />
        <div class="images-grid">
          <div v-for="image in filteredRessources" :key="image.id" class="image-item" @click="router.push(`/dashboard/cdn/${image.id}/preview`)">
            <img :src="fileURL(image)" :alt="image.name" class="image-preview" />
            <div class="image-info">
              <span class="image-name">{{ image.name }}</span>
              <span class="image-size">{{ readableFileSize(image.size ?? 0) }}</span>
            </div>
          </div>
          <div v-if="!filteredRessources.length" class="not-found">
            <p>No result found for "{{ filter }}"</p>
          </div>
        </div>
      </div>
    </div>
    <NoContent v-else title="No ressource found"></NoContent>
  </div>
</template>
<script setup lang="ts">
import DeleteRessourceModal from './_modals/DeleteRessourceModal.vue';
import FilterBar from '~/components/FilterBar.vue';
import { readableFileSize } from '~/helpers/ressources';
import type { Field } from '~/components/DataTable.vue';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Upload' });

const router = useRouter();
const ressourcesStore = useRessourcesStore();
const nodesStore = useNodesStore();

const view = ref<'table' | 'list'>('list');
const selectedFile: Ref<File | undefined> = ref();
const fileLink = ref('');
const isLoading = ref(false);
const dropComponent = ref();
const filter = ref('');
const sortKey = ref<'newest' | 'oldest' | 'size_asc' | 'size_desc'>('newest');
const onlyImages = ref(false);
const { CDN } = useApi();

const sortedRessources = computed(() => {
  let arr = nodesStore.ressources.toArray();
  if (sortKey.value === 'newest') {
    arr.sort((a, b) => b.created_timestamp - a.created_timestamp);
  } else if (sortKey.value === 'oldest') {
    arr.sort((a, b) => a.created_timestamp - b.created_timestamp);
  } else if (sortKey.value === 'size_asc') {
    arr.sort((a, b) => (a.size ?? 0) - (b.size ?? 0));
  } else if (sortKey.value === 'size_desc') {
    arr.sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
  }
  return arr;
});

const filteredRessources = computed(() => sortedRessources.value
  .filter(r =>
    (!onlyImages.value || (r.metadata?.filetype || '').includes('image/')) &&
    r.name.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const selectFile = (file?: File) => (selectedFile.value = file);
const copyLink = () => navigator.clipboard.writeText(fileLink.value!);
const submitFile = async () => {
  if (!selectedFile.value) return;
  isLoading.value = true;
  const body = new FormData();
  body.append('file', selectedFile.value);
  selectedFile.value = undefined; // Reset selected file
  dropComponent.value.reset(); // Reset drop component
  await ressourcesStore
    .post(body)
    .then(r => (fileLink.value = `${CDN}/${(r as Node).user_id}/${(r as Node).metadata?.transformed_path as string}`))
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }))
    .finally(() => (isLoading.value = false));
};

const fileURL = (ressource: Node) => {
  if ((ressource.metadata?.filetype as string)?.includes('image/')) return `${CDN}/${ressource.user_id}/${ressource.metadata?.transformed_path as string}`;
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
  sortedRessources.value.map(res => {
    const parent = res.parent_id ? nodesStore.getById(res.parent_id) : null;
    const category = parent ? nodesStore.getById(parent.parent_id || '') : null;
    return {
      name: { content: res.name, type: 'text' },
      size: { content: readableFileSize(res.size ?? 0), type: 'text' },
      type: { content: `<tag class="${color(res.metadata?.filetype as string)}">${res.metadata?.filetype as string}</tag>`, type: 'html' },
      parent: { content: category ? `<tag class="${getAppColor(category.color)}">${parent?.name}</tag>` : '', type: 'html' },
      date: { content: new Date(res.created_timestamp).toLocaleDateString(), type: 'text' },
      action: { type: 'slot', data: res },
    };
  }),
);

const deleteRessource = async (id: string) => {
  useModal().add(new Modal(shallowRef(DeleteRessourceModal), { props: { ressources: [id] }, size: 'small' }));
};
const bulkDelete = async (lines: Field[]) => {
  const ressourcesIds = lines.map(line => (line.action?.data as Node | undefined)?.id).filter((id): id is string => !!id);
  useModal().add(new Modal(shallowRef(DeleteRessourceModal), { props: { ressources: ressourcesIds }, size: 'small' }));
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

.bulk-actions {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  padding: 6px;
  border-radius: 50%;
  transition: background-color 0.1s;
  cursor: pointer;

  &:hover {
    background: var(--bg-ui);
  }
}

.selected-count {
  display: flex;
  width: 32px;
  height: 36px;
  padding: 6px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  font-weight: bold;
  color: var(--font-color-light);
  align-items: center;
  justify-content: center;
}

.ressources-list {
  width: 100%;
}

.search {
  flex: 1;
  padding: 10px 14px;
  border: 1.8px solid var(--border-color);
  border-radius: 8px;
  font-size: 15px;
  background: var(--bg-color-secondary);
  color: var(--font-color-dark);
  outline: none;
  transition: border-color 0.2s ease;
}
.search:focus {
  border-color: var(--primary);
}
.not-found {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--font-color-light);
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
.filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 700px;
  margin-bottom: 14px;
  background: transparent;
  padding: 0;
}

.sort-select {
  border: 1.8px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 34px 8px 10px;
  background: var(--bg-color-secondary);
  font-size: 15px;
  color: var(--font-color-dark);
  cursor: pointer;
  font-weight: 500;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
  appearance: none;
  min-width: 140px;
  max-width: 180px;
}

.sort-select:hover {
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 6px 18px rgba(0,0,0,0.15);
}

.sort-select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 2px var(--primary), 0 6px 20px rgba(0,0,0,0.2);
  color: var(--primary);
}

.select-wrapper {
  position: relative;
}


.select-wrapper::after {
  content: '▾';
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary);
  font-size: 1.6rem;
  pointer-events: none;
}

.sort-select:focus + .select-wrapper::after,
.sort-select:hover + .select-wrapper::after {
  transform: translateY(-50%) rotate(180deg);
  color: var(--primary-dark);
}
.sort-select:hover,
.sort-select:focus {
  border-color: var(--primary);
  background: var(--primary-lightest);
  color: var(--primary);
  outline: none;
}
.select-arrow {
  position: absolute;
  right: 16px;
  top: 52%;
  font-size: 1em;
  color: var(--primary);
  pointer-events: none;
  transform: translateY(-50%) scale(1.14);
  transition: color 0.18s;
}
.select-wrapper:focus-within .select-arrow, .sort-select:focus + .select-arrow {
  color: var(--primary-dark);
}
.image-only-label {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 6px;
  user-select: none;
}
</style>
