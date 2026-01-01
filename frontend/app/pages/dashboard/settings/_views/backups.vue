<template>
  <div>
    <h2 class="app-title">Backups</h2>
    <div class="main">
      <p>Click the button below to create a backup of your data.</p>
      <AppButton type="primary" @click="submitFile">Create Backup</AppButton>
      <LoaderSpinner v-if="isLoading" />
      <div v-if="downloadLink" class="link-section">
        <p>Your backup is ready. You can copy the link to share it or download it.</p>
        <input v-model="downloadLink" type="text" readonly placeholder="Backup Link" />
        <div class="actions">
          <AppButton type="secondary" @click="copyLink">Copy Link</AppButton>
          <a :href="downloadLink + '?response-content-disposition=attachment%3B%20filename%3D%22' + fileName()" download
            ><AppButton type="primary">Download Backup</AppButton></a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { CDN } = useApi();

const downloadLink = ref<string | null>(null);
const isLoading = ref(false);

const copyLink = () => navigator.clipboard.writeText(downloadLink.value!);
const fileName = () => `backup-${new Date().toISOString().split('T')[0]}.json`;

async function submitFile() {
  isLoading.value = true;
  const result = await makeRequest<{ link: string }>('resources/backup', 'GET', {});
  isLoading.value = false;
  if (result.status != 'success') return useNotifications().add({ type: 'error', title: 'Error', message: result.message });
  downloadLink.value = `${CDN}/${result.result?.link || ''}`;
}
</script>

<style scoped lang="scss">
.main {
  margin: auto;
  text-align: center;
}

.actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}
</style>
