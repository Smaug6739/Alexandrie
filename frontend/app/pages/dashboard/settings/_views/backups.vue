<template>
  <div>
    <h2 class="ctitle">Backups</h2>
    <div class="main">
      <p>Click the button below to create a backup of your data.</p>
      <AppButton type="primary" @click="submitFile">Create Backup</AppButton>
      <div v-if="isLoading" class="loading-spinner" />
      <div v-if="downloadLink" class="link-section">
        <p>Your backup is ready. You can copy the link to share it or download it.</p>
        <input v-model="downloadLink" type="text" readonly placeholder="Backup Link" />
        <div style="display: flex">
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
const route = useRoute();
const currentPage = ref(route.query.p || 'profile');

watchEffect(() => (currentPage.value = route.query.p || 'profile'));

const downloadLink = ref<string | null>(null);
const copyLink = () => navigator.clipboard.writeText(downloadLink.value!);
const isLoading = ref(false);
const fileName = () => `backup-${new Date().toISOString().split('T')[0]}.json`;
async function submitFile() {
  isLoading.value = true;
  const result = await makeRequest<{ link: string }>('ressources/backup', 'GET', {});
  isLoading.value = false;
  if (result.status != 'success') return useNotifications().add({ type: 'error', title: 'Error', message: result.message });
  downloadLink.value = `${CDN}/${result.result?.link || ''}`;
}

watchEffect(() => (currentPage.value = route.query.p || 'profile'));
</script>

<style scoped lang="scss">
.main {
  margin: auto;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 20px auto;
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  border-top: 5px solid var(--primary);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
