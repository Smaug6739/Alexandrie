export interface DrawioExportPayload {
  svg: string;
  xml?: string;
}

const DRAWIO_SVG_DATA_URI_PREFIX = 'data:image/svg+xml;base64,';

function base64ToUtf8(base64: string): string {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

export function normalizeDrawioSvg(svgText: string): string {
  const trimmed = svgText.trim();

  if (trimmed.startsWith(DRAWIO_SVG_DATA_URI_PREFIX)) {
    const encoded = trimmed.slice(DRAWIO_SVG_DATA_URI_PREFIX.length);
    return base64ToUtf8(encoded);
  }

  if (trimmed.startsWith('data:image/svg+xml,')) {
    return decodeURIComponent(trimmed.slice('data:image/svg+xml,'.length));
  }

  return trimmed;
}

export function extractMxfileFromSvg(svgText: string): string | null {
  if (!svgText) return null;

  const normalizedSvg = normalizeDrawioSvg(svgText);

  // Try to extract content attribute directly with regex first (faster, no DOM parsing needed)
  const contentMatch = normalizedSvg.match(/content="([^"]*)"/);
  if (contentMatch && contentMatch[1]) {
    try {
      // The content is already XML-encoded in the attribute, we need to decode it
      const textarea = document.createElement('textarea');
      textarea.innerHTML = contentMatch[1];
      const decoded = textarea.value;

      if (decoded && decoded.includes('<mxfile')) {
        return decoded;
      }
    } catch {
      // Fall through to DOM parser
    }
  }

  // Fallback to DOM parsing
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(normalizedSvg, 'image/svg+xml');

    // Check for parsing errors
    if (doc.documentElement.tagName === 'parsererror') {
      return null;
    }

    const svg = doc.documentElement;
    if (!svg || svg.tagName.toLowerCase() !== 'svg') return null;

    const encoded = svg.getAttribute('content') || '';
    if (!encoded) return null;

    const textarea = document.createElement('textarea');
    textarea.innerHTML = encoded;
    const decoded = textarea.value;

    if (!decoded.includes('<mxfile')) return null;
    return decoded;
  } catch {
    return null;
  }
}

function formatDate(d: Date) {
  return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
}

export function buildDrawioFilename(baseName: string): string {
  const sanitized = (baseName || 'diagram')
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const safeBase = sanitized || 'diagram';

  const suffix = formatDate(new Date());

  return `${safeBase}-${suffix}`;
}
