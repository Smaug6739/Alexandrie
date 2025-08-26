<template>
  <div class="modal">
    <h3>Delete account</h3>
    <p>Are you sure you want to delete your account ?</p>
    <p style="opacity: 0.7">This action is irreversible</p>
    <p v-if="time > 0">Please wait {{ time }} seconds before confirming</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">Cancel</AppButton>
      <AppButton :disabled="time > 0" type="danger" @click="deleteAccount">Confirm</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const time = ref(15);
const emit = defineEmits(['close']);

let interval: NodeJS.Timeout;

onMounted(() => {
  interval = setInterval(() => {
    if (time.value > 0) time.value--;
    else clearInterval(interval);
  }, 1000);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
function deleteAccount() {
  useUserStore()
    .deleteAccount()
    .then(() => {
      useNotifications().add({ type: 'success', title: 'Account deleted' });
      emit('close');
      setTimeout(() => {
        useUserStore().post_logout();
        useRouter().push('/');
      }, 1000);
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
}
</script>
