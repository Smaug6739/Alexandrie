import { EditorView } from '@codemirror/view';
import type { Node } from '~/stores';

interface UploadHandlersParams {
  resourcesStore: ReturnType<typeof import('~/stores').useResourcesStore>;
  insertText: (text: string) => void;
}

export function createUploadsHandlers({ resourcesStore, insertText }: UploadHandlersParams) {
  const { resourceURL } = useApi();
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
            insertText(`![${file.name}](${resourceURL(result)})\n`);
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
            insertText(`![${file.name}](${resourceURL(result)})\n`);
          });
        }
      }
    },
  });
}
