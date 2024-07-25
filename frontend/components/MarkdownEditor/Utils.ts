class MarkdownUtil {
  private editor: Ref<HTMLTextAreaElement | undefined>;

  constructor(editor: Ref<HTMLTextAreaElement | undefined>) {
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
    const selectedText = window.getSelection()?.toString() || '';
    const startTag = `${tag1}`;
    const endTag = `${tag2}`;
    const startIndex = this.editor.value!.selectionStart;
    const endIndex = this.editor.value!.selectionEnd;
    const beforeSelected = this.editor.value!.value.substring(0, startIndex);
    const afterSelected = this.editor.value!.value.substring(endIndex, this.editor.value!.value.length);
    this.editor.value!.value = beforeSelected + startTag + selectedText + endTag + afterSelected;
    const newStartIndex = startIndex + startTag.length;
    const newEndIndex = newStartIndex + selectedText.length;
    this.editor.value!.setSelectionRange(newStartIndex, newEndIndex);
    this.editor.value!.focus();
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
