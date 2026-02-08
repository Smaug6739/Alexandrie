<template>
  <div>
    <h2 class="app-title">Backups <tag yellow>Beta</tag></h2>
    <div class="main">
      <p>Create a backup of your data with customizable options.</p>

      <!-- Backup Options -->
      <div class="options-section">
        <h3>Backup Options</h3>
        <div class="options-grid">
          <AppCheck v-model="options.includeDocuments">
            <span class="option-label">
              <Icon name="folder" display="sm" />
              Documents & Categories
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeFiles">
            <span class="option-label">
              <Icon name="image" display="sm" />
              Uploaded Files (images, PDFs, etc.)
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeSettings">
            <span class="option-label">
              <Icon name="settings" display="sm" />
              Settings & Preferences
            </span>
          </AppCheck>
          <AppCheck v-model="options.includeMetadata">
            <span class="option-label">
              <Icon name="layers" display="sm" />
              Metadata
            </span>
          </AppCheck>
        </div>
      </div>

      <!-- Start Backup Button -->
      <AppButton type="primary" :disabled="isProcessing || !hasAnyOption" @click="startBackup">
        <Icon v-if="!isProcessing" name="backup" display="sm" />
        {{ isProcessing ? 'Creating Backup...' : 'Create Backup' }}
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
          Cancel
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
          This link expires on {{ numericDate(currentJob.expires_at || '') }}
        </p>
        <input v-model="currentJob.download_url" type="text" readonly placeholder="Backup Link" />
        <div class="actions-row">
          <AppButton type="secondary" @click="copyLink">
            <Icon name="copy" display="sm" />
            Copy Link
          </AppButton>
          <a :href="currentJob.download_url" download>
            <AppButton type="primary">
              <Icon name="download" display="sm" />
              Download Backup
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

const { numericDate } = useDateFormatters();
const notifications = useNotifications();
const pref = usePreferences();

const currentJob = ref<BackupJob | null>(null);
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null);

const isProcessing = computed(() => currentJob.value?.status === 'pending' || currentJob.value?.status === 'processing');

const hasAnyOption = computed(() => options.includeDocuments || options.includeFiles || options.includeSettings || options.includeMetadata);

const statusLabel = computed(() => {
  switch (currentJob.value?.status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return '';
  }
});

const copyLink = () => {
  if (currentJob.value?.download_url) {
    navigator.clipboard.writeText(currentJob.value.download_url);
    notifications.add({ type: 'success', title: 'Copied', message: 'Link copied to clipboard' });
  }
};

async function startBackup() {
  // Clear previous job
  stopPolling();
  currentJob.value = null;

  const result = await makeRequest<{ job_id: string; message: string }>('backup', 'POST', {
    include_documents: options.includeDocuments,
    include_files: options.includeFiles,
    local_data: options.includeSettings ? pref.all : null,
    include_metadata: options.includeMetadata,
  });

  if (result.status !== 'success' || !result.result?.job_id) {
    error('Failed to start backup');
    return;
  }

  notifications.add({ type: 'success', title: 'Backup Started', message: 'Your backup is being created...' });
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
      notifications.add({ type: 'success', title: 'Backup Complete', message: 'Your backup is ready for download!' });
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
    notifications.add({ type: 'error', title: 'Error', message: result.message || 'Failed to cancel backup' });
    return;
  }

  stopPolling();
  notifications.add({ type: 'info', title: 'Cancelled', message: 'Backup has been cancelled' });
  currentJob.value = null;
}

function error(message?: string, error?: string) {
  notifications.add({ type: 'error', title: 'Error', message: 'An unknown error occurred' });
  currentJob.value = {
    status: 'failed',
    id: '',
    user_id: '',
    options: { include_documents: false, include_files: false, include_metadata: false },
    progress: 0,
    message: message || 'An error occurred while fetching the backup status. Please try again later.',
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
  border-radius: $radius-sm;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: $radius-sm;
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
  border-radius: 4px;
  background: var(--border);
  margin-bottom: 0.75rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  background: var(--primary);
  transition: width 0.3s ease;
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
  border-radius: $radius-sm;
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
