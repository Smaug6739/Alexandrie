import { EditorView } from '@codemirror/view';
import { parseClipboard } from '~/helpers/clipboard/parse';

interface UploadHandlersParams {
  nodeId?: string;
  insertText: (text: string) => void;
}

/**
 * Paste and drop both hand the editor the same kind of payload, so both go through
 * the clipboard import module: files and remote images are stored as resources, and
 * the markdown that references them is inserted at the cursor.
 */
export function createUploadsHandlers({ nodeId, insertText }: UploadHandlersParams) {
  const { importFrom } = useClipboardImport(nodeId);
  const { add } = useNotifications();
  const { t } = useI18nT();

  async function handle(data: DataTransfer | null, event: Event) {
    const { kind } = parseClipboard(data);

    // Plain text is left to CodeMirror: it already handles selections, indentation
    // and undo grouping better than re-inserting the text ourselves.
    if (kind === 'empty' || kind === 'plain') return;

    event.preventDefault();

    const result = await importFrom(data);
    if (result.markdown) insertText(`${result.markdown}\n`);

    if (result.failed || result.skipped) {
      add({
        title: t('components.editor.clipboard.partialImportTitle'),
        message: t('components.editor.clipboard.partialImport', { uploaded: result.uploaded, remaining: result.failed + result.skipped }),
        type: 'warning',
        timeout: 6000,
      });
    }
  }

  return EditorView.domEventHandlers({
    paste: (event, _view) => {
      handle(event.clipboardData, event);
    },
    drop: (event, _view) => {
      handle(event.dataTransfer, event);
    },
  });
}
