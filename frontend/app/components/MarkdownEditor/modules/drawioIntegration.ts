import type { Ref } from 'vue';
import type { Node } from '~/stores';
import type { EditorView } from '@codemirror/view';
import {
  buildDrawioFilename,
  extractMarkdownImageUrls,
  extractMxfileFromSvg,
  isDrawioResource,
  normalizeUrl,
  normalizeDrawioSvg,
  type DrawioExportPayload,
} from './drawio';

export interface DrawioIntegrationParams {
  editorView: Ref<EditorView | null>;
  document: Ref<Partial<Node>>;
  resourcesStore: ReturnType<typeof useResourcesStore>;
  nodesStore: ReturnType<typeof useNodesStore>;
  resourceURL: (node: Node) => string;
  insertText: (text: string) => void;
  showNotification: (title: string, message: string, type: 'success' | 'error' | 'warning') => void;
}

export class DrawioIntegration {
  private params: DrawioIntegrationParams;

  constructor(params: DrawioIntegrationParams) {
    this.params = params;
  }

  getReferencedDiagrams(): Node[] {
    const content = this.params.document.value.content || '';
    const urls = extractMarkdownImageUrls(content);
    const diagrams: Node[] = [];
    const seen = new Set<string>();

    this.params.nodesStore.resources.forEach((resource: Node) => {
      if (!isDrawioResource(resource)) return;
      const resUrl = normalizeUrl(this.params.resourceURL(resource));
      if (urls.includes(resUrl) && !seen.has(resource.id)) {
        diagrams.push(resource);
        seen.add(resource.id);
      }
    });

    return diagrams;
  }

  async loadDiagramXml(resource: Node): Promise<string> {
    try {
      const url = this.params.resourceURL(resource);
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
      this.params.showNotification('Warning', 'Unable to load the existing diagram. A new diagram will be opened.', 'warning');
      return '';
    }
  }

  replaceDiagramUrl(oldResource: Node, newResource: Node): void {
    const view = this.params.editorView.value;
    if (!view) return;

    const oldUrl = normalizeUrl(this.params.resourceURL(oldResource));
    const newUrl = normalizeUrl(this.params.resourceURL(newResource));
    const fullDoc = view.state.doc.toString();
    const index = fullDoc.indexOf(oldUrl);

    if (index < 0) {
      this.params.insertText(`\n![${newResource.name}](${newUrl})\n`);
      return;
    }

    view.dispatch({
      changes: { from: index, to: index + oldUrl.length, insert: newUrl },
      selection: { anchor: index + newUrl.length },
    });
    view.focus();
  }

  async saveDiagram(payload: DrawioExportPayload, editingResource: Node | null): Promise<void> {
    const nodeId = this.params.document.value.id;
    if (!nodeId) {
      this.params.showNotification('Warning', 'Save the document first to attach diagrams to it.', 'warning');
      return;
    }

    try {
      const filename = buildDrawioFilename(this.params.document.value.name || 'diagram');

      console.log('[DrawioIntegration] saveDiagram called with payload:', {
        xmlLength: payload.xml?.length,
        svgLength: payload.svg.length,
        svgStart: payload.svg.substring(0, 100),
      });

      const svgContent = normalizeDrawioSvg(payload.svg);

      console.log('[DrawioIntegration] Creating file with content length:', svgContent.length);
      console.log('[DrawioIntegration] File content starts with:', svgContent.substring(0, 200));

      const file = new File([svgContent], filename, { type: 'image/svg+xml' });

      console.log('[DrawioIntegration] File created:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      const body = new FormData();
      body.append('parent_id', nodeId);
      body.append('file', file);

      console.log('[DrawioIntegration] Uploading diagram...');
      const savedResource = await this.params.resourcesStore.post(body);

      console.log('[DrawioIntegration] Diagram saved:', {
        id: savedResource.id,
        name: savedResource.name,
        url: this.params.resourceURL(savedResource),
      });

      if (editingResource) {
        this.replaceDiagramUrl(editingResource, savedResource);
      } else {
        this.params.insertText(`\n![${savedResource.name}](${this.params.resourceURL(savedResource)})\n`);
      }

      this.params.showNotification('Success', 'Diagram saved and linked to this document.', 'success');
    } catch (error) {
      console.error('[DrawioIntegration] Error saving diagram:', error);
      this.params.showNotification('Error', String(error), 'error');
      throw error;
    }
  }

  async deleteDiagram(resource: Node): Promise<void> {
    const view = this.params.editorView.value;
    if (!view) return;

    const url = normalizeUrl(this.params.resourceURL(resource));
    const fullDoc = view.state.doc.toString();
    const regex = new RegExp(`!\\[[^\\]]*\\]\\(${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');

    const changes: Array<{ from: number; to: number; insert: string }> = [];
    let match;

    while ((match = regex.exec(fullDoc)) !== null) {
      changes.push({
        from: match.index,
        to: match.index + match[0].length,
        insert: '',
      });
    }

    if (changes.length > 0) {
      view.dispatch({ changes });
      view.focus();
    }

    this.params.showNotification('Success', 'Diagram removed from document.', 'success');
  }
}
