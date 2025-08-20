<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-code">{{ props.error?.statusCode }}</h1>
      <p class="error-message">{{ props.error?.statusMessage || 'Something went wrong' }}</p>
      <p>{{ error }}</p>
      <p class="error-description">An unexpected error has occurred. Please try refreshing the page or go back to the homepage.</p>
      <nuxt-link to="/" class="error-button">Return to Homepage</nuxt-link>
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
import type { NuxtError } from '#app';

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({
      statusCode: 500,
      statusMessage: 'Something went wrong',
    }),
  },
});
</script>

<style lang="scss">
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
}

.error-content {
  max-width: 600px;
  margin-bottom: 20px;
}

.error-code {
  font-size: 96px;
  font-weight: bold;
  color: var(--font-color);
  margin: 0;
}

.error-message {
  font-size: 24px;
  color: var(--font-color-dark);
  margin: 10px 0;
}

.error-description {
  font-size: 16px;
  color: var(--font-color-light);
  margin-bottom: 20px;
}

.error-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.error-button:hover {
  background-color: $primary-dark;
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
