<template>
  <div class="loading-spinner" />
</template>

<style scoped>
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
