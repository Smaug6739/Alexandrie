<template>
  <div ref="containerRef" class="pdf-container">
    <!-- Loading state -->
    <Loader v-if="loading" />

    <!-- Error state -->
    <div v-else-if="error" class="pdf-error">
      <span>{{ error }}</span>
    </div>

    <!-- PDF pages -->
    <template v-else>
      <div
        v-for="page in pages"
        :key="page.num"
        :ref="el => setPageRef(el as HTMLElement | null, page.num)"
        class="pdf-page-wrapper"
        :style="{ height: `${page.height}px`, width: `${page.width}px` }"
      >
        <canvas v-show="page.rendered" class="pdf-canvas" />
        <div v-if="!page.rendered" class="pdf-page-placeholder">
          <span>Page {{ page.num }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';

import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

interface Props {
  src: string;
  zoom?: number | 'automatic_zoom' | 'actual_size' | 'page_fit' | 'page_width';
}

interface PageInfo {
  num: number;
  width: number;
  height: number;
  rendered: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 'automatic_zoom',
});

const containerRef = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const pages = ref<PageInfo[]>([]);

let pdf: PDFDocumentProxy | null = null;
let observer: IntersectionObserver | null = null;
const pageRefs = new Map<number, HTMLElement>();
const renderingPages = new Set<number>();
const renderedPages = new Set<number>();

const setPageRef = (el: HTMLElement | null, pageNum: number) => {
  if (el) pageRefs.set(pageNum, el);
  else pageRefs.delete(pageNum);
};

const computeScale = (page: PDFPageProxy) => {
  const container = containerRef.value;
  if (!container) return 1;

  switch (props.zoom) {
    case 'actual_size':
      return 1;
    case 'page_fit': {
      const viewport = page.getViewport({ scale: 1 });
      const scaleX = container.clientWidth / viewport.width;
      const scaleY = container.clientHeight / viewport.height;
      return Math.min(scaleX, scaleY);
    }
    case 'page_width': {
      const viewport = page.getViewport({ scale: 1 });
      return container.clientWidth / viewport.width;
    }
    case 'automatic_zoom': {
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = container.clientWidth;

      const scaleWidth = containerWidth / viewport.width;

      return Math.min(scaleWidth * 0.9, 1.5); // Limit max zoom to 150%
    }
    default:
      if (typeof props.zoom === 'number') return props.zoom;
      return 1;
  }
};

const renderPage = async (pageNum: number) => {
  if (!pdf || renderingPages.has(pageNum) || renderedPages.has(pageNum)) return;

  const wrapper = pageRefs.get(pageNum);
  if (!wrapper) return;

  const canvas = wrapper.querySelector('canvas');
  if (!canvas) return;

  renderingPages.add(pageNum);

  try {
    const page = await pdf.getPage(pageNum);
    const scale = computeScale(page);
    const viewport = page.getViewport({ scale });

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    await page.render({
      canvasContext: ctx,
      canvas,
      viewport,
    }).promise;

    const pageInfo = pages.value.find(p => p.num === pageNum);
    if (pageInfo) pageInfo.rendered = true;

    renderedPages.add(pageNum);
  } catch (err) {
    console.error(`Erreur rendu page ${pageNum}:`, err);
  } finally {
    renderingPages.delete(pageNum);
  }
};

const setupObserver = () => {
  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const pageNum = Number(entry.target.getAttribute('data-page'));
          if (pageNum) renderPage(pageNum);
        }
      }
    },
    {
      root: containerRef.value,
      rootMargin: '200px 0px',
      threshold: 0,
    },
  );

  nextTick(() => {
    for (const [pageNum, el] of pageRefs) {
      el.setAttribute('data-page', String(pageNum));
      observer?.observe(el);
    }
  });
};

const loadPdf = async () => {
  if (!props.src) return;

  loading.value = true;
  error.value = null;
  pages.value = [];
  renderedPages.clear();
  renderingPages.clear();
  pageRefs.clear();

  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (pdf) {
    pdf.destroy();
    pdf = null;
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      url: props.src,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
    });

    pdf = await loadingTask.promise;

    const pagesInfo: PageInfo[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = computeScale(page);
      const viewport = page.getViewport({ scale });
      pagesInfo.push({
        num: i,
        width: viewport.width,
        height: viewport.height,
        rendered: false,
      });
    }

    pages.value = pagesInfo;
    loading.value = false;

    await nextTick();
    setupObserver();
  } catch {
    error.value = 'Could not load PDF.';
    loading.value = false;
  }
};

onMounted(loadPdf);

watch(() => props.src, loadPdf);

watch(
  () => props.zoom,
  async () => {
    if (!pdf) return;

    renderedPages.clear();
    renderingPages.clear();

    for (const page of pages.value) {
      const pdfPage = await pdf.getPage(page.num);
      const scale = computeScale(pdfPage);
      const viewport = pdfPage.getViewport({ scale });
      page.width = viewport.width;
      page.height = viewport.height;
      page.rendered = false;
    }

    await nextTick();
    if (observer) {
      observer.disconnect();
      setupObserver();
    }
  },
);

onBeforeUnmount(() => {
  observer?.disconnect();
  pdf?.destroy();
});
</script>

<style scoped lang="scss">
.pdf-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.pdf-error {
  display: flex;
  height: 100%;
  color: var(--red-dark);
  align-items: center;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.pdf-page-wrapper {
  position: relative;
  margin: 0 auto 16px;
  border: 1px solid var(--border-color);
}

.pdf-canvas {
  display: block;
  padding: 2px;
}

.pdf-page-placeholder {
  position: absolute;
  display: flex;
  font-size: 14px;
  color: #999;
  background: #f5f5f5;
  align-items: center;
  inset: 0;
  justify-content: center;
}
</style>
