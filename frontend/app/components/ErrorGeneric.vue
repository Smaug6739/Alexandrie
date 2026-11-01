<template>
  <div class="page-card">
    <div class="error-content">
      <h1 class="error-code">Oops !</h1>
      <p class="error-message">{{ handleError }}</p>
      <p v-if="props.error?.message" class="error-description">
        {{ props.error.message }}
      </p>
      <p v-else class="error-description">
        An unexpected error has occurred. Please check your connection and try refreshing the page or go back to the homepage.
      </p>
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
const props = defineProps<{ error: AlexandrieError }>();

const handleError = computed(() => {
  if (props.error.code > 400 && props.error.code < 500) return 'Invalid request, please check your entries.';
  if (props.error.code >= 500) return 'Internal server error, please try again later.';
  return 'An unexpected error has occurred.';
});
</script>

<style lang="scss" scoped>
.page-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
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
  margin-bottom: 20px;
  font-size: 16px;
  color: var(--text-secondary);
}

.error-button {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  text-decoration: none;
  background-color: var(--primary);
  transition: background-color $transition-medium;
}

.error-button:hover {
  background-color: var(--primary-dark);
}

.error-illustration {
  margin-top: 20px;
}

svg {
  width: 100%;
  max-width: 300px;
  height: auto;
}
</style>
