<template>
  <div class="modal">
    <h3>Delete {{ ressources.length > 1 ? 'ressources' : 'ressource' }}</h3>
    <p>
      Are you sure you want to delete the selected {{ ressources.length > 1 ? 'ressources' : 'ressource' }}? <br />
      <span v-if="ressources.length > 1"
        >This action will delete <strong>{{ ressources.length }}</strong> ressources.</span
      >
    </p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteRessource">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ ressources: string[] }>();
const emit = defineEmits(['close']);
const deleteRessource = async () => {
  await useRessourcesStore()
    .bulkDelete(props.ressources)
    .then(() => {
      emit('close');
      useRouter().push('/dashboard/cdn');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>
