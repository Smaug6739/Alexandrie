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
      <div v-for="diagram in diagrams" :key="diagram.id" class="diagram-item">
        <div class="diagram-preview-wrapper">
          <img :src="resourceURL(diagram)" :alt="diagram.name" class="diagram-preview" />
        </div>

        <div class="diagram-info">
          <span class="diagram-name" :title="diagram.name">{{ diagram.name }}</span>
          <div class="diagram-actions">
            <button class="action-btn edit-btn" :title="t('common.actions.edit')" @click="onEdit(diagram)">
              <Icon name="edit" display="sm" />
            </button>
            <button class="action-btn delete-btn" :title="t('common.actions.delete')" @click="onDelete(diagram)">
              <Icon name="delete" display="sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const { t } = useI18nT();
const { resourceURL } = useApi();

defineProps<{ diagrams: Node[] }>();

const emit = defineEmits<{ (e: 'edit' | 'delete', diagram: Node): void }>();

const onEdit = (diagram: Node) => emit('edit', diagram);
const onDelete = (diagram: Node) => emit('delete', diagram);
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

.diagram-item {
  display: flex;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-raised);
  gap: 10px;
  overflow: hidden;
  transition: all $transition-fast ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: var(--shadow-sm);
  }
}

.diagram-preview-wrapper {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.diagram-preview {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.diagram-info {
  display: flex;
  padding: 8px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.diagram-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.diagram-actions {
  display: flex;
  gap: 6px;
}

.action-btn {
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all $transition-fast ease;
  padding: 0;

  &:hover {
    background: var(--surface-transparent);
    color: var(--text-primary);
  }
}

.edit-btn:hover {
  color: var(--primary);
}

.delete-btn:hover {
  color: var(--error);
}
</style>
