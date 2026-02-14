<template>
  <div class="modal">
    <h3>Delete column</h3>
    <p>Are you sure you want to delete the column "{{ columnTitle }}" ?</p>
    <p v-if="cardCount > 0" class="warn">
      This column contains {{ cardCount }} document{{ cardCount > 1 ? 's' : '' }}. They will be moved to the first column.
    </p>
    <p v-else class="info">This column is empty.</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="confirmDelete">Delete</AppButton>
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
