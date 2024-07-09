import { ref } from 'vue';
import type { Ref } from 'vue';

import MarkdownUtil from '~/components/MarkdownEditor/Utils';

export class Editor extends EventTarget {
  public area: Ref<HTMLDivElement | undefined>; // The editor area
  public util: MarkdownUtil; // The markdown utility formatter
  public showPreview: Ref<boolean> = ref(false); // Whether to show the preview or not

  public inlineToolbar: Ref<{ element: HTMLElement } | undefined>;

  constructor(area: Ref<HTMLDivElement | undefined>, inlineToolbar: Ref<{ element: HTMLElement } | undefined>) {
    super();
    this.area = area;
    this.inlineToolbar = inlineToolbar as Ref<{ element: HTMLElement }>;
    this.util = new MarkdownUtil(area);
  }

  public format(action: string) {
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
        this.util.inlineFormat('<b>', '</b>');
        break;
      case 'italic':
        this.util.inlineFormat('<em>', '</em>');
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
      case 'clear':
        this.util.clear();
        break;
      case 'block':
        this.util.inlineFormat('<div class="green custom-block"><p class="custom-block-title">Block name</p>', '</div>');
        break;
    }
  }
  public handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const selection = window.getSelection();
      if (!selection) return;
      const range = selection.getRangeAt(0);

      // IF the cursor is at the end of the line, insert two new lines instead of one else insert one new line
      const textNode =
        range.startContainer.textContent?.length == range.startOffset ? document.createTextNode('\n\n') : document.createTextNode('\n');

      range.insertNode(textNode);

      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      this.util.addContent('    ');
    }
    // Ctrl + B for bold
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      this.format('bold');
    }
    // Ctrl + I for italic
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault();
      this.format('italic');
    }
    // Ctrl + U for underline
    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
      this.format('underline');
    }
    // Ctrl + K for link
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault();
      this.format('link');
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
  }

  public updateContextMenu() {
    setTimeout(() => {
      if (!this.inlineToolbar?.value?.element) return;
      const toolbarElement = this.inlineToolbar.value.element;
      toolbarElement.style.display = 'none';
      if (!this.area?.value) return;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.toString().length == 0) return;
      const range = selection.getRangeAt(0);
      if (!this.area.value.contains(range.startContainer) || !this.area.value.contains(range.endContainer)) return;
      const containerRect = this.area.value?.getBoundingClientRect(); //const selectionRect = range.getBoundingClientRect();
      const rects = range.getClientRects();
      if (!containerRect) return;
      const last_rect = rects[rects.length - 1];
      toolbarElement.style.top = `${last_rect.top - containerRect.top + 25}px`;
      toolbarElement.style.left = `${last_rect.left - containerRect.left}px`;
      toolbarElement.style.display = 'flex';
    }, 10);
  }
}
