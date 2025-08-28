<template>
  <div class="article-skeleton">
    <div class="skeleton-paragraph">
      <div class="skeleton-line" style="width: 90%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 85%"></div>
    </div>
    <div class="skeleton-paragraph">
      <div class="skeleton-line" style="width: 95%"></div>
      <div class="skeleton-line" style="width: 80%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 60%"></div>
    </div>
    <div class="skeleton-paragraph">
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 95%"></div>
      <div class="skeleton-line" style="width: 70%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 100%"></div>

      <div class="skeleton-line" style="width: 80%"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-skeleton {
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding: 2rem 0;
}

.skeleton-paragraph {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 22px;
  border-radius: 4px;
  background: linear-gradient(90deg, #ddd 25%, #eee 37%, #ddd 63%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
</style>
