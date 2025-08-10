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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
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
  background-color: var(--primary);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}
</style>
