<template>
  <div>
    <h2 class="app-title">Advanced</h2>
    <p class="app-subtitle">Manage advanced settings for the application.</p>
    <p>Be careful with these settings, they can seriously affect the application.</p>

    <div class="settings-section">
      <div class="setting">
        <h4>Reset all preferences</h4>
        <p>This will reset all your preferences to their default values. This action cannot be undone.</p>
        <AppButton type="danger" @click="preferences.reset">Reset preferences</AppButton>
      </div>
      <div class="setting">
        <h4>Reset local storage</h4>
        <p>This will reset all your local storage data. This action cannot be undone. This action will also reset preferences.</p>
        <AppButton type="danger" @click="deleteLocalStorage">Delete local storage</AppButton>
      </div>
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
