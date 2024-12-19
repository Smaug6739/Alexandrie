class MarkdownUtil {
  private editor: Ref<HTMLTextAreaElement | undefined>;

  constructor(editor: Ref<HTMLTextAreaElement | undefined>) {
    this.editor = editor;
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
    // Add the content at the current cursor position
    const startIndex = this.editor.value!.selectionStart;
    const endIndex = this.editor.value!.selectionEnd;
    const beforeSelected = this.editor.value!.value.substring(0, startIndex);
    const afterSelected = this.editor.value!.value.substring(endIndex, this.editor.value!.value.length);
    this.editor.value!.value = beforeSelected + content + afterSelected;
    const newStartIndex = startIndex + content.length;
    this.editor.value!.setSelectionRange(newStartIndex, newStartIndex);
    this.editor.value!.focus();
  }
}

export default MarkdownUtil;
