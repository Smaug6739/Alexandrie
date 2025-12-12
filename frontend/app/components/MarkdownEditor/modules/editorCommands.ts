import ImageSelectorModal from '../ImageSelectorModal.vue';
import GridOrganizationModal from '../GridOrganizationModal.vue';
import ColorPickerModal from '../ColorPickerModal.vue';
import type { EditorView } from '@codemirror/view';
import type { Node } from '~/stores';

export interface CreateCommandsParams {
  getView: () => EditorView | null;
  getDoc: () => Node;
  setDoc: (d: Node) => void;
  showPreview: { value: boolean };
  save: () => void;
}

export function createCommands(params: CreateCommandsParams) {
  function insertText(text: string) {
    const view = params.getView();
    if (!view || !text) return;
    const state = view.state;
    const { from, to } = state.selection.main;
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length, head: from + text.length },
    });
    view.focus();
  }

  function openColorModal() {
    const modalManager = useModal();
    modalManager.add(new Modal(shallowRef(ColorPickerModal), { props: { onColorSelect: handleColorSelect } }));
  }
  function handleColorSelect(color: string) {
    exec('color', color);
  }
  function openImageSelector() {
    const modalManager = useModal();
    modalManager.add(new Modal(shallowRef(ImageSelectorModal), { props: { onImageSelect: handleImageSelect }, size: 'large' }));
  }
  function openGridOrganization() {
    const modalManager = useModal();
    modalManager.add(new Modal(shallowRef(GridOrganizationModal), { props: { onGridSelect: handleGridSelect } }));
  }

  function handleImageSelect(imageUrl: string, altText: string) {
    const view = params.getView();
    if (!view) return;
    const state = view.state;
    const { from, to } = state.selection.main;
    const selectedText = state.sliceDoc(from, to);
    const alt = selectedText || altText;
    const insert = `![${alt}](${imageUrl})`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + insert.length, head: from + insert.length },
    });
    view.focus();
  }

  function handleGridSelect(gridMarkdown: string) {
    const view = params.getView();
    if (!view) return;
    const state = view.state;
    const { from, to } = state.selection.main;
    view.dispatch({
      changes: { from, to, insert: gridMarkdown },
      selection: { anchor: from + gridMarkdown.length, head: from + gridMarkdown.length },
    });
    view.focus();
  }

  function exec(action: string, payload?: string) {
    if (action === 'preview') return (params.showPreview.value = !params.showPreview.value);
    if (action === 'openColorPicker') return openColorModal();
    if (action === 'save') return params.save();
    if (action === 'goto') {
      const d = params.getDoc();
      if (d?.id) return useRouter().push(`/dashboard/docs/${d.id}`);
    }
    if (action === 'image') return openImageSelector();
    if (action === 'gridOrganization') return openGridOrganization();
    if (action === 'insertText') return insertText(payload || '');

    const view = params.getView();
    if (!view) return;

    const state = view.state;
    const { from, to } = state.selection.main;
    const selectedText = state.sliceDoc(from, to);

    let changes: { from: number; to: number; insert: string } | undefined;
    let select_from = from + 2;
    let select_to = to + 2;

    switch (action) {
      case 'bold':
        changes = { from, to, insert: `**${selectedText}**` };
        break;
      case 'italic':
        changes = { from, to, insert: `*${selectedText}*` };
        select_from = from + 1;
        select_to = select_from + selectedText.length;
        break;
      case 'underline':
        changes = { from, to, insert: `__${selectedText}__` };
        break;
      case 'strike':
        changes = { from, to, insert: `~~${selectedText}~~` };
        break;
      case 'link':
        changes = { from, to, insert: `[](${selectedText})` };
        select_from = from + 3;
        select_to = select_from;
        break;
      case 'code':
        changes = { from, to, insert: `\`${selectedText}\`` };
        break;
      case 'quote':
        changes = { from, to, insert: `> ${selectedText}\n` };
        break;
      case 'list':
        changes = { from, to, insert: `- ${selectedText}\n` };
        break;
      case 'orderedList':
        changes = { from, to, insert: `1. ${selectedText}\n` };
        break;
      case 'color': {
        const color = String(payload || '').trim();
        if (!color) return;
        const insert = `{color:${color}}(${selectedText})`;
        changes = { from, to, insert };
        select_from = insert.indexOf('(') + 1 + from;
        select_to = select_from + selectedText.length;
        break;
      }
    }

    if (changes) {
      view.dispatch({ changes, selection: { anchor: select_from, head: select_to } });
      view.focus();
    }
  }

  return { exec, insertText };
}
