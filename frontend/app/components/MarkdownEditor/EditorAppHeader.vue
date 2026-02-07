<template>
  <div class="modal-header">
    <div class="header-icon">
      <Icon :name="icon" display="xxl" fill="var(--surface-base)" />
    </div>
    <h3>{{ title }}</h3>
    <p class="header-subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string; subtitle: string }>();
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  padding: 24px 0 20px;
  text-align: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;

  .header-icon {
    display: flex;
    width: 48px;
    height: 48px;
    border-radius: 16px;
    color: white;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)));
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 800;
    color: var(--text-color-primary);
    background: linear-gradient(135deg, var(--text-color-primary), var(--primary));
    background-clip: text;
    letter-spacing: -0.8px;
    -webkit-text-fill-color: transparent;
  }

  .header-subtitle {
    max-width: 280px;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: var(--text-secondary);
  }
}
</style>
