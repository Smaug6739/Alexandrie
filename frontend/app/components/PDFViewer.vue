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
  scale?: number;
}

interface PageInfo {
  num: number;
  width: number;
  height: number;
  rendered: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  scale: 1,
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
  if (el) {
    pageRefs.set(pageNum, el);
  } else {
    pageRefs.delete(pageNum);
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
    const page: PDFPageProxy = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: props.scale });

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

    // Mark the page as rendered
    const pageInfo = pages.value.find(p => p.num === pageNum);
    if (pageInfo) {
      pageInfo.rendered = true;
    }
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
          if (pageNum) {
            renderPage(pageNum);
          }
        }
      }
    },
    {
      root: containerRef.value,
      rootMargin: '200px 0px', // Pre-render nearby pages
      threshold: 0,
    },
  );

  // Observe all page wrappers
  nextTick(() => {
    for (const [pageNum, el] of pageRefs) {
      el.setAttribute('data-page', String(pageNum));
      observer?.observe(el);
    }
  });
};

const loadPdf = async () => {
  if (!props.src) return;

  // Reset state
  loading.value = true;
  error.value = null;
  pages.value = [];
  renderedPages.clear();
  renderingPages.clear();
  pageRefs.clear();

  // Cleanup previous
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

    // Calculate dimensions for each page
    const pagesInfo: PageInfo[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: props.scale });
      pagesInfo.push({
        num: i,
        width: viewport.width,
        height: viewport.height,
        rendered: false,
      });
    }

    pages.value = pagesInfo;
    loading.value = false;

    // Setup intersection observer after DOM rendering
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
  () => props.scale,
  async () => {
    if (!pdf) return;

    // Recalculer les dimensions et re-render
    renderedPages.clear();
    renderingPages.clear();

    for (const page of pages.value) {
      const pdfPage = await pdf.getPage(page.num);
      const viewport = pdfPage.getViewport({ scale: props.scale });
      page.width = viewport.width;
      page.height = viewport.height;
      page.rendered = false;
    }

    // Re-trigger observer
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
  height: 100%;
  overflow-y: auto;
}

.pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  color: var(--red-dark);
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
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  background: #f5f5f5;
}
</style>
