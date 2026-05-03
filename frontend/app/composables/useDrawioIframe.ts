import { normalizeDrawioSvg, extractMxfileFromSvg, buildDrawioFilename } from '~/helpers/drawio';
import type { Node } from '~/stores';
import { notifyDrawioCacheInvalidated } from '~/composables/useDrawioCache';

export function useDrawioIframe(iframe: Ref<HTMLIFrameElement | null>, node?: Node, parentNode?: Node, insertText: (text: string) => void = () => {}) {
  const isReady = ref(false);
  const { resourceURL } = useApi();
  const notifications = useNotifications();
  const resourcesStore = useResourcesStore();
  const mode = useColorMode();

  async function loadDiagram() {
    postMessageToIframe({
      action: 'load',
      autosave: 1,
      xml: await loadDiagramXml(),
      noSaveBtn: true,
      noExitBtn: true,
      saveAndExit: false,
      dark: mode.value === 'dark',
    });
  }

  function postMessageToIframe(msg: object) {
    if (!iframe.value?.contentWindow) return;
    iframe.value.contentWindow.postMessage(JSON.stringify(msg), '*');
  }

  async function loadDiagramXml(): Promise<string> {
    try {
      const url = resourceURL(node);
      if (!url || !node) return '';
      const response = await fetch(url, { credentials: 'include' });

      if (!response.ok) {
        console.error(`Failed to fetch diagram: ${response.status} ${response.statusText}`);
        throw new Error(`HTTP ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('svg')) {
        console.warn(`Expected SVG but got Content-Type: ${contentType}`);
      }

      const svg = normalizeDrawioSvg(await response.text());

      if (!svg.trim().startsWith('<')) {
        console.error('Response does not appear to be SVG:', svg.substring(0, 100));
        throw new Error('Invalid SVG format received');
      }

      const xml = extractMxfileFromSvg(svg);
      if (!xml) {
        console.warn('No mxfile XML found in SVG, diagram will open blank');
        return '';
      }

      return xml;
    } catch (error) {
      console.error('Error loading diagram:', error);
      notifications.add({ title: 'Warning', message: 'Unable to load the existing diagram. A new diagram will be opened.', type: 'warning' });
      return '';
    }
  }

  async function saveDiagram(svg: string, diagram_name?: string): Promise<void> {
    const parentId = parentNode?.id;
    const isNew = !node;

    try {
      const filename = diagram_name || node?.name || buildDrawioFilename(parentNode?.name || 'diagram');
      const svgContent = normalizeDrawioSvg(svg);

      const file = new File([svgContent], filename, { type: 'image/svg+xml' });

      const body = new FormData();
      if (parentId) body.append('parent_id', parentId);
      body.append('file', file);
      body.append('metadata', JSON.stringify({ drawio: true }));

      let savedResource: Node;

      if (node) {
        savedResource = await resourcesStore.update(node.id, body);
      } else {
        savedResource = await resourcesStore.post(body);
      }

      if (isNew) {
        insertText(`\n![${savedResource.name}](${resourceURL(savedResource)})\n`);
      } else {
        notifyDrawioCacheInvalidated({ id: savedResource.id, resource: savedResource });
      }

      notifications.add({ title: 'Success', message: 'Diagram saved and linked to this document.', type: 'success' });
    } catch (error) {
      console.error('[DrawioIntegration] Error saving diagram:', error);
      notifications.add({ title: 'Error', message: String(error), type: 'error' });
      throw error;
    }
  }

  async function handleMessage(event: MessageEvent, diagram_name?: string): Promise<boolean> {
    if (event.source !== iframe.value?.contentWindow) {
      return false;
    }

    if (!event.data) {
      return false;
    }

    let data: Record<string, unknown>;

    if (typeof event.data === 'object') {
      data = event.data;
    } else if (typeof event.data === 'string') {
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.error('[DrawioEditor] Failed to parse message:', e);
        return false;
      }
    } else {
      console.warn('[DrawioEditor] Unexpected message type:', typeof event.data);
      return false;
    }

    if (data.event === 'init') {
      isReady.value = true;
      loadDiagram();
      return false;
    }

    if (data.event === 'export' && typeof data.data === 'string') {
      const svg = data.data;
      //const xml = typeof data.xml === 'string' ? data.xml : extractMxfileFromSvg(svg) || undefined;

      await saveDiagram(svg, diagram_name);

      return true;
    }

    if (data.event === 'exit') return true;
    return false;
  }

  return {
    handleMessage,
    isReady: computed(() => isReady.value),
  };
}
