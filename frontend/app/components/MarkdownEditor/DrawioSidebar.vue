<template>
  <div v-if="diagrams.length" class="drawio-sidebar">
    <div class="sidebar-header">
      <div class="header-title">
        <Icon name="image" display="sm" />
        <span>{{ t('markdown.drawio.linked') }}</span>
        <span class="badge">{{ diagrams.length }}</span>
      </div>
    </div>

    <div class="diagrams-list">
      <NodeResourceInline v-for="diagram in diagrams" :key="diagram.id" :node="diagram" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const { t } = useI18nT();

defineProps<{ diagrams: Node[] }>();
</script>

<style scoped lang="scss">
.drawio-sidebar {
  display: flex;
  padding: 12px;
  border-top: 1px solid var(--border);
  background: var(--surface-base);
  flex-direction: column;
  gap: 12px;
  max-height: 45%;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: auto;
  background: var(--primary-bg);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
}

.diagrams-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
