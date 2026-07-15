<template>
  <div class="modal-header">
    <div class="header-icon">
      <Icon :name="icon" display="xxl" fill="var(--surface-base)" />
    </div>
    <h3>{{ title }}</h3>
    <p v-if="subtitle" class="header-subtitle">{{ subtitle }}</p>
    <div class="floating-toolbar">
      <slot name="toolbar" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string; subtitle?: string }>();
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  padding: 16px 0 0;
  text-align: center;

  .header-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    border-radius: 16px;
    color: white;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark, var(--primary)));
  }

  h3 {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.8px;
    background: linear-gradient(135deg, var(--text-primary), var(--primary));
    background-clip: text;
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

.floating-toolbar {
  position: absolute;
  top: 1.3rem;
  right: 50px;
  display: flex;
  gap: 8px;
}
</style>
