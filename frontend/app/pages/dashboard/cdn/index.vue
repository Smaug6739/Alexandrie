<template>
  <div class="page-card">
    <header>
      <h1>{{ t('cdn.meta.title') }}</h1>
      <div class="action-row">
        <NodeFilter v-show="!device.isMobile" :nodes="nodes" @update:nodes="filteredResources = $event" />
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
        {{ selectedFiles.length ? t('cdn.actions.upload.multiple', { n: selectedFiles.length }) : t('cdn.actions.upload.idle') }}
      </AppButton>
      <div v-if="isLoading" class="upload-progress">
        <LoaderSpinner />
        <span>{{ t('cdn.actions.upload.progress', { n: uploadProgress.current, total: uploadProgress.total }) }}</span>
      </div>
    </div>
    <div v-if="fileLinks.length" class="link-section">
      <div class="links-text" v-text="linksText"></div>
      <div class="links-actions">
        <AppButton type="primary" @click="copyLinks">{{ t('common.actions.copy') }} {{ fileLinks.length > 1 ? 'links' : 'link' }}</AppButton>
        <AppButton type="secondary" @click="fileLinks = []">{{ t('common.actions.clear') }}</AppButton>
      </div>
    </div>
    <div v-if="filteredResources.length" class="resources-list">
      <DataTable v-if="view === 'table'" :headers="headers" :rows="rows">
        <template #bulk-actions="{ selected }">
          <div class="bulk-actions">
            <span class="selected-count">{{ selected.length }}</span>
            <span style="height: 32px; border-left: 1px solid var(--border); margin-left: 4px"></span>
            <span @click="bulkDelete(selected)"><Icon name="delete" fill="var(--text-secondary)" class="action-btn" /></span>
          </div>
        </template>
        <template #action="{ cell }">
          <NuxtLink :href="`/dashboard/cdn/${(cell?.data as Node).id}/preview`" style="margin-right: 10px"><Icon name="view" /> </NuxtLink>
          <NuxtLink :to="`/dashboard/cdn/${(cell?.data as Node).id}`"><Icon name="edit" style="margin-right: 10px" /></NuxtLink>
          <span @click="() => deleteResource(cell?.data as Node)"><Icon name="delete" /></span>
        </template>
      </DataTable>
      <div v-else>
        <hr />
        <div class="images-grid">
          <div
            v-for="image in filteredResources"
            :key="image.id"
            class="image-item"
            @click="router.push(`/dashboard/cdn/${image.id}/preview`)"
            @contextmenu="event => showContextMenu(event, image)"
          >
            <img :src="resolvePreviewUrl(image)" :alt="image.name" class="image-preview" />
            <div class="image-info">
              <span class="image-name">{{ image.name }}</span>
              <span class="image-size">{{ readableFileSize(image.size ?? 0) }}</span>
            </div>
          </div>
          <div v-if="!filteredResources.length" class="not-found">
            <p>{{ t('common.search.noResults', { filter: filter }) }}</p>
          </div>
        </div>
      </div>
    </div>
    <NoContent v-else :title="t('cdn.page.empty')"></NoContent>
  </div>
</template>
<script setup lang="ts">
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import ResourceContextMenu from '~/components/Node/Action/ResourceContextMenu.vue';
import { readableFileSize, resolvePreviewUrl } from '~/helpers/resources';
import type { Field } from '~/components/DataTable.vue';
import type { Node } from '~/stores';

const router = useRouter();
const resourcesStore = useResourcesStore();
const nodesStore = useNodesStore();
const { t } = useI18nT();
const device = useDevice();
const appColors = useAppColors();
const { numericDate } = useDateFormatters();
const contextMenu = useContextMenu();
const { resourceURL } = useApi();

const view = ref<'table' | 'list'>('list');
const selectedFiles = ref<File[]>([]);
const fileLinks = ref<string[]>([]);
const isLoading = ref(false);
const uploadProgress = ref({ current: 0, total: 0 });
const dropComponent = ref();
const filter = ref('');

const MAX_STORAGE = 1024 * 1024 * 1024; // 1 GB in bytes

const nodes = computed(() => nodesStore.resources.toArray());
const filteredResources = ref(nodes.value);

const totalUsedSpace = computed(() => nodes.value.reduce((acc, node) => acc + (node.size ?? 0), 0));
const storagePercentage = computed(() => Math.min((totalUsedSpace.value / MAX_STORAGE) * 100, 100));
const linksText = computed(() => fileLinks.value.join('\n'));

