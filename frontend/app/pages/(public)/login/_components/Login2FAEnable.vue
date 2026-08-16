<template>
  <div class="ctn">
    <h1>{{ t('settings.security.totp.enable') }}</h1>
    <p class="reason">{{ t('settings.security.totp.forced') }}</p>
    <p>{{ t('settings.security.totp.enableStep1') }}</p>

    <div class="qr-container">
      <QrcodeVue :value="totpData.qr_code_url" :size="200" level="H" />
      <code class="secret-text">Secret Key: {{ totpData.secret }}</code>
    </div>

    <p>{{ t('settings.security.totp.enableStep2') }}</p>
    <input v-model="setupCode" type="text" :placeholder="t('public.login.OTP_2FA.placeholder')" maxlength="6" />

    <div class="footer">
      <AppButton type="primary" @click="confirm2FA">{{ t('common.actions.confirm') }}</AppButton>
    </div>

    <tag v-if="setupError" red class="error">{{ setupError }}</tag>
  </div>
</template>

<script setup lang="ts">
import BackupCodes2FA from '~/pages/dashboard/settings/_views/_components/BackupCodes2FA.vue';
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{
  preAuthToken: string;
}>();

const emit = defineEmits<{ (e: '2fa-enabled'): void }>();

const userStore = useUserStore();
const { t } = useI18nT();

const totpData = ref({ secret: '', qr_code_url: '' });
const setupCode = ref('');
const setupError = ref('');

definePageMeta({
  layout: 'public',
});

const modals = useModal();

async function confirm2FA() {
  setupError.value = '';
  try {
    const backupCodes = await userStore.confirm2FA(totpData.value.secret, setupCode.value, props.preAuthToken);
    setupCode.value = '';
    modals.add(new Modal(shallowRef(BackupCodes2FA), { size: 'small', props: { backupCodes }, onClose: () => emit('2fa-enabled') }));
  } catch (err) {
    setupError.value = (err as string) || 'Invalid code. Activation failed.';
  }
}

onMounted(async () => {
  try {
    const data = await userStore.request2FA(props.preAuthToken);
    totpData.value = data!;
  } catch (err) {
    setupError.value = (err as string) || 'An error occurred while initiating 2FA setup.';
  }
});
</script>
<style scoped lang="scss">
h1 {
  font-size: 2.5em;
}

.ctn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}

p.reason {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.qr-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  padding: 1.5rem;
  border-radius: var(--radius-md);
  background: white;

  .secret-text {
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono, monospace);
    font-size: 0.85rem;
    color: #333;
    text-align: center;
    word-break: break-all;
    background: var(--surface-background);
  }
}

.footer {
  margin-top: 1rem;
}

.error {
  text-align: center;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  padding: 0.5rem;
}
</style>
