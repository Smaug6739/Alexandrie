<template>
  <div class="drawio-editor-modal">
    <aside>
      <input v-model="node.name" type="text" :placeholder="t('common.labels.name')" />

      <button class="btn-icon" @click="requestSaveDiagram">
        <Icon name="save" display="lg" />
        <p class="hint-tooltip">{{ t('common.actions.save') }}</p>
      </button>
    </aside>

    <div class="drawio-content">
      <iframe :key="iframeKey" ref="iframe" class="drawio-iframe" :src="iframeUrl" />

      <div v-if="!isReady" class="loading-overlay">
        <LoaderSpinner />
        <p>{{ t('common.status.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Node } from '~/stores';

const { t } = useI18nT();
const router = useRouter();

const iframe = ref<HTMLIFrameElement | null>(null);
const iframeKey = ref(0);

const iframeUrl = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json';

const node: Ref<Partial<Node>> = ref({});
const { handleMessage, isReady } = useDrawioIframe(iframe);

function requestSaveDiagram() {
  if (!isReady.value) return;
  postMessageToIframe({
    action: 'export',
    format: 'xmlsvg',
    xml: true,
  });
}

function postMessageToIframe(msg: object) {
  if (!iframe.value?.contentWindow) return;
  iframe.value.contentWindow.postMessage(JSON.stringify(msg), '*');
}
const exitHandleMessage = async (e: MessageEvent) => {
  const result = await handleMessage(e, node.value.name);
  if (result) router.push(`/dashboard/cdn`);
};

onMounted(() => window.addEventListener('message', exitHandleMessage));

onBeforeUnmount(() => window.removeEventListener('message', exitHandleMessage));
</script>

<style scoped lang="scss">
.drawio-editor-modal {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

aside {
  display: flex;
  align-items: center;
  gap: 12px;
}

.drawio-content {
  position: relative;
  min-height: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-base);
  flex: 1;
  overflow: hidden;
}

.drawio-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: var(--surface-base);
}

.loading-overlay {
  position: absolute;
  z-index: 10;
  display: flex;
  background: var(--surface-base);
  align-items: center;
  flex-direction: column;
  gap: 12px;
  inset: 0;
  justify-content: center;

  p {
    font-size: 14px;
    color: var(--text-secondary);
  }
}

@media (width <= 900px) {
  .drawio-editor-modal {
    height: 60vh;
  }
}

@media (width <= 600px) {
  .drawio-editor-modal {
    height: 50vh;
  }
}
</style>
