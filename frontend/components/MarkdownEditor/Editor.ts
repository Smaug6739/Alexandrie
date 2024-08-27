import MarkdownUtil from '~/components/MarkdownEditor/Utils';
import { snippets } from './snippets';

export class Editor extends EventTarget {
  public area: Ref<HTMLTextAreaElement | undefined>; // The editor area
  public util: MarkdownUtil; // The markdown utility formatter
  public showPreview: Ref<boolean>; // Whether to show the preview or not
  public container: Ref<HTMLElement | undefined>; // The container element
  public inlineToolbar: Ref<{ element: HTMLElement } | undefined>;

  constructor(area: Ref<HTMLTextAreaElement | undefined>, inlineToolbar: Ref<{ element: HTMLElement } | undefined>, container: Ref<HTMLElement | undefined>, opts: EditorOptions = {}) {
    super();
    this.area = area;
    this.inlineToolbar = inlineToolbar as Ref<{ element: HTMLElement }>;
    this.util = new MarkdownUtil(area);
    this.container = container;
    this.showPreview = opts.showPreview ? ref(true) : ref(false);
  }

  public actions(action: string) {
    switch (action) {
      case 'blue':
        this.util.inlineFormat('<blue>', '</blue>');
        break;
      case 'green':
        this.util.inlineFormat('<green>', '</green>');
        break;
      case 'red':
        this.util.inlineFormat('<red>', '</red>');
        break;
      case 'yellow':
        this.util.inlineFormat('<yellow>', '</yellow>');
        break;
      case 'pink':
        this.util.inlineFormat('<pink>', '</pink>');
        break;
      case 'bold':
        this.util.inlineFormat('**', '**');
        break;
      case 'italic':
        this.util.inlineFormat('*', '*');
        break;
      case 'underline':
        this.util.inlineFormat('__', '__');
        break;
      case 'strike':
        this.util.inlineFormat('~~', '~~');
        break;
      case 'link':
        this.util.inlineFormat('[](', ')');
        break;
      case 'image':
        this.util.inlineFormat('![](', ')');
        break;
      case 'code':
        this.util.inlineFormat('`', '`');
        break;
      case 'quote':
        this.util.inlineFormat('> ', '');
        break;
      case 'list':
        this.util.inlineFormat('* ', '');
        break;
      case 'orderedList':
        this.util.inlineFormat('1. ', '');
        break;
      case 'preview':
        this.showPreview.value = !this.showPreview.value;
        break;
    }
  }
  public handleKeydown(event: KeyboardEvent) {
    if (!event.ctrlKey && !event.altKey && !event.metaKey) this.inlineToolbar.value!.element.style.display = 'none';

    if (event.key === 'Tab') {
      event.preventDefault();
      this.util.addContent('    ');
    }
    // Ctrl + B for bold
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      this.actions('bold');
    }
    // Ctrl + I for italic
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault();
      this.actions('italic');
    }
    // Ctrl + U for underline
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
      this.actions('underline');
    }
    // Ctrl + K for link
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.actions('link');
    }
    if (event.ctrlKey && event.key === 'm') {
      event.preventDefault();
      this.actions('image');
    }
    // Ctrl + S for saving
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      this.dispatchEvent(new Event('save'));
    }
    // Ctrl + P for preview
    if (event.ctrlKey && event.key === 'p') {
      event.preventDefault();
      this.showPreview.value = !this.showPreview.value;
    }
    // Snippets detection
    if (event.key === ' ') {
      if (this.handleSnippets()) event.preventDefault();
    }
  }
  private handleSnippets() {
    const cursorPosition = this.area.value!.selectionStart;
    const text = this.area.value!.value;
    const textBeforeCursor = text.substring(0, cursorPosition);
    const textAfterCursor = text.substring(cursorPosition);
    const snippet = snippets.find(snippet => textBeforeCursor.trim().endsWith(snippet.cmd));
    if (!snippet) return;
    const beforeWord = textBeforeCursor.substring(0, textBeforeCursor.length - snippet.cmd.length);
    const newText = beforeWord + snippet.value + textAfterCursor;
    // Update the this.area.value! value
    this.area.value!.value = newText;
    // Find the position of {$} in the snippet value and set the cursor position
    const placeholderIndex = beforeWord.length + snippet.value.indexOf('{$}');
    if (placeholderIndex == -1) return;
    this.area.value!.value = newText.replace('{$}', '');
    this.area.value!.setSelectionRange(placeholderIndex, placeholderIndex);
    // Prevent the default space character from being inserted
    return true;
  }
  public async handleInlineToolbar() {
    await new Promise(resolve => setTimeout(resolve, 10));
    if (!this.inlineToolbar?.value?.element) return;
    const toolbarElement = this.inlineToolbar.value.element;
    toolbarElement.style.display = 'none';
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().length == 0) return;
    const { top, left } = this.getCaretPosition();
    if (top - this.area.value!.scrollTop + 25 < 0) return;
    toolbarElement.style.top = `${top - this.area.value!.scrollTop + 25}px`;
    toolbarElement.style.left = `${left - this.area.value!.scrollLeft}px`;
    toolbarElement.style.display = 'flex';
  }
  private getCaretPosition() {
    const textarea = this.area.value!;
    const cursorPos = textarea.selectionStart;
    // Create a mirrored element
    const mirroredEle = document.createElement('div');
    const copyStyle = getComputedStyle(textarea);

    for (const prop of copyStyle) {
      mirroredEle.style[prop as any] = copyStyle[prop as any] as any;
    }

    // Add specific styles
    mirroredEle.style.position = 'absolute';
    mirroredEle.style.visibility = 'hidden';
    mirroredEle.style.width = textarea.clientWidth + 'px';
    mirroredEle.style.height = textarea.clientHeight + 'px';
    mirroredEle.style.overflow = 'auto';

    // Text with caret
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const textAfterCursor = textarea.value.substring(cursorPos);

    const pre = document.createTextNode(textBeforeCursor);
    const post = document.createTextNode(textAfterCursor);
    const caretEle = document.createElement('span');
    caretEle.textContent = '|'; // Utilisation d'un caractère pour le caret

    mirroredEle.append(pre, caretEle, post);

    // Use document fragment to append the mirrored element (to avoid reflow)
    const fragment = document.createDocumentFragment();
    fragment.appendChild(mirroredEle);

    // Add fragment to the body (to get the correct position)
    this.container.value!.appendChild(fragment);

    // Get the caret position
    const rect = caretEle.getBoundingClientRect();
    const containerRect = textarea.getBoundingClientRect();

    // Calculate relative position
    const top = rect.top - containerRect.top;
    const left = rect.left - containerRect.left;
    // Delete the mirrored element
    this.container.value!.removeChild(mirroredEle);

    return { top, left };
  }
}

export interface EditorOptions {
  showPreview?: boolean;
  toolbar?: 'minimal' | 'complete';
}
