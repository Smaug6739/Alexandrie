<template>
  <div ref="rootRef" class="pdf-thumbnail">
    <canvas v-show="rendered" ref="canvasRef" class="pdf-thumbnail__canvas" :aria-label="alt" role="img" />
    <img v-if="!rendered" :src="placeholder" :alt="alt" class="pdf-thumbnail__placeholder" />
  </div>
</template>

<script setup lang="ts">
import { GlobalWorkerOptions, getDocument, type PDFDocumentLoadingTask, type RenderTask } from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * First-page preview of a PDF. The document is only fetched and rendered once the thumbnail
 * becomes visible, so long lists of files do not download every PDF upfront.
 * The placeholder is kept when the PDF cannot be loaded.
 */
const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    placeholder?: string;
  }>(),
  {
    alt: '',
    placeholder: '/placeholder/pdf.webp',
  },
);

const DEFAULT_WIDTH = 220; // Used when the element has no layout yet

const rootRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const rendered = ref(false);

let observer: IntersectionObserver | null = null;
let loadingTask: PDFDocumentLoadingTask | null = null;
let renderTask: RenderTask | null = null;
let version = 0; // Invalidates a render in progress when the source changes or the component is unmounted

const release = () => {
  renderTask?.cancel();
  renderTask = null;
  // Destroying the loading task also frees the document and the worker resources
  loadingTask?.destroy();
  loadingTask = null;
};

const renderFirstPage = async () => {
  const canvas = canvasRef.value;
  if (!canvas || !props.src) return;

  const current = ++version;
  release();

  try {
    const task = getDocument({ url: props.src, disableAutoFetch: true });
    loadingTask = task;
    const pdf = await task.promise;
    const page = await pdf.getPage(1);
    if (current !== version) return;

    const baseViewport = page.getViewport({ scale: 1 });
    const scale = (rootRef.value?.clientWidth || DEFAULT_WIDTH) / baseViewport.width;
    const outputScale = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale * outputScale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    renderTask = page.render({ canvasContext: canvas.getContext('2d')!, canvas, viewport });
    await renderTask.promise;
    if (current !== version) return;

    rendered.value = true;
  } catch {
    // Cancelled render or unreadable PDF: keep the placeholder
  } finally {
    if (current === version) release();
  }
};

const observe = () => {
  observer?.disconnect();
  rendered.value = false;
  if (!rootRef.value) return;
  observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer?.disconnect();
      observer = null;
      renderFirstPage();
    },
    { rootMargin: '200px' },
  );
  observer.observe(rootRef.value);
};

onMounted(observe);
watch(() => props.src, observe);

onBeforeUnmount(() => {
  version++;
  observer?.disconnect();
  release();
});
</script>

<style scoped lang="scss">
.pdf-thumbnail {
  position: relative;
  background: var(--surface-raised);
  overflow: hidden;
}

.pdf-thumbnail__canvas,
.pdf-thumbnail__placeholder {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
</style>
