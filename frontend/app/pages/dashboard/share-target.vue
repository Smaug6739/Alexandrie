<template>
  <div class="page-card">
    <h2 class="page-title"><Icon name="share" /> Shared Content</h2>
    <p class="page-subtitle">Content received from another app.</p>

    <Loader v-if="loading" />

    <div v-else class="share-content">
      <h2>Shared content</h2>
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
          <NodeResourceInline v-for="(file, index) in sharedFiles" :key="index" :file="file" :remove-file="() => removeFile(index)" class="file-card" />
        </div>
      </section>

      <section>
        <label>Choose destination</label>
        <AppSelect v-model="parentId" :items="categories" nullable placeholder="Select a workspace or category (optional)" />
      </section>

      <!-- Action: create note or upload files -->
      <section class="share-actions">
        <h2>What would you like to do?</h2>

        <!-- Create note from shared content -->
        <div class="action-card" @click="createNote">
          <div class="action-icon">
            <Icon name="document" />
          </div>
          <div class="action-info">
            <h3>Create a new document</h3>
            <p>Create a new Markdown document with the shared content</p>
          </div>
        </div>

        <!-- Upload files if there are shared files -->
        <div v-if="sharedFiles.length" class="action-card" @click="uploadFiles">
          <div class="action-icon">
            <Icon name="upload" />
          </div>
          <div class="action-info">
            <h3>Upload as resources</h3>
            <p>Upload the shared files to your resource library</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: 'Share' });

const nodesStore = useNodesStore();
const resourcesStore = useResourcesStore();

const notifications = useNotifications();
const router = useRouter();
const nodesTree = useNodesTree();

const loading = ref(true);
const sharedTitle = ref('');
const sharedText = ref('');
const sharedUrl = ref('');
const sharedFiles = ref<{ name: string; file: File; preview?: string }[]>([]);
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

    const files = formData.getAll('files') as File[];
    for (const file of files) {
      if (file && file.size > 0) {
        const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
        sharedFiles.value.push({ name: file.name, file, preview });
      }
    }

    // Clean up cache after reading
    await cache.delete('/share-target-data');
  } catch (e) {
    console.warn('[share-target] Could not read from cache:', e);
  }

  // Fallback: URL query params (GET share, or simple text share)
  const route = useRoute();
  if (!sharedTitle.value && route.query.title) sharedTitle.value = route.query.title as string;
  if (!sharedText.value && route.query.text) sharedText.value = route.query.text as string;
  if (!sharedUrl.value && route.query.url) sharedUrl.value = route.query.url as string;
}

function removeFile(index: number) {
  const file = sharedFiles.value[index];
  if (file?.preview) URL.revokeObjectURL(file.preview);
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
      if (sharedFile.file.type.startsWith('text/') || sharedFile.name.endsWith('.md') || sharedFile.name.endsWith('.txt')) {
        const text = await readTextFile(sharedFile.file);
        content += `\n\n---\n\n## ${sharedFile.name}\n\n${text}`;
      }
    }

    const doc: Partial<Node> = {
      name: title,
      content: content,
      parent_id: parentId.value || undefined,
      accessibility: 1,
      role: 3,
    };

    const created = await nodesStore.post(doc);
    notifications.add({ type: 'success', title: 'Document created from shared content' });

    // Upload non-text files as resources linked to this note
    const nonTextFiles = sharedFiles.value.filter(f => !f.file.type.startsWith('text/') && !f.name.endsWith('.md') && !f.name.endsWith('.txt'));

    for (const sharedFile of nonTextFiles) {
      try {
        const formData = new FormData();
        formData.append('file', sharedFile.file);
        formData.append('parent_id', created.id);
        await resourcesStore.post(formData);
      } catch (e) {
        console.error('[share-target] Failed to upload file:', sharedFile.name, e);
        notifications.add({ type: 'warning', title: `Failed to upload ${sharedFile.name}` });
      }
    }

    cleanupPreviews();
    router.push(`/dashboard/docs/edit/${created.id}`);
  } catch (e) {
    notifications.add({ type: 'error', title: 'Error creating document', message: String(e) });
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
      formData.append('file', sharedFile.file);
      if (parentId.value) formData.append('parent_id', parentId.value);
      await resourcesStore.post(formData);
      uploadedCount++;
    }

    notifications.add({ type: 'success', title: `${uploadedCount} file(s) uploaded successfully` });
    cleanupPreviews();
    router.push('/dashboard/cdn');
  } catch (e) {
    notifications.add({ type: 'error', title: 'Error uploading files', message: String(e) });
  } finally {
    processing.value = false;
  }
}

function cleanupPreviews() {
  sharedFiles.value.forEach(f => {
    if (f.preview) URL.revokeObjectURL(f.preview);
  });
}

onBeforeUnmount(() => {
  cleanupPreviews();
});
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
