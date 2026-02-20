<template>
  <div>
    <h2 class="page-title">{{ t('settings.backups.title') }}</h2>
    <p class="page-subtitle">{{ t('settings.backups.subtitle') }}</p>

    <div class="main">
      <!-- Backup Options -->
      <div class="options-section">
        <h3>{{ t('settings.backups.options') }}</h3>
        <div class="options-grid">
          <AppCheck v-model="options.includeDocuments">
            <span class="option-label">
              <Icon name="folder" display="sm" />
              {{ t('settings.backups.includeDocuments') }}
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeFiles">
            <span class="option-label">
              <Icon name="image" display="sm" />
              {{ t('settings.backups.includeFiles') }}
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeSettings">
            <span class="option-label">
              <Icon name="settings" display="sm" />
              {{ t('settings.backups.includeSettings') }}
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeMetadata">
            <span class="option-label">
              <Icon name="layers" display="sm" />
              {{ t('settings.backups.includeMetadata') }}
            </span>
          </AppCheck>
        </div>
      </div>

      <!-- Start Backup Button -->
      <AppButton type="primary" :disabled="isProcessing || !hasAnyOption" @click="startBackup">
        <Icon v-if="!isProcessing" name="backup" display="sm" />
        {{ isProcessing ? t('settings.backups.creatingBackup') : t('settings.backups.createBackup') }}
      </AppButton>
      <LoaderSpinner v-if="isProcessing" />
      <!-- Progress Section -->
      <div v-if="currentJob" class="progress-section">
        <div class="progress-header">
          <span class="status-badge" :class="currentJob.status">
            {{ statusLabel }}
          </span>
          <span v-if="currentJob.status === 'processing'" class="progress-percent"> {{ currentJob.progress }}% </span>
        </div>

        <div v-if="currentJob.status === 'processing'" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: currentJob.progress + '%' }"></div>
        </div>

        <p class="progress-message">{{ currentJob.message }}</p>

        <!-- Cancel Button -->
        <AppButton v-if="currentJob.status === 'processing' || currentJob.status === 'pending'" type="secondary" @click="cancelBackup">
          <Icon name="close" display="sm" />
          {{ t('common.actions.cancel') }}
        </AppButton>

        <!-- Error Message -->
        <div v-if="currentJob.status === 'failed' && currentJob.error" class="error-message">
          {{ currentJob.error }}
        </div>
      </div>

      <!-- Download Section -->
      <div v-if="currentJob?.status === 'completed' && currentJob.download_url" class="link-section">
        <p class="expiry-notice">
          <Icon name="clock" :size="14" />
          {{ t('settings.backups.expiryNotice', { date: numericDate(currentJob.expires_at || '') }) }}
        </p>
        <input v-model="currentJob.download_url" type="text" readonly :placeholder="t('settings.backups.backupLink')" />
        <div class="actions-row">
          <AppButton type="secondary" @click="copyLink">
            <Icon name="copy" display="sm" />
            {{ t('common.actions.copyLink') }}
          </AppButton>
          <a :href="currentJob.download_url" download>
            <AppButton type="primary">
              <Icon name="download" display="sm" />
              {{ t('settings.backups.downloadBackup') }}
            </AppButton>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BackupJob {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  options: BackupOptions;
  progress: number;
  message: string;
  download_url?: string;
  error?: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

interface BackupOptions {
  include_documents: boolean;
  include_files: boolean;
  local_data?: object;
  include_settings?: boolean;
  include_metadata: boolean;
}

const options = reactive({
  includeDocuments: true,
  includeFiles: true,
  includeSettings: true,
  includeMetadata: true,
});

const { t } = useI18nT();
const { numericDate } = useDateFormatters();
const notifications = useNotifications();
const pref = usePreferencesStore();

const currentJob = ref<BackupJob | null>(null);
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null);

const isProcessing = computed(() => currentJob.value?.status === 'pending' || currentJob.value?.status === 'processing');

const hasAnyOption = computed(() => options.includeDocuments || options.includeFiles || options.includeSettings || options.includeMetadata);

const statusLabel = computed(() => {
  switch (currentJob.value?.status) {
    case 'pending':
      return t('common.status.pending');
    case 'processing':
      return t('common.status.processing');
    case 'completed':
      return t('common.status.completed');
    case 'failed':
      return t('common.status.failed');
    default:
      return '';
  }
});

