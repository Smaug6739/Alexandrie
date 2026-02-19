<template>
  <div class="modal">
    <h3>{{ t('components.kanban.resetBoard.title') }}</h3>
    <p>{{ t('components.kanban.resetBoard.confirm') }}</p>
    <p class="warn">{{ t('components.kanban.resetBoard.warning') }}</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="danger" @click="confirmDelete">{{ t('components.kanban.resetBoard.reset') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ onConfirm: () => void }>();
const emit = defineEmits<{ close: [] }>();
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
</style>
