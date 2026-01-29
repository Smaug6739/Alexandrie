<template>
  <div>
    <div class="skeleton skeleton-category"></div>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-desc"></div>
    <div class="skeleton skeleton-tag"></div>
    <div class="skeleton skeleton-tag short"></div>
  </div>
</template>

<style scoped lang="scss">
/* --- Skeleton Loader --- */
.skeleton {
  margin: 8px 0;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--border-color) 25%, var(--bg-contrast) 37%, var(--border-color) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skeleton-category {
  width: 40%;
  height: 20px;
  margin: 10px 0;
}

.skeleton-title {
  width: 70%;
  height: 41px;
  margin: 15px 0;
}

.skeleton-desc {
  width: 90%;
  height: 16px;
}

.skeleton-tag {
  display: inline-block;
  width: 80px;
  height: 20px;
  margin-right: 6px;
}

.skeleton-tag.short {
  width: 50px;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }

  100% {
    background-position: 400px 0;
  }
}

@media print, screen and (width >= 1024px) {
  .icon {
    display: block;
  }
}

@media print {
  .print-style {
    padding: 0.4rem 0.2rem;
    background: none;
    align-items: center;

    .icon,
    .description,
    .document-tags,
    .category {
      display: none;
    }

    .title {
      font-size: 27px;
      font-weight: 700;
      text-align: center;
      border-bottom: 1px solid var(--font-color);
    }
  }
}
</style>
