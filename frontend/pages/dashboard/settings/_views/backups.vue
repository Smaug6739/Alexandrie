<template>
  <h1>Backups</h1>
  <div class="main">
    <h2>Create a database backup</h2>
    <p>Click the button below to create a backup of your database.</p>
    <AppButton @click="submitFile" type="primary">Create Backup</AppButton>
    <div v-if="isLoading" class="loading-spinner"></div>
    <div class="link-section" v-if="downloadLink">
      <p>Your backup is ready. You can copy the link to share it or download it.</p>
      <input type="text" v-model="downloadLink" readonly placeholder="Backup Link" />
      <div style="display: flex">
        <AppButton @click="copyLink" type="secondary">Copy Link</AppButton>
        <a :href="downloadLink" download><AppButton type="primary">Download Backup</AppButton></a>
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

async function submitFile() {
  isLoading.value = true;
  const result = await makeRequest<{ url: string }>('backups', 'POST', {});
  isLoading.value = false;
  if (result.status != 'success') {
    return useNotifications().add({ type: 'error', title: 'Error', message: result.message, timeout: 3000 });
  }
  downloadLink.value = `${CDN}${result.result?.url || ''}`;
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
  border-top: 5px solid $primary-color;
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
