<template>
  <div>
    <h2 class="page-title">Advanced</h2>
    <p class="page-subtitle">Manage advanced settings for the application.</p>

    <div>
      <h3>Reset all preferences</h3>
      <p>This will reset all your preferences to their default values. This action cannot be undone.</p>
      <AppButton type="danger" @click="preferences.reset">Reset preferences</AppButton>
    </div>
    <div>
      <h3>Reset local storage</h3>
      <p>This will reset all your local storage data. This action cannot be undone. This action will also reset preferences.</p>
      <AppButton type="danger" @click="deleteLocalStorage">Delete local storage</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const preferences = usePreferences();

const deleteLocalStorage = () => {
  localStorage.clear();
  location.reload();
};
</script>

<style scoped lang="scss">
h3 {
  margin: 3rem 0 0.5rem;
  font-weight: 500;
}
</style>
