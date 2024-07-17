class MarkdownUtil {
  private editor: Ref<HTMLDivElement | undefined>;

  constructor(editor: Ref<HTMLDivElement | undefined>) {
    this.editor = editor;
  }
  private getEditorRange() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!this.editor.value) return;
    // Check if the selection is within the textarea or its descendants
    if (!this.editor.value.contains(range.startContainer) || !this.editor.value.contains(range.endContainer)) return;
    return range;
  }
  // Function to create a temporary container for the selected content
  private createTempDiv(content: DocumentFragment) {
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(content);
    return tempDiv;
  }
  public inlineFormat(tag1: string, tag2: string) {
    const range = this.getEditorRange();
    if (!range) return;
    const tempDiv = this.createTempDiv(range.cloneContents());
    const fragment = document.createDocumentFragment();
    tempDiv.innerHTML = tag1 + tempDiv.innerHTML.trim().replaceAll('\n', '') + tag2;
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    range.deleteContents();
    range.insertNode(fragment);
  }

  public clear() {
    const range = this.getEditorRange();
    if (!range) return;
    const tempDiv = this.createTempDiv(range.cloneContents());
    const parentElement: Element | null =
      range.commonAncestorContainer.nodeType === 3
        ? (range.commonAncestorContainer.parentElement as Element)
        : (range.commonAncestorContainer as Element);
    if (parentElement != this.editor.value) {
      const text = parentElement.textContent || '';
      const textNode = document.createTextNode(text);
      parentElement.replaceWith(textNode);
    } else if (tempDiv.innerHTML != '') {
      const text = tempDiv.textContent || '';
      const textNode = document.createTextNode(text);
      range.deleteContents();
      range.insertNode(textNode);
    }
  }
  public addContent(content: string) {
    const selection = window.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(content);
    range.insertNode(textNode);
    // Move the cursor to the end of the inserted text
    range.setStartAfter(textNode);
  }
}

export default MarkdownUtil;
