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
  max-height: 45%;
  padding: 12px;
  background: var(--surface-base);
  border-top: 1px solid var(--border);
  flex-direction: column;
  gap: 12px;
  overflow: hidden auto;
}

.sidebar-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 8px;
}

.header-title {
  display: flex;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.badge {
  display: flex;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-bg);
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.diagrams-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
