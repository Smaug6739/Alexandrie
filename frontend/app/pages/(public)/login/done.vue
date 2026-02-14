<template>
  <div class="container">
    <IconApp style="width: 120px" />
    <h1>Instructions sent</h1>
    <p>Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</p>
    <nuxt-link to="/" class="button">Return to Homepage</nuxt-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

h1 {
  font-size: 2.5em;
}

p {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  background-color: var(--primary);
  transition: background-color $transition-medium;
  text-decoration: none;
}
</style>
