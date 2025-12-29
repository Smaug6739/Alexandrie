<template>
  <div class="modal">
    <h3>Reset kanban board</h3>
    <p>Are you sure you want to reset the kanban board?</p>
    <p class="warn">This action cannot be undone. All columns will be deleted and cards moved to the first column.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="confirmDelete">Reset</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ onConfirm: () => void }>();
const emit = defineEmits<{ close: [] }>();

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
