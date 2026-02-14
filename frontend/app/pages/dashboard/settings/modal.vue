<template>
  <IndexSettings class="component" :is-modal="true" />
</template>

<script setup lang="ts">
import IndexSettings from './index.vue';
</script>

<style scoped lang="scss">
.component {
  display: flex;
  width: 100%;
  max-width: 1150px;
  height: 715px;
  max-height: 90vh;
  border-radius: var(--radius-md);

  nav {
    padding: 1rem;
    background-color: var(--surface-raised) !important;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
    gap: 1rem;
    overflow-y: auto;

    span {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    a {
      display: flex;
      margin: 0.2rem;
      padding: 0.2rem 0.4rem;
      border-radius: var(--radius-sm);
      color: inherit;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      &:hover {
        background-color: var(--surface-overlay);
      }
    }

    .title {
      display: block !important;
    }

    .user {
      display: flex !important;
      align-items: center;

      div {
        font-size: 0.8rem;
        margin-left: 5px;

        .email {
          font-size: 0.7rem;
          color: var(--text-secondary);
        }
      }
    }
  }

  .content {
    margin: 0.5rem;
    padding: 1rem 2rem;
  }
}
</style>
