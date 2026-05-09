<template>
  <div class="drawio-editor-modal">
    <EditorAppHeader icon="image" :title="t('markdown.drawio.title')">
      <template #toolbar>
        <div class="btn-icon" :class="{ disabled: !isReady }" @click="requestSaveDiagram">
          <Icon name="save" display="lg" />
        </div>
        <div class="btn-icon" :class="{ disabled: !isReady }" @click="toggleFullScreen">
          <Icon name="fullsreen" display="lg" />
        </div>
        <div class="btn-icon" :class="{ disabled: !isReady }" @click="openDeleteModal">
          <Icon name="delete" display="lg" />
        </div>
      </template>
    </EditorAppHeader>

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
import EditorAppHeader from '~/components/MarkdownEditor/EditorAppHeader.vue';
import NodeDeleteModal from '~/components/Node/Modals/Delete.vue';
import type { Node } from '~/stores';

const { t } = useI18nT();

interface Props {
  modalRef: Modal;
  parentNode?: Node;
  node?: Node;
  insertText?: (text: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  node: undefined,
  parentNode: undefined,
  insertText: undefined,
});

const emit = defineEmits<{ (e: 'close'): void }>();

const modals = useModal();

const iframe = ref<HTMLIFrameElement | null>(null);
const iframeKey = ref(0);

const iframeUrl = 'https://embed.diagrams.net/?embed=1&ui=min&spin=1&proto=json';

const { handleMessage, isReady } = useDrawioIframe(iframe, props.node, props.parentNode, props.insertText);

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
const toggleFullScreen = () => {
  if (!props.modalRef) return;
  // eslint-disable-next-line vue/no-mutating-props
  props.modalRef.options.size = props.modalRef.options.size === 'full' ? 'large' : 'full';
};

const openDeleteModal = () => {
  if (!props.node) return;

  modals.add(
    new Modal(shallowRef(NodeDeleteModal), {
      props: {
        node: props.node,
      },
      onClose: () => emit('close'),
      size: 'small',
    }),
  );
};

const exitHandleMessage = async (e: MessageEvent) => {
  const result = await handleMessage(e);
  if (result) emit('close');
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
