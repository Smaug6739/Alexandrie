<template>
  <ErrorNotFound v-if="error && error.code === 404" />
  <ErrorGeneric v-else-if="error" :error="error" />
  <ErrorGeneric v-else :error="{ code: 500, message: 'An error occurred' }" />
</template>

<script setup lang="ts">
defineProps<{ error?: AlexandrieError | null }>();
</script>
