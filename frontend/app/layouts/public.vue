<template>
  <div class="container">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 95%;
  margin: 0 auto;
  padding: 1rem 0;
  padding-top: 1.5rem;
}
</style>
