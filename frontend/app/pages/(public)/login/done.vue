<template>
  <div class="container">
    <IconApp style="width: 120px" />
    <h1>{{ t('public.login.reset.done.title') }}</h1>
    <p>{{ t('public.login.reset.done.description') }}</p>
    <NuxtLinkLocale to="/login" class="button">{{ t('public.login.reset.done.returnToLogin') }}</NuxtLinkLocale>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18nT();
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h1 {
  font-size: 2.5em;
}

p {
  margin-bottom: 20px;
  font-size: 1.2em;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 5px;
  color: white;
  text-decoration: none;
  background-color: var(--primary);
  transition: background-color $transition-medium;
}
</style>