const copyLink = () => {
  if (currentJob.value?.download_url) {
    navigator.clipboard.writeText(currentJob.value.download_url);
    notifications.add({ type: 'success', title: t('common.notifications.copiedTitle'), message: t('common.notifications.copiedMessage') });
  }
};

async function startBackup() {
  // Clear previous job
  stopPolling();
  currentJob.value = null;

  const result = await makeRequest<{ job_id: string; message: string }>('backup', 'POST', {
    include_documents: options.includeDocuments,
    include_files: options.includeFiles,
    local_data: options.includeSettings ? pref.preferences : null,
    include_metadata: options.includeMetadata,
  });

  if (result.status !== 'success' || !result.result?.job_id) {
    error('Failed to start backup');
    return;
  }

  notifications.add({ type: 'success', title: t('settings.backups.notifications.startedTitle'), message: t('settings.backups.notifications.started') });
  // Start polling for status
  startPolling(result.result.job_id);
}

async function checkStatus(jobId: string) {
  const result = await makeRequest<BackupJob>(`backup/${jobId}`, 'GET', {});

  if (result.status !== 'success' || !result.result) {
    stopPolling();
    error();
    return;
  }
  currentJob.value = result.result;

  // Stop polling if job is finished
  if (result.result.status === 'completed' || result.result.status === 'failed') {
    stopPolling();

    if (result.result.status === 'completed') {
      notifications.add({ type: 'success', title: t('settings.backups.notifications.completedTitle'), message: t('settings.backups.notifications.completed') });
    } else if (result.result.status === 'failed') {
      error(result.result.message, result.result.error);
    }
  }
}

function startPolling(jobId: string) {
  // Initial check
  checkStatus(jobId);

  // Poll every 2 seconds
  pollingInterval.value = setInterval(() => {
    checkStatus(jobId);
  }, 2000);
}

function stopPolling() {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
}

async function cancelBackup() {
  if (!currentJob.value?.id) return;

  const result = await makeRequest(`backup/${currentJob.value.id}`, 'DELETE', {});

  if (result.status !== 'success') {
    notifications.add({
      type: 'error',
      title: t('common.errors.generic'),
      message: result.message || t('settings.backups.notifications.failedToCancelBackup'),
    });
    return;
  }

  stopPolling();
  notifications.add({ type: 'info', title: t('settings.backups.notifications.canceled') });
  currentJob.value = null;
}

function error(message?: string, error?: string) {
  notifications.add({ type: 'error', title: t('common.errors.generic'), message: message || t('common.errors.unknown') });
  currentJob.value = {
    status: 'failed',
    id: '',
    user_id: '',
    options: { include_documents: false, include_files: false, include_metadata: false },
    progress: 0,
    message: message || t('settings.backups.notifications.errorFetching'),
    error: error,
    created_at: '',
    updated_at: '',
  };
}

// Cleanup on unmount
onUnmounted(() => {
  stopPolling();
});
</script>

<style scoped lang="scss">
.main {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.options-section {
  padding: 1rem;
  text-align: left;

  h3 {
    font-size: 1rem;
    color: var(--text-body);
    margin-bottom: 1rem;
  }
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-section {
  padding: 1rem;
  border-radius: var(--radius-sm);
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;

  &.pending {
    color: var(--yellow);
    background: var(--yellow-bg);
  }

  &.processing {
    color: var(--primary);
    background: var(--primary-bg);
  }

  &.completed {
    color: var(--green);
    background: var(--green-bg);
  }

  &.failed {
    color: var(--red);
    background: var(--red-bg);
  }
}

.progress-percent {
  font-weight: 600;
  color: var(--primary);
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-xs);
  background: var(--border);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-xs);
  background: var(--primary);
  transition: width $transition-medium ease;
}

.progress-message {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.error-message {
  display: flex;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--error);
  text-align: left;
  background: var(--error-bg);
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.link-section {
  padding: 1rem;
}

.expiry-notice {
  display: flex;
  font-size: 0.75rem;
  color: var(--text-primary);
  align-items: center;
  gap: 0.25rem;
  justify-content: center;
  margin-bottom: 1rem;
}

input[type='text'] {
  padding: 0.75rem;
}

.actions-row {
  justify-content: center;
  margin-top: 0.75rem;

  a {
    text-decoration: none;
  }
}
</style>
