<template>
  <section>
    <header>
      <div>
        <h3>
          {{ t('settings.security.totp.title') }}
        </h3>
        <p class="section-description">{{ t('settings.security.totp.description') }}</p>
      </div>
      <div v-if="userStore.user?.totp_enabled">
        <AppButton type="danger" @click="disable2FA"> {{ t('settings.security.totp.disable') }} </AppButton>
      </div>

      <div v-else-if="!setupMode">
        <AppButton type="primary" @click="start2FASetup"> {{ t('settings.security.totp.enable') }} </AppButton>
      </div>
    </header>

    <p v-if="userStore.user?.totp_enabled" class="enabled">{{ t('settings.security.totp.stateEnabled') }}</p>

    <div v-if="setupMode" class="setup-wizard">
      <p>{{ t('settings.security.totp.enableStep1') }}</p>

      <div class="qr-container">
        <QrcodeVue :value="totpData.qr_code_url" :size="200" level="H" />
        <code class="secret-text">Secret Key: {{ totpData.secret }}</code>
      </div>

      <p>{{ t('settings.security.totp.enableStep2') }}</p>
      <input v-model="setupCode" type="text" :placeholder="t('public.login.OTP_2FA.placeholder')" maxlength="6" />

      <div class="footer">
        <AppButton type="secondary" @click="setupMode = false">{{ t('common.actions.cancel') }}</AppButton>
        <AppButton type="primary" @click="confirm2FA">{{ t('common.actions.confirm') }}</AppButton>
      </div>

      <p v-if="setupError" class="error">{{ setupError }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import Disable2FAModal from './Disable2FA.vue';
import BackupCodes2FA from './BackupCodes2FA.vue';

const userStore = useUserStore();

const modals = useModal();
const { t } = useI18nT();

const setupMode = ref(false);
const setupCode = ref('');
const setupError = ref('');
const totpData = ref({ secret: '', qr_code_url: '' });

async function start2FASetup() {
  setupError.value = '';
  try {
    const data = await userStore.request2FA();
    totpData.value = data!;
    setupMode.value = true;
  } catch (err) {
    setupError.value = (err as string) || 'Failed to initiate 2FA setup';
  }
}

async function confirm2FA() {
  setupError.value = '';
  try {
    const backupCodes = await userStore.confirm2FA(totpData.value.secret, setupCode.value);
    setupMode.value = false;
    setupCode.value = '';
    modals.add(new Modal(shallowRef(BackupCodes2FA), { size: 'small', props: { backupCodes } }));
  } catch (err) {
    setupError.value = (err as string) || 'Invalid code. Activation failed.';
  }
}

function disable2FA() {
  modals.add(new Modal(shallowRef(Disable2FAModal), { size: 'small' }));
}
</script>

<style scoped lang="scss">
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2.5rem;
}

.section-description {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.enabled {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-primary);

  strong {
    color: var(--green);
  }
}

.setup-wizard {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-overlay);

  p {
    margin: 0;
    font-size: 0.95rem;
  }
}

.qr-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: fit-content;
  padding: 1.5rem;
  border: 1px solid var(--border);
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
</style>
