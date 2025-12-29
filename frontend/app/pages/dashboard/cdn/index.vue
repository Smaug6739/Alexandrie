<template>
  <div class="card-component">
    <header>
      <h1>File manager</h1>
      <div class="action-row">
        <NodeFilter v-show="!isMobile()" :nodes="nodes" @update:nodes="filteredRessources = $event" />
        <ViewSelection v-model="view" />
      </div>
    </header>
    <div class="storage-indicator">
      <div class="storage-info">
        <span class="storage-label">Storage used</span>
        <span class="storage-values">{{ readableFileSize(totalUsedSpace) }} / {{ readableFileSize(MAX_STORAGE) }}</span>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: storagePercentage + '%' }"
          :class="{ warning: storagePercentage > 80, danger: storagePercentage > 95 }"
        ></div>
      </div>
      <span class="storage-percentage">{{ storagePercentage.toFixed(1) }}%</span>
    </div>
    <AppDrop ref="dropComponent" multiple :max-files="10" @select="selectFiles" />
    <div style="display: flex; width: 100%; padding: 12px 0; align-items: center; flex-direction: column; gap: 10px">
      <AppButton type="primary" :disabled="!selectedFiles.length" @click="submitFiles">
        Upload {{ selectedFiles.length ? `${selectedFiles.length} file(s)` : '' }} on server
      </AppButton>
      <div v-if="isLoading" class="upload-progress">
        <LoaderSpinner />
        <span>Uploading {{ uploadProgress.current }} / {{ uploadProgress.total }}</span>
      </div>
    </div>
    <div v-if="fileLinks.length" class="link-section">
      <div v-text="linksText" class="links-text"></div>
      <AppButton type="primary" @click="copyLinks">Copy {{ fileLinks.length > 1 ? 'links' : 'link' }}</AppButton>
    </div>
    <div v-if="filteredRessources.length" class="ressources-list">
      <DataTable v-if="view === 'table'" :headers="headers" :rows="rows">
        <template #bulk-actions="{ selected }">
          <div class="bulk-actions">
            <span class="selected-count">{{ selected.length }}</span>
            <span style="height: 32px; border-left: 1px solid var(--border-color); margin-left: 4px"></span>
            <span @click="bulkDelete(selected)"><Icon name="delete" fill="var(--font-color-light)" class="action-btn" /></span>
          </div>
        </template>
        <template #action="{ cell }">
          <NuxtLink :href="`/dashboard/cdn/${(cell?.data as Node).id}/preview`" style="margin-right: 10px"><Icon name="view" /> </NuxtLink>
          <NuxtLink :to="`/dashboard/cdn/${(cell?.data as Node).id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
          <span @click="() => deleteRessource((cell?.data as Node).id)"><Icon name="delete" /></span>
        </template>
      </DataTable>
      <div v-else>
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
import { readableFileSize } from '~/helpers/ressources';
import type { Field } from '~/components/DataTable.vue';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Upload' });

const router = useRouter();
const ressourcesStore = useRessourcesStore();
const nodesStore = useNodesStore();

const view = ref<'table' | 'list'>('list');
const selectedFiles = ref<File[]>([]);
const fileLinks = ref<string[]>([]);
const isLoading = ref(false);
const uploadProgress = ref({ current: 0, total: 0 });
const dropComponent = ref();
const filter = ref('');
const { CDN } = useApi();

const MAX_STORAGE = 1024 * 1024 * 1024; // 1 GB in bytes

const nodes = computed(() => nodesStore.ressources.toArray());
const filteredRessources = ref(nodes.value);

const totalUsedSpace = computed(() => nodes.value.reduce((acc, node) => acc + (node.size ?? 0), 0));
const storagePercentage = computed(() => Math.min((totalUsedSpace.value / MAX_STORAGE) * 100, 100));
const linksText = computed(() => fileLinks.value.join('\n'));

const selectFiles = (files: File | File[] | null) => {
  if (!files) {
    selectedFiles.value = [];
  } else if (Array.isArray(files)) {
    selectedFiles.value = files;
  } else {
    selectedFiles.value = [files];
  }
};
const copyLinks = () => navigator.clipboard.writeText(fileLinks.value.join('\n'));
const submitFiles = async () => {
  if (!selectedFiles.value.length) return;
  isLoading.value = true;
  fileLinks.value = [];
  uploadProgress.value = { current: 0, total: selectedFiles.value.length };

  const filesToUpload = [...selectedFiles.value];
  selectedFiles.value = [];
  dropComponent.value.reset();

  for (const file of filesToUpload) {
    const body = new FormData();
    body.append('file', file);
    try {
      const r = await ressourcesStore.post(body);
      fileLinks.value.push(`${CDN}/${(r as Node).user_id}/${(r as Node).metadata?.transformed_path as string}`);
    } catch (e) {
      useNotifications().add({ type: 'error', title: 'Error', message: `Failed to upload ${file.name}: ${e}` });
    }
    uploadProgress.value.current++;
  }

  isLoading.value = false;
  if (fileLinks.value.length) {
    useNotifications().add({ type: 'success', title: 'Upload complete', message: `${fileLinks.value.length} file(s) uploaded successfully` });
  }
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
  filteredRessources.value.map(res => {
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
.storage-indicator {
  display: flex;
  width: 100%;
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 8px;
  background: var(--bg-color-secondary);
  align-items: center;
  gap: 12px;

  .storage-info {
    display: flex;
    min-width: 180px;
    flex-direction: column;
    gap: 2px;

    .storage-label {
      font-size: 12px;
      color: var(--font-color-light);
    }

    .storage-values {
      font-size: 14px;
      font-weight: 600;
      color: var(--font-color-dark);
    }
  }

  .progress-bar {
    height: 8px;
    border-radius: 4px;
    background: var(--bg-ui);
    flex: 1;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      border-radius: 4px;
      background: var(--primary);
      transition: width 0.3s ease;

      &.warning {
        background: #f59e0b;
      }

      &.danger {
        background: #ef4444;
      }
    }
  }

  .storage-percentage {
    min-width: 50px;
    font-size: 13px;
    font-weight: 500;
    color: var(--font-color-light);
    text-align: right;
  }
}

.action-row {
  display: flex;
  align-items: center;
}
.upload-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--font-color-light);
}

.link-section {
  display: flex;
  width: 100%;
  margin: 6px 0;
  flex-direction: column;
  gap: 10px;

  .links-text {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-color-secondary);
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: var(--font-color-dark);
    white-space: pre-wrap;
    word-break: break-all;
  }
}

.bulk-actions {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
}

.action-btn {
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

.not-found {
  color: var(--font-color-light);
  text-align: center;
  grid-column: 1 / -1;
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
</style>
