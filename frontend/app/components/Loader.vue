<template>
  <div class="loader"></div>
</template>

<style scoped>
.loader {
  margin: 4px auto;
  width: 25px;
  background: var(--c) 0% 50%, var(--c) 50% 50%, var(--c) 100% 50%;
  background-size: 20% 100%;
  animation: l1 1s infinite linear;
  aspect-ratio: 1;

  --c: no-repeat linear-gradient(var(--grey) 0 0);
}

@keyframes l1 {
  0% {
    background-size: 20% 100%, 20% 100%, 20% 100%;
  }

  33% {
    background-size: 20% 10%, 20% 100%, 20% 100%;
  }

  50% {
    background-size: 20% 100%, 20% 10%, 20% 100%;
  }

  66% {
    background-size: 20% 100%, 20% 100%, 20% 10%;
  }

  100% {
    background-size: 20% 100%, 20% 100%, 20% 100%;
  }
}
</style>
