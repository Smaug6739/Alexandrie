<template>
  <div class="modal">
    <h3>Delete {{ resources.length > 1 ? 'resources' : 'resource' }}</h3>
    <p>
      Are you sure you want to delete the selected {{ resources.length > 1 ? 'resources' : 'resource' }}? <br />
      <span v-if="resources.length > 1"
        >This action will delete <strong>{{ resources.length }}</strong> resources.</span
      >
    </p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton type="danger" @click="deleteResource">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ resources: string[] }>();

const emit = defineEmits(['close']);

const deleteResource = async () => {
  await useNodesStore()
    .bulkDelete(props.resources)
    .then(() => {
      emit('close');
      useRouter().push('/dashboard/cdn');
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
};
</script>
