<template>
  <div class="page-card">
    <Teleport to="#navbar-title"><Icon name="cdn" /> {{ props.title || t('cdn.meta.title') }}</Teleport>

    <Teleport to="#navbar-infos">
      <div class="action-row">
        <NodeFilter v-show="!device.isMobile" :nodes="nodes" @update:nodes="filteredResources = $event" />
        <ViewSelection v-model="view" />
      </div>
    </Teleport>
    <div class="storage-indicator">
      <div class="storage-info">
        <span class="storage-label">{{ t('cdn.storageUsed') }}</span>
        <span class="storage-values">{{ readableFileSize(nodesStore.getTotalUsedStorage) }} / {{ readableFileSize(MAX_STORAGE) }}</span>
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
    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;
 width: 100%; padding: 12px 0">
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
      <DataTable v-if="view === 'table'" ref="dataTable" :headers="headers" :rows="rows">
        <template #bulk-actions="{ selected }">
          <div class="bulk-actions">
            <span class="selected-count">{{ selected.length }}</span>
            <span style="height: 32px; margin-left: 4px;
 border-left: 1px solid var(--border)"></span>
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
            @contextmenu="event => openContextMenu(event, image)"
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
import ResourceContextMenu from '~/components/Node/Action/ResourceContextMenu.vue';
import DeleteNodeModal from '~/components/Node/Modals/Delete.vue';
import { readableFileSize, resolvePreviewUrl } from '~/helpers/resources';
import { resolveNodeColor } from '~/helpers/node';

import type { Field } from '~/components/DataTable.vue';
import type { Node } from '~/stores';

const props = defineProps<{
  parentId?: string;
  title?: string;
}>();

const nodesStore = useNodesStore();
const resourcesStore = useResourcesStore();

const router = useRouter();
const { t } = useI18nT();
const { numericDate } = useDateFormatters();
const { resourceURL } = useApi();
const tree = useNodesTree();
const device = useDevice();
const appColors = useAppColors();
const contextMenu = useContextMenu();
const modals = useModal();
const notifications = useNotifications();

const view = ref<'list' | 'table'>('list');
const dataTable = ref<{ selectedRows: Field[] } | null>(null);
const selectedFiles = ref<File[]>([]);
const fileLinks = ref<string[]>([]);
const isLoading = ref(false);
const uploadProgress = ref({ current: 0, total: 0 });
const dropComponent = ref();
const filter = ref('');

const MAX_STORAGE = 1024 * 1024 * 1024; // 1 GB in bytes

const nodes = computed(() => {
  if (props.parentId)
    return tree
      .getSubtreeAsArray(props.parentId)
      .filter(node => node.data.role === 4)
      .map(i => i.data);
  else return nodesStore.resources;
});
const filteredResources = ref(nodes.value);

const storagePercentage = computed(() => Math.min((nodesStore.getTotalUsedStorage / MAX_STORAGE) * 100, 100));
const linksText = computed(() => fileLinks.value.join('\n'));

// DataTable setup
const headers = [
  { key: 'name', label: t('common.labels.name') },
  { key: 'size', label: t('common.labels.size') },
  { key: 'type', label: t('common.labels.type') },
  { key: 'parent', label: t('common.labels.parent') },
  { key: 'date', label: t('common.labels.date') },
  { key: 'action', label: t('common.labels.action') },
];

const rows: ComputedRef<Field[]> = computed(() =>
  filteredResources.value.map(res => {
    const parent = res.parent_id ? nodesStore.getById(res.parent_id) : null;
    const category = parent ? nodesStore.getById(parent.parent_id || '') : null;
    return {
      action: { data: res, type: 'slot' },
      date: { content: numericDate(res.created_timestamp), type: 'text' },
      name: { content: res.name, type: 'text' },
      parent: { content: category ? `<tag class="${appColors.getAppAccent(category.color)}">${parent?.name}</tag>` : '', type: 'html' },
      size: { content: readableFileSize(res.size ?? 0), type: 'text' },
      type: { content: `<tag class="${resolveNodeColor(res.metadata?.filetype || '')}">${res.metadata?.filetype || ''}</tag>`, type: 'html' },
    };
  }),
);

// Actions
const selectFiles = (files: File | File[] | null) => {
  if (Array.isArray(files)) {
    selectedFiles.value = files;
  } else if (files) {
    selectedFiles.value = [files];
  }
};

const openContextMenu = (event: MouseEvent, node: Node) => {
  if (!node) return;
  contextMenu.open(shallowRef(ResourceContextMenu), event, {
    props: { node: node },
  });
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
    if (props.parentId) body.append('parent_id', props.parentId);
    try {
      const r = await resourcesStore.post(body);
      fileLinks.value.push(resourceURL(r));
    } catch (e) {
      notifications.add({ message: t('cdn.notifications.error', { error: e, file: file.name }), title: 'Error', type: 'error' });
    }
    uploadProgress.value.current++;
  }

  isLoading.value = false;
  if (fileLinks.value.length) {
    notifications.add({
      message: t('cdn.notifications.successMsg', { n: fileLinks.value.length }),
      title: t('cdn.notifications.successTitle'),
      type: 'success',
    });
  }
};

const deleteResource = async (node: Node) => {
  modals.add(new Modal(shallowRef(DeleteNodeModal), { props: { node: node, redirectTo: '/dashboard/cdn' }, size: 'small' }));
};
const bulkDelete = async (lines: Field[]) => {
  const resources = lines.map(line => line.action?.data as Node);
  modals.add(new Modal(shallowRef(DeleteNodeModal), { props: { nodes: resources, redirectTo: '/dashboard/cdn' }, size: 'small' }));
};

// Shortcuts
function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Delete') return;
  if (view.value !== 'table') return;
  const selected = dataTable.value?.selectedRows ?? [];
  if (!selected.length) return;
  event.preventDefault();
  bulkDelete(selected);
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
.storage-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 12px 0;
  padding: 12px 16px;
  border-radius: var(--radius-md);

  .storage-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 180px;

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
    flex: 1;
    height: 8px;
    border-radius: var(--radius-xs);
    background: var(--surface-transparent);
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
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

.link-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin: 6px 0;

  .links-text {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: $font-mono;
    font-size: 13px;
    color: var(--text-primary);
    word-break: break-all;
    white-space: pre-wrap;
  }

  .links-actions {
    display: flex;
    gap: 10px;
  }
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.action-btn {
  cursor: pointer;

  &:hover {
    background: var(--surface-transparent);
  }
}

.selected-count {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 34px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-xs);
  font-size: 12px;
  font-weight: bold;
  color: var(--text-secondary);
}

.resources-list {
  width: 100%;
}

.not-found {
  grid-column: 1 / -1;
  color: var(--text-secondary);
  text-align: center;
}

.images-grid {
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  padding: 16px 0;
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
      margin-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .image-size {
      display: block;
      font-size: 12px;
      color: var(--text-secondary);
    }
  }
}
</style>
