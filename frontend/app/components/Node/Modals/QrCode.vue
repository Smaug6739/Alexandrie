<template>
  <div class="modal">
    <h3>{{ t('nodes.modals.qrCode.title') }}</h3>
    <p>{{ t('nodes.modals.qrCode.description') }}</p>

    <div ref="qrContainer" class="qr-container">
      <QrcodeVue :value="url" :size="220" level="M" render-as="canvas" />
    </div>

    <code class="url">{{ url }}</code>

    <div class="footer">
      <AppButton type="secondary" @click="emit('close')">{{ t('common.actions.close') }}</AppButton>
      <AppButton type="primary" @click="download">{{ t('nodes.modals.qrCode.download') }}</AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

const props = defineProps<{ url: string; name: string }>();
const emit = defineEmits(['close']);

const { t } = useI18nT();

const qrContainer = ref<HTMLElement>();

const download = () => {
  const canvas = qrContainer.value?.querySelector('canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `${props.name}-qrcode.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<style scoped lang="scss">
.qr-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-radius: var(--radius-sm);

  // The QR code is rendered in black, so it always needs a white backdrop to stay scannable in dark mode.
  background: white;
}

.url {
  display: block;
  margin-top: 12px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  overflow-wrap: anywhere;
}
</style>
