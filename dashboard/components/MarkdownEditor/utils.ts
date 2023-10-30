export function wrapWithTags(text: string, tag1: string, tag2: string, textarea: HTMLTextAreaElement) {
  const startTag = `${tag1}`;
  const endTag = `${tag2}`;

  const startIndex = textarea.selectionStart;
  const endIndex = textarea.selectionEnd;

  const beforeSelected = textarea.value.substring(0, startIndex);
  const afterSelected = textarea.value.substring(endIndex, textarea.value.length);

  textarea.value = beforeSelected + startTag + text + endTag + afterSelected;
}
