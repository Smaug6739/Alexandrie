<template>
  <div class="drawio-editor-modal">
    <EditorAppHeader icon="image" :title="t('markdown.drawio.title')">
      <template #toolbar>
        <div class="btn-icon" :class="{ disabled: !isReady }" @click="saveDiagram">
          <Icon name="save" display="lg" />
        </div>
        <div class="btn-icon" :class="{ disabled: !isReady }" @click="toggleFullScreen">
          <Icon name="fullsreen" display="lg" />
        </div>
      </template>
    </EditorAppHeader>

    <div class="drawio-content">
      <iframe :key="iframeKey" ref="iframe" class="drawio-iframe" :src="iframeUrl" @load="onIframeLoad" />

      <div v-if="!isReady" class="loading-overlay">
        <LoaderSpinner />
        <p>{{ t('common.status.loading') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditorAppHeader from './EditorAppHeader.vue';
import { extractMxfileFromSvg, type DrawioExportPayload } from './modules/drawio';

const { t } = useI18nT();

interface Props {
  initialXml?: string;
  onSave?: (payload: DrawioExportPayload) => void;
  modalRef: Modal;
}

const props = withDefaults(defineProps<Props>(), {
  initialXml: '',
  onSave: undefined,
});

const emit = defineEmits<{ (e: 'close'): void }>();

const iframe = ref<HTMLIFrameElement | null>(null);
const iframeKey = ref(0);
const isReady = ref(false);

const iframeUrl = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json';

function onIframeLoad() {
  // Draw.io sometimes doesn't send init event, try loading after a short delay
  setTimeout(() => {
    loadDiagram();
    isReady.value = true;
  }, 1000);
}

function saveDiagram() {
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
const toggleFullScreen = () => {
  if (!props.modalRef) return;
  // eslint-disable-next-line vue/no-mutating-props
  props.modalRef.options.size = props.modalRef.options.size === 'full' ? 'large' : 'full';
};
function loadDiagram() {
  postMessageToIframe({
    action: 'load',
    autosave: 1,
    xml: props.initialXml || '',
    noSaveBtn: true,
    noExitBtn: true,
    saveAndExit: false,
  });
}

function handleMessage(event: MessageEvent) {
  if (event.source !== iframe.value?.contentWindow) {
    return;
  }

  if (!event.data) {
    return;
  }

  let data: Record<string, unknown>;

  if (typeof event.data === 'object') {
    data = event.data;
  } else if (typeof event.data === 'string') {
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error('[DrawioEditor] Failed to parse message:', e);
      return;
    }
  } else {
    console.warn('[DrawioEditor] Unexpected message type:', typeof event.data);
    return;
  }

  if (data.event === 'init') {
    console.log('[DrawioEditor] Init event received (optional)');
    return;
  }

  if (data.event === 'export' && typeof data.data === 'string') {
    const svg = data.data;
    const xml = typeof data.xml === 'string' ? data.xml : extractMxfileFromSvg(svg) || undefined;
    const payload: DrawioExportPayload = { svg, xml };

    if (props.onSave) {
      props.onSave(payload);
    }

    emit('close');
    return;
  }

  if (data.event === 'exit') emit('close');
}

watch(
  () => props.initialXml,
  () => {
    isReady.value = false;
    iframeKey.value++;
  },
);

onMounted(() => window.addEventListener('message', handleMessage));

onBeforeUnmount(() => window.removeEventListener('message', handleMessage));
</script>

<style scoped lang="scss">
.drawio-editor-modal {
  display: flex;
  flex-direction: column;
  height: 90vh;
  gap: 12px;
}

.drawio-content {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: white;
  border: 1px solid var(--border);
}

.drawio-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;

  p {
    color: var(--text-secondary);
    font-size: 14px;
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
