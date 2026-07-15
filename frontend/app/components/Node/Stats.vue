<template>
  <section>
    <div class="card">
      <Icon name="files" display="xxl" class="stat-icon" fill="var(--primary)" />
      <div class="content">
        <span class="value">{{ countByRole(3) }}</span>
        <span class="label">{{ t('dashboard.stats.documents') }}</span>
      </div>
    </div>
    <div class="card">
      <Icon name="categories" display="xxl" class="stat-icon" fill="var(--primary)" />
      <div class="content">
        <span class="value">{{ countByRole(1) }}</span>
        <span class="label">{{ t('dashboard.stats.workspaces') }}</span>
      </div>
    </div>
    <div class="card">
      <Icon name="advanced" display="xxl" class="stat-icon" fill="var(--primary)" />
      <div class="content">
        <span class="value">{{ countByRole(2) }}</span>
        <span class="label">{{ t('dashboard.stats.tags') }}</span>
      </div>
    </div>
    <div class="card">
      <Icon name="import" display="xxl" class="stat-icon" fill="var(--primary)" />
      <div class="content">
        <span class="value">{{ countByRole(4) }}</span>
        <span class="label">{{ t('dashboard.stats.cdnFiles') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ parentId?: string }>();

const nodesTree = useNodesTree();
const { t } = useI18nT();

const countByRole = (role: number) => nodesTree.getSubtreeAsArray(props.parentId).filter(node => node.data.role === role).length;
</script>

<style scoped lang="scss">
section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-base);
}

.stat-icon {
  padding: 0.4rem;
  border-radius: var(--radius-md);
  background: var(--primary-bg);
}

.content {
  display: flex;
  flex-direction: column;
}

.value {
  font-size: 1.5rem;
  font-weight: 700;
}

.label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}
</style>
