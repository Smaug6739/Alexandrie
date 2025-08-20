<template>
  <div class="modal">
    <h3>Delete ressource</h3>
    <p>Are you sure you want to delete this ressource ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteRessource">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ressourceId: string }>();
const emit = defineEmits(['close']);
const deleteRessource = async () => {
  await useRessourcesStore()
    .delete(props.ressourceId)
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Ressource deleted successfully' });
      emit('close');
      useRouter().push('/dashboard/cdn');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>

<style scoped lang="scss"></style>
