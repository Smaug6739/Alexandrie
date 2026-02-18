<template>
  <div class="modal">
    <h3>{{ t('components.kanban.deleteColumnModal.title') }}</h3>
    <p>{{ t('components.kanban.deleteColumnModal.confirm', { title: columnTitle }) }}</p>
    <p v-if="cardCount > 0" class="warn">
      {{ t('components.kanban.deleteColumnModal.hasDocuments', { count: cardCount }) }}
    </p>
    <p v-else class="info">{{ t('components.kanban.deleteColumnModal.emptyColumn') }}</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="danger" @click="confirmDelete">{{ t('common.actions.delete') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  columnTitle: string;
  cardCount: number;
  onConfirm: () => void;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18nT();

const confirmDelete = () => {
  props.onConfirm();
  emit('close');
};
</script>

<style scoped lang="scss">
.warn {
  color: var(--red-dark);
  opacity: 0.8;
}

.info {
  color: var(--text-secondary);
  font-style: italic;
}
</style>
