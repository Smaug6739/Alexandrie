<template>
  <div class="modal">
    <h3>Remove 2FA</h3>
    <p>Are you sure you want to remove 2FA from your account?</p>

    <input v-model="code" type="text" placeholder="Enter your 2FA code to confirm" />
    <p class="description">{{ t('nodes.modals.delete.irreversible') }}</p>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.cancel') }}</AppButton>
      <AppButton type="danger" @click="remove2FA">{{ t('common.actions.confirm') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);

const userStore = useUserStore();

const { t } = useI18nT();

const code = ref('');
const errorMessage = ref('');

const remove2FA = async () => {
  try {
    await userStore.disable2FA(code.value);
    emit('close');
  } catch (err) {
    errorMessage.value = (err as string) || 'Failed to disable 2FA. Please check your code and try again.';
  }
};
</script>

<style scoped lang="scss">
.description {
  opacity: 0.7;
}

.warn {
  color: var(--red-dark);
  opacity: 0.7;
}
</style>
