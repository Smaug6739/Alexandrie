<template>
  <div class="page-card">
    <h2 class="page-title"><Icon name="share" /> {{ t('nodes.share.title') }}</h2>
    <p class="page-subtitle">{{ t('nodes.share.description') }}</p>

    <Loader v-if="loading" />

    <div v-else class="share-content">
      <h2>{{ t('nodes.share.sharedContent') }}</h2>
      <!-- Shared text / URL preview -->
      <section v-if="sharedText || sharedUrl" class="share-section">
        <div class="preview-card">
          <h3 v-if="sharedTitle">{{ sharedTitle }}</h3>
          <p v-if="sharedText" class="shared-text">{{ sharedText }}</p>
          <a v-if="sharedUrl" :href="sharedUrl" target="_blank" rel="noopener" class="shared-url">
            {{ sharedUrl }}
          </a>
        </div>
      </section>

      <!-- Shared files preview -->
      <section v-if="sharedFiles.length" class="share-section">
        <div class="files-grid">
          <FileInline v-for="(file, index) in sharedFiles" :key="index" :file="file" :remove-file="() => removeFile(index)" class="file-card" />
        </div>
      </section>

      <section>
        <label>{{ t('nodes.share.chooseDestination') }}</label>
        <AppSelect v-model="parentId" :items="categories" nullable placeholder="Select a workspace or category (optional)" />
      </section>

      <!-- Action: create note or upload files -->
      <section class="share-actions">
        <h2>{{ t('nodes.share.actionChoose') }}</h2>

        <!-- Create note from shared content -->
        <div class="action-card" @click="createNote">
          <div class="action-icon">
            <Icon name="document" />
          </div>
          <div class="action-info">
            <h3>{{ t('nodes.share.actionCreateDocument') }}</h3>
            <p>{{ t('nodes.share.actionCreateDocumentDesc') }}</p>
          </div>
        </div>

        <!-- Upload files if there are shared files -->
        <div v-if="sharedFiles.length" class="action-card" @click="uploadFiles">
          <div class="action-icon">
            <Icon name="upload" />
          </div>
          <div class="action-info">
            <h3>{{ t('nodes.share.actionUploadResource') }}</h3>
            <p>{{ t('nodes.share.actionUploadResourceDesc') }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'common.actions.share' } });

const nodesStore = useNodesStore();
const resourcesStore = useResourcesStore();

const { t } = useI18nT();
const notifications = useNotifications();
const router = useRouter();
const nodesTree = useNodesTree();
const route = useRoute();

const loading = ref(true);
const sharedTitle = ref('');
const sharedText = ref('');
const sharedUrl = ref('');
const sharedFiles = ref<File[]>([]);
const parentId = ref<string | undefined>(undefined);
const processing = ref(false);

const categories = nodesTree.treeUpToRole(2);

onMounted(async () => {
  await retrieveSharedData();
  loading.value = false;
});

/**
 * Retrieve shared data from the service worker cache (POST share)
 * or from URL query params (GET share fallback)
 */
async function retrieveSharedData() {
  // Try to get data from the service worker cache (POST with files)
  try {
    const cache = await caches.open('share-target-cache');
    const cachedResponse = await cache.match('/share-target-data');

    if (!cachedResponse) throw new Error('No cached share data found');
    const formData = await cachedResponse.formData();

    sharedTitle.value = formData.get('title')?.toString() || '';
    sharedText.value = formData.get('text')?.toString() || '';
    sharedUrl.value = formData.get('url')?.toString() || '';

    sharedFiles.value = formData.getAll('files') as File[];

    // Clean up cache after reading
    await cache.delete('/share-target-data');
  } catch (e) {
    console.warn('[share-target] Could not read from cache:', e);
  }

  // Fallback: URL query params (GET share, or simple text share)
  if (!sharedTitle.value && route.query.title) sharedTitle.value = route.query.title as string;
  if (!sharedText.value && route.query.text) sharedText.value = route.query.text as string;
  if (!sharedUrl.value && route.query.url) sharedUrl.value = route.query.url as string;
}

function removeFile(index: number) {
  sharedFiles.value.splice(index, 1);
}

/** Build markdown content from shared data */
function buildMarkdownContent(): string {
  const parts: string[] = [];

  if (sharedText.value) {
    parts.push(sharedText.value);
  }

  if (sharedUrl.value) {
    parts.push(`[${sharedUrl.value}](${sharedUrl.value})`);
  }

  // If text files were shared, include their content
  // (handled async in createNote)
  return parts.join('\n\n');
}

async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function createNote() {
  if (processing.value) return;
  processing.value = true;

  try {
    let content = buildMarkdownContent();
    const title = sharedTitle.value || sharedText.value?.slice(0, 50) || 'Shared note';

    // Append text file contents to the note
    for (const sharedFile of sharedFiles.value) {
      if (sharedFile.type.startsWith('text/') || sharedFile.name.endsWith('.md') || sharedFile.name.endsWith('.txt')) {
        const text = await readTextFile(sharedFile);
        content += `\n\n---\n\n## ${sharedFile.name}\n\n${text}`;
      }
    }

    const doc: Partial<Node> = {
      accessibility: 1,
      content: content,
      name: title,
      parent_id: parentId.value || undefined,
      role: 3,
    };

    const created = await nodesStore.post(doc);
    notifications.add({ title: 'Document created from shared content', type: 'success' });

    // Upload non-text files as resources linked to this note
    const nonTextFiles = sharedFiles.value.filter(f => !f.type.startsWith('text/') && !f.name.endsWith('.md') && !f.name.endsWith('.txt'));

    for (const sharedFile of nonTextFiles) {
      try {
        const formData = new FormData();
        formData.append('file', sharedFile);
        formData.append('parent_id', created.id);
        await resourcesStore.post(formData);
      } catch (e) {
        console.error('[share-target] Failed to upload file:', sharedFile.name, e);
        notifications.add({ title: `Failed to upload ${sharedFile.name}`, type: 'warning' });
      }
    }

    router.push(`/dashboard/docs/edit/${created.id}`);
  } catch (e) {
    notifications.add({ message: String(e), title: 'Error creating document', type: 'error' });
  } finally {
    processing.value = false;
  }
}

async function uploadFiles() {
  if (processing.value) return;
  processing.value = true;

  try {
    let uploadedCount = 0;
    for (const sharedFile of sharedFiles.value) {
      const formData = new FormData();
      formData.append('file', sharedFile);
      if (parentId.value) formData.append('parent_id', parentId.value);
      await resourcesStore.post(formData);
      uploadedCount++;
    }

    notifications.add({ type: 'success', title: `${uploadedCount} file(s) uploaded successfully` });
    router.push('/dashboard/cdn');
  } catch (e) {
    notifications.add({ message: String(e), title: 'Error uploading files', type: 'error' });
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped lang="scss">
section {
  margin-top: 1.5rem;
}
.share-content {
  gap: 1.5rem;
}

.preview-card {
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);

  .shared-url {
    display: block;
    color: var(--primary);
    word-break: break-all;
    text-decoration: underline;

    &:hover {
      color: var(--primary-dark);
    }
  }
}

.files-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.share-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: var(--primary);
    background: var(--selection-color);
  }

  .action-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary);
    border-radius: var(--radius-sm);
    color: white;
    flex-shrink: 0;
  }

  .action-info {
    h3 {
      font-size: 0.95rem;
      margin-bottom: 0.15rem;
    }

    p {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
  }
}
</style>
