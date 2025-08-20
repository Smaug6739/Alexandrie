<template>
  <div>
    <h1>Backups</h1>
    <div class="main">
      <h2>Create a database backup</h2>
      <p>Click the button below to create a backup of your database.</p>
      <AppButton type="primary" @click="submitFile">Create Backup</AppButton>
      <div v-if="isLoading" class="loading-spinner" />
      <div v-if="downloadLink" class="link-section">
        <p>Your backup is ready. You can copy the link to share it or download it.</p>
        <input v-model="downloadLink" type="text" readonly placeholder="Backup Link" />
        <div style="display: flex">
          <AppButton type="secondary" @click="copyLink">Copy Link</AppButton>
          <a :href="downloadLink + '?response-content-disposition=attachment%3B%20filename%3D%22' + fileName()" download><AppButton type="primary">Download Backup</AppButton></a>
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
  text-align: center;
  margin: auto;
}
.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
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
