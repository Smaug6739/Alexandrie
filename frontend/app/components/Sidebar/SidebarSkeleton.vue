<template>
  <div style="width: 100%; height: 100%">
    <div v-if="isLoading" class="sidebar-skeleton">
      <div v-for="n in 30" :key="n" class="skeleton-line" :style="{ marginRight: `${(n % 3) * 22}px` }" />
    </div>
    <div v-else class="empty-sidebar">
      <div class="icon">
        <svg fill="var(--font-color-light)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              stroke-width="0"
              d="M3 20h18a1 1 0 0 0 .864-1.504l-7-12c-.359-.615-1.369-.613-1.729 0L9.866 12.1l-1.02-1.632A.998.998 0 0 0 8 10h-.001a1 1 0 0 0-.847.47l-5 8A1 1 0 0 0 3 20zM14 8.985 19.259 18h-5.704l-2.486-3.987L14 8.985zm-5.999 3.9L11.197 18H4.805l3.196-5.115zM6 8c1.654 0 3-1.346 3-3S7.654 2 6 2 3 3.346 3 5s1.346 3 3 3zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
            ></path>
          </g>
        </svg>
      </div>
      <p class="message">No content available</p>
      <small class="hint">Create a new document or category to get started</small>
      <span class="action-link">Create New</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isLoading: boolean }>();
</script>

<style scoped lang="scss">
.sidebar-skeleton {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding: 2rem;
}

.skeleton-line {
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(90deg, var(--bg-contrast) 25%, var(--bg-color) 37%, var(--bg-contrast) 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.empty-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20% 1rem;
  color: var(--font-color-light);
  text-align: center;
}

.empty-sidebar .icon {
  margin-bottom: 1rem;
  svg {
    width: 100px;
    height: 100px;
    stroke: var(--font-color-light);
  }
}

.empty-sidebar .message {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.empty-sidebar .hint {
  font-size: 0.75rem;
  color: var(--font-color-muted);
}
.action-link {
  margin-top: 5px;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--primary);
  cursor: pointer;
}
</style>
