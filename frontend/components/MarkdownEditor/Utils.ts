class MarkdownUtil {
    private editor: HTMLDivElement;

    constructor(editor: HTMLDivElement) {
        this.editor = editor;
    }
    public formatText() {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);

        // Check if the selection is within the textarea or its descendants
        if (!this.editor.contains(range.startContainer) || !this.editor.contains(range.endContainer)) return;
        return range;
    }
    // Function to create a temporary container for the selected content
    private createTempDiv(content: DocumentFragment) {
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(content);
        return tempDiv;
    }
    private inlineFormat(tag1: string, tag2: string) {
        const range = this.formatText()
        if(!range) return;
        const tempDiv = this.createTempDiv(range.cloneContents());
        const fragment = document.createDocumentFragment();
        tempDiv.innerHTML = tag1 + tempDiv.innerHTML + tag2;
        while (tempDiv.firstChild) {
            fragment.appendChild(tempDiv.firstChild);
        }
        range.deleteContents();
        range.insertNode(fragment);
    }

    public clear(){
        const range = this.formatText()
        if(!range) return;
        const tempDiv = this.createTempDiv(range.cloneContents());
        const parentElement: Element | null = range.commonAncestorContainer.nodeType === 3 ? range.commonAncestorContainer.parentElement as Element : range.commonAncestorContainer as Element;
        if (parentElement != this.editor) {
            const text = parentElement.textContent || '';
            const textNode = document.createTextNode(text);
            parentElement.replaceWith(textNode);
        } else if(tempDiv.innerHTML != '') {
            const text = tempDiv.textContent || '';
            const textNode = document.createTextNode(text);
            range.deleteContents();
            range.insertNode(textNode);
        }
    }
}


export default MarkdownUtil;

