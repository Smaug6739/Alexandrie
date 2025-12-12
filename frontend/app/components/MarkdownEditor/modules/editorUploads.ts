import { EditorView } from '@codemirror/view';
import type { Node } from '~/stores';

interface UploadHandlersParams {
  resourcesStore: any;
  CDN: string;
  insertText: (text: string) => void;
}

export function createUploadsHandlers({ resourcesStore, CDN, insertText }: UploadHandlersParams) {
  return EditorView.domEventHandlers({
    paste: event => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (!file) return;
          const body = new FormData();
          body.append('file', file);
          resourcesStore.post(body).then((result: Node) => {
            const url = `${CDN}/${(result as Node).user_id}/${(result as Node).content_compiled}`;
            insertText(`![${file.name}](${url})\n`);
          });
        }
      }
    },
    drop: event => {
      const items = event.dataTransfer?.items;
      if (!items) return;
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (!file) return;
          const body = new FormData();
          body.append('file', file);
          resourcesStore.post(body).then((result: Node) => {
            const url = `${CDN}/${(result as Node).user_id}/${(result as Node).content_compiled}`;
            insertText(`![${file.name}](${url})\n`);
          });
        }
      }
    },
  });
}
