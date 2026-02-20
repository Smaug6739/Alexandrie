import type { EditorView } from '@codemirror/view';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/** A single mapping between a source line and a position in the preview. */
interface ScrollAnchor {
  /** 0-based line number in the markdown source */
  sourceLine: number;
  /** Offset (px) from the top of the preview's scrollable content */
  offsetTop: number;
}

/**
 * Subset of EditorView used by the scroll-sync logic.
 * Avoids tight coupling to the exact EditorView class (which can differ
 * across package versions when used through a Vue ref).
 */
type EditorViewLike = Pick<EditorView, 'scrollDOM' | 'state' | 'lineBlockAtHeight'>;

interface ScrollSyncOptions {
  getView: () => EditorViewLike | null;
  getPreview: () => HTMLElement | undefined;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Build an ordered list of anchors by querying every element that carries a
 * `data-source-line` attribute inside the preview container.
 *
 * Each anchor records:
 *  – the 0-based source line
 *  – its vertical position (px) inside the scrollable preview content
 */
function buildAnchors(preview: HTMLElement): ScrollAnchor[] {
  const elements = preview.querySelectorAll<HTMLElement>('[data-source-line]');
  if (elements.length === 0) return [];

  const containerRect = preview.getBoundingClientRect();
  const scrollTop = preview.scrollTop;
  const anchors: ScrollAnchor[] = [];

  for (const el of elements) {
    const line = parseInt(el.getAttribute('data-source-line')!, 10);
    if (Number.isNaN(line)) continue;

    const rect = el.getBoundingClientRect();
    // Position relative to the preview's scroll content (not the viewport)
    anchors.push({
      sourceLine: line,
      offsetTop: rect.top - containerRect.top + scrollTop,
    });
  }

  anchors.sort((a, b) => a.sourceLine - b.sourceLine);
  return anchors;
}

/**
 * Determine which source line (0-based, fractional) is currently at the very
 * top of the CodeMirror viewport.
 */
function getEditorTopLine(view: EditorViewLike): number {
  const scrollTop = view.scrollDOM.scrollTop;
  if (scrollTop <= 0) return 0;

  const block = view.lineBlockAtHeight(scrollTop);
  const docLine = view.state.doc.lineAt(block.from);
  const fraction = block.height > 0 ? Math.max(0, Math.min(1, (scrollTop - block.top) / block.height)) : 0;

  return docLine.number - 1 + fraction; // 0-based + fraction
}

/**
 * Given a fractional source line and a sorted list of anchors, compute the
 * target scroll position (px) in the preview pane using linear interpolation
 * between the two closest anchors.
 */
function computePreviewScroll(effectiveLine: number, anchors: ScrollAnchor[], totalLines: number, previewScrollHeight: number): number {
  // Find the two bracketing anchors
  let lower: ScrollAnchor | null = null;
  let upper: ScrollAnchor | null = null;

  for (const a of anchors) {
    if (a.sourceLine <= effectiveLine) {
      lower = a;
    } else {
      upper = a;
      break;
    }
  }

  if (lower && upper) {
    // Standard case – interpolate between two known anchors
    const range = upper.sourceLine - lower.sourceLine;
    const t = range > 0 ? (effectiveLine - lower.sourceLine) / range : 0;
    return lower.offsetTop + t * (upper.offsetTop - lower.offsetTop);
  }

  if (lower && !upper) {
    // Past the last anchor – interpolate towards the very bottom
    const remainingLines = totalLines - lower.sourceLine;
    const remainingHeight = previewScrollHeight - lower.offsetTop;

    if (remainingLines > 0) {
      const t = (effectiveLine - lower.sourceLine) / remainingLines;
      return lower.offsetTop + t * remainingHeight;
    }
    return lower.offsetTop;
  }

  if (!lower && upper) {
    // Before the first anchor – interpolate from the top
    const t = upper.sourceLine > 0 ? effectiveLine / upper.sourceLine : 0;
    return t * upper.offsetTop;
  }

  return 0;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Creates a scroll synchronisation controller that maps the CodeMirror
 * editor's scroll position to the corresponding position in the rendered
 * markdown preview using source-line anchors.
 *
 * Unlike a naïve percentage-based approach this handles:
 *  – images / media (1 line in source, large block in preview)
 *  – code blocks, tables, math blocks
 *  – typing at the end of the document (snaps preview to bottom)
 */
export function createScrollSync({ getView, getPreview }: ScrollSyncOptions) {
  let rafId: number | null = null;

  /**
   * Call this from the editor's `scroll` event listener (or after content
   * changes) to update the preview scroll position.
   */
  function syncEditorToPreview() {
    // Cancel any pending frame to avoid fighting with itself
    if (rafId !== null) cancelAnimationFrame(rafId);

    rafId = requestAnimationFrame(() => {
      rafId = null;

      const view = getView();
      const preview = getPreview();
      if (!view || !preview) return;

      const scrollDOM = view.scrollDOM;
      const maxEditorScroll = scrollDOM.scrollHeight - scrollDOM.clientHeight;
      const maxPreviewScroll = preview.scrollHeight - preview.clientHeight;

      // Nothing to scroll
      if (maxEditorScroll <= 0 || maxPreviewScroll <= 0) {
        preview.scrollTop = 0;
        return;
      }

      // ── Edge: editor at the very top ──────────────────────────
      if (scrollDOM.scrollTop <= 2) {
        preview.scrollTop = 0;
        return;
      }

      // ── Edge: editor at the very bottom ───────────────────────
      if (scrollDOM.scrollTop >= maxEditorScroll - 2) {
        preview.scrollTop = maxPreviewScroll;
        return;
      }

      // ── General case: anchor-based interpolation ──────────────
      const anchors = buildAnchors(preview);

      if (anchors.length === 0) {
        // Fallback – no anchors, use percentage
        preview.scrollTop = (scrollDOM.scrollTop / maxEditorScroll) * maxPreviewScroll;
        return;
      }

      const effectiveLine = getEditorTopLine(view);
      const totalLines = view.state.doc.lines;

      const targetScroll = computePreviewScroll(effectiveLine, anchors, totalLines, preview.scrollHeight);

      preview.scrollTop = Math.max(0, Math.min(maxPreviewScroll, targetScroll));
    });
  }

  /** Clean up any pending animation frame. */
  function dispose() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  return { syncEditorToPreview, dispose } as const;
}