function showContextMenu(event: MouseEvent, node: Node) {
  contextMenu.open(shallowRef(ResourceContextMenu), event, {
    props: { node: node },
  });
}

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
      const r = await resourcesStore.post(body);
      fileLinks.value.push(resourceURL(r));
    } catch (e) {
      useNotifications().add({ type: 'error', title: 'Error', message: t('cdn.notifications.error', { file: file.name, error: e }) });
    }
    uploadProgress.value.current++;
  }

  isLoading.value = false;
  if (fileLinks.value.length) {
    useNotifications().add({
      type: 'success',
      title: t('cdn.notifications.successTitle'),
      message: t('cdn.notifications.successMsg', { n: fileLinks.value.length }),
    });
  }
};

const headers = [
  { label: t('common.labels.name'), key: 'name' },
  { label: t('common.labels.size'), key: 'size' },
  { label: t('common.labels.type'), key: 'type' },
  { label: t('common.labels.parent'), key: 'parent' },
  { label: t('common.labels.date'), key: 'date' },
  { label: t('common.labels.action'), key: 'action' },
];

const color = (type: string) => (type.includes('image') ? 'green' : type.includes('video') ? 'blue' : type.includes('pdf') ? 'yellow' : 'red');
const rows: ComputedRef<Field[]> = computed(() =>
  filteredResources.value.map(res => {
    const parent = res.parent_id ? nodesStore.getById(res.parent_id) : null;
    const category = parent ? nodesStore.getById(parent.parent_id || '') : null;
    return {
      name: { content: res.name, type: 'text' },
      size: { content: readableFileSize(res.size ?? 0), type: 'text' },
      type: { content: `<tag class="${color(res.metadata?.filetype || '')}">${res.metadata?.filetype || ''}</tag>`, type: 'html' },
      parent: { content: category ? `<tag class="${appColors.getAppAccent(category.color)}">${parent?.name}</tag>` : '', type: 'html' },
      date: { content: numericDate(res.created_timestamp), type: 'text' },
      action: { type: 'slot', data: res },
    };
  }),
);

const deleteResource = async (node: Node) => {
  useModal().add(new Modal(shallowRef(DeleteNodeModal), { props: { node: node, redirectTo: '/dashboard/cdn' }, size: 'small' }));
};
const bulkDelete = async (lines: Field[]) => {
  const resources = lines.map(line => line.action?.data as Node);
  useModal().add(new Modal(shallowRef(DeleteNodeModal), { props: { nodes: resources, redirectTo: '/dashboard/cdn' }, size: 'small' }));
};
</script>

<style scoped lang="scss">
.storage-indicator {
  display: flex;
  width: 100%;
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  align-items: center;
  gap: 12px;

  .storage-info {
    display: flex;
    min-width: 180px;
    flex-direction: column;
    gap: 2px;

    .storage-label {
      font-size: 12px;
      color: var(--text-secondary);
    }

    .storage-values {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .progress-bar {
    height: 8px;
    border-radius: var(--radius-xs);
    background: var(--surface-transparent);
    flex: 1;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      border-radius: var(--radius-xs);
      background: var(--primary);
      transition: width $transition-medium ease;

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
    color: var(--text-secondary);
    text-align: right;
  }
}

.action-row {
  display: flex;
  align-items: center;
}

.upload-progress {
  display: flex;
  font-size: 14px;
  color: var(--text-secondary);
  align-items: center;
  gap: 10px;
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
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: $font-mono;
    font-size: 13px;
    color: var(--text-primary);
    white-space: pre-wrap;
    word-break: break-all;
  }

  .links-actions {
    display: flex;
    gap: 10px;
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
    background: var(--surface-transparent);
  }
}

.selected-count {
  display: flex;
  width: 32px;
  height: 34px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-secondary);
  align-items: center;
  justify-content: center;
}

.resources-list {
  width: 100%;
}

.not-found {
  color: var(--text-secondary);
  text-align: center;
  grid-column: 1 / -1;
}

.images-grid {
  display: grid;
  padding: 16px 0;
  flex: 1;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}

.image-item {
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
  }

  .image-preview {
    width: 100%;
    height: 150px;
    border-radius: var(--radius-sm);
    object-fit: cover;
  }

  .image-info {
    padding: 12px;

    .image-name {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .image-size {
      display: block;
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}
</style>
