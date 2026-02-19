<template>
  <div class="modal">
    <h3>{{ t('user.accontDeletion.title') }}</h3>
    <p>{{ t('user.accontDeletion.description') }}</p>
    <p style="opacity: 0.7">{{ t('common.confirm.irreversible') }}</p>
    <p v-if="time > 0">{{ t('user.accontDeletion.waitModal', { seconds: time }) }}</p>
    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton :disabled="time > 0" type="danger" @click="deleteAccount">{{ t('common.actions.confirm') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);

const { t } = useI18nT();

const time = ref(15);
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
      useModal().closeAll();
      setTimeout(() => {
        useUserStore().post_logout();
        useRouter().push('/');
      }, 1000);
    })
    .catch(e => useNotifications().add({ type: 'error', title: 'Error', message: e }));
}
</script>
