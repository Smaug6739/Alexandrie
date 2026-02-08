<template>
  <div class="card-component">
    <div class="error-content">
      <h1 class="error-code">Oops !</h1>
      <p class="error-message">{{ handleError }}</p>
      <p class="error-description">An unexpected error has occurred. Please check your connection and try refreshing the page or go back to the homepage.</p>
      <nuxt-link to="/dashboard" class="error-button">Return to Homepage</nuxt-link>
    </div>
    <div class="error-illustration">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
        <circle cx="250" cy="250" r="200" fill="#f3f4f6" />
        <path d="M250 100 L310 250 L190 250 Z" fill="#1d4ed8" />
        <circle cx="250" cy="250" r="50" fill="#93c5fd" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error?: string }>();

const handleError = computed(() => {
  if (props.error === 'Failed to fetch' || props.error === 'TypeError: Failed to fetch') return 'Network error, please check your connection.';
  if (props.error === 'Request failed with status code 404') return 'The requested resource was not found.';
  if (props.error === 'Request failed with status code 500') return 'Internal server error, please try again later.';
  return props.error || 'An unexpected error has occurred.';
});
</script>

<style lang="scss" scoped>
.card-component {
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.error-content {
  max-width: 600px;
  margin-bottom: 20px;
}

.error-code {
  margin: 0;
  font-size: 96px;
  font-weight: bold;
  color: var(--text-body);
}

.error-message {
  margin: 10px 0;
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.error-description {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.error-button {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  background-color: var(--primary);
  transition: background-color $transition-medium;
  text-decoration: none;
}

.error-button:hover {
  background-color: var(--primary-dark);
}

.error-illustration {
  margin-top: 20px;
}

.error-illustration svg {
  width: 100%;
  max-width: 300px;
  height: auto;
}
</style>
