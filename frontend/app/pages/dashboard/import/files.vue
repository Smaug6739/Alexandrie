<template>
  <div class="page-card">
    <!-- Select Files -->
    <div v-if="!importing">
      <header>
        <h1>{{ t('import.meta.title') }} - Markdown <tag class="orange">Beta</tag></h1>
      </header>

      <AppDrop ref="dropComponent" multiple @select="selectFiles" />

      <!-- Import Button -->
      <div v-if="selectedFiles.length" class="actions">
        <AppButton type="primary" :disabled="isLoading" @click="importFiles">
          {{ isLoading ? t('import.actions.importing') : t('import.actions.importAll') }}
        </AppButton>
      </div>

      <!-- Error Message -->
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>

    <!-- Progress -->
    <div v-else class="progress-section">
      <h2>{{ t('import.actions.importing') }}</h2>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="progress-text">{{ currentFile }} / {{ totalFiles }}</p>

      <div v-if="results.created.length" class="results-created">
        <h3>✓ Importés ({{ results.created.length }})</h3>
        <div class="result-list">
          <div v-for="name in results.created" :key="name" class="result-item">
            {{ name }}
          </div>
        </div>
      </div>

      <div v-if="results.failed.length" class="results-failed">
        <h3>{{ t('import.notifications.importFailedTitle') }} ({{ results.failed.length }})</h3>
        <div class="result-list error">
          <div v-for="item in results.failed" :key="item.name" class="result-item">
            <strong>{{ item.name }}</strong
            >: {{ item.error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import compile from '~/helpers/markdown';
import type { Node } from '~/stores';

definePageMeta({ breadcrumb: { i18n: 'import.meta.breadcrumb' } });

const { t } = useI18nT();
const nodesStore = useNodesStore();
const notifications = useNotifications();

// State
const selectedFiles = ref<File[]>([]);
const isLoading = ref(false);
const importing = ref(false);
const error = ref('');

// Progress
const currentFile = ref(0);
const totalFiles = ref(0);
const progress = computed(() => (totalFiles.value > 0 ? (currentFile.value / totalFiles.value) * 100 : 0));

// Results
const results = ref<{
  created: string[];
  failed: Array<{ name: string; error: string }>;
}>({
  created: [],
  failed: [],
});

const dropComponent = ref();

/**
 * Select files from drop or input
 */
const selectFiles = (files: File | File[] | null) => {
  error.value = '';
  if (!files) return;
  selectedFiles.value = Array.isArray(files) ? files : [files];
};

/**
 * Extract front-matter metadata from markdown
 */
const extractMetadata = (content: string) => {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, body: content };

  const metadata: Record<string, string | string[]> = {};
  const lines = match[1]?.split('\n');
  if (!lines) return { metadata: {}, body: content };
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(':')
        .trim()
        .replace(/^['"]|['"]$/g, '');
      metadata[key.trim()] = value.length > 1 ? value : value[0] || '';
    }
  }

  return { metadata, body: match[2] };
};

/**
 * Read file content
 */
const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

/**
 * Import markdown files as documents
 */
const importFiles = async () => {
  isLoading.value = true;
  importing.value = true;
  error.value = '';
  results.value = { created: [], failed: [] };

  if (selectedFiles.value.length === 0) {
    error.value = t('import.files.noMarkdownFiles');
    isLoading.value = false;
    importing.value = false;
    return;
  }

  totalFiles.value = selectedFiles.value.length;
  currentFile.value = 0;

  for (const file of selectedFiles.value) {
    try {
      const content = await readFile(file);
      const { metadata, body } = extractMetadata(content);

      const node: Partial<Node> = {
        name: (metadata.title as string) || file.name.replace(/\.[^/.]+$/, ''),
        description: metadata.description as string,
        tags: metadata.tags as string,
        content: body,
        content_compiled: compile(body),
        role: 3,
        accessibility: 1,
      };

      const created = await nodesStore.post(node);
      results.value.created.push(created.name || file.name);
    } catch (err) {
      results.value.failed.push({
        name: file.name,
        error: err instanceof Error ? err.message : 'Erreur inconnue',
      });
    }

    currentFile.value++;
  }

  isLoading.value = false;

  notifications.add({
    type: results.value.failed.length > 0 ? 'warning' : 'success',
    title: results.value.failed.length > 0 ? t('import.notifications.importFailedTitle') : t('import.notifications.importCompleteTitle'),
    message: t('import.notifications.importCompleteMessage'),
  });
};
</script>

<style scoped lang="scss">
.page-card {
  header {
    h1 {
      margin-bottom: 1rem;
    }
  }

  .selected-files {
    margin: 1.5rem 0;
    padding: 1rem;
    background: var(--surface-transparent);
    border-radius: var(--radius-md);

    .files-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        font-weight: 600;
      }
    }

    .file-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;

      .file-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem;
        background: var(--surface-raised);
        border-radius: var(--radius-sm);
        font-size: 0.875rem;

        .file-size {
          margin-left: auto;
          color: var(--text-secondary);
          font-size: 0.75rem;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .error-text {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(var(--error-rgb), 0.1);
    color: var(--error);
    border-radius: var(--radius-md);
    border-left: 3px solid var(--error);
  }

  .progress-section {
    h2 {
      margin-bottom: 1rem;
    }

    .progress-bar {
      height: 8px;
      background: var(--surface-transparent);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;

      .progress-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s ease;
      }
    }

    .progress-text {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .results-created,
    .results-failed {
      margin-top: 1.5rem;

      h3 {
        font-size: 0.875rem;
        text-transform: uppercase;
        margin-bottom: 0.75rem;
        font-weight: 600;
      }

      .result-list {
        max-height: 300px;
        overflow-y: auto;

        &.error {
          background: rgba(var(--error-rgb), 0.05);
        }

        .result-item {
          padding: 0.5rem;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--border-subtle);

          &:last-child {
            border-bottom: none;
          }
        }
      }
    }

    .completion-actions {
      margin-top: 2rem;
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }
  }
}
</style>
