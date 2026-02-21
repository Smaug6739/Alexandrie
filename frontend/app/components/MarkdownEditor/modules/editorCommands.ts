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

// ============================================================================
// FORMATTING DETECTION & TOGGLE UTILITIES
// ============================================================================

interface FormatMarker {
  prefix: string;
  suffix: string;
  pattern: RegExp;
}

const FORMAT_MARKERS: Record<string, FormatMarker> = {
  bold: { prefix: '**', suffix: '**', pattern: /^\*\*(.+)\*\*$/ },
  italic: { prefix: '*', suffix: '*', pattern: /^\*([^*]+)\*$/ },
  underline: { prefix: '__', suffix: '__', pattern: /^__(.+)__$/ },
  strike: { prefix: '~~', suffix: '~~', pattern: /^~~(.+)~~$/ },
  code: { prefix: '`', suffix: '`', pattern: /^`([^`]+)`$/ },
  superscript: { prefix: '^', suffix: '^', pattern: /^\^(.+)\^$/ },
  subscript: { prefix: '~', suffix: '~', pattern: /^~([^~]+)~$/ },
  mark: { prefix: '==', suffix: '==', pattern: /^==(.+)==$/ },
};

/**
 * Checks if the text around selection is wrapped with specific markers
 * Returns the extended range if found, or null if not formatted
 */
function detectWrappedFormat(doc: string, from: number, to: number, prefix: string, suffix: string): { from: number; to: number; innerText: string } | null {
  const prefixLen = prefix.length;
  const suffixLen = suffix.length;

  // Check if we can extend selection to include markers
  const extendedFrom = from - prefixLen;
  const extendedTo = to + suffixLen;

  if (extendedFrom < 0 || extendedTo > doc.length) return null;

  const beforeText = doc.slice(extendedFrom, from);
  const afterText = doc.slice(to, extendedTo);

  if (beforeText === prefix && afterText === suffix) {
    return {
      from: extendedFrom,
      to: extendedTo,
      innerText: doc.slice(from, to),
    };
  }

  return null;
}

/**
 * Check if selected text itself contains the format markers
 */
function detectInnerFormat(selectedText: string, pattern: RegExp): string | null {
  const match = selectedText.match(pattern);
  return match && match[1] !== undefined ? match[1] : null;
}

function trimSelectionWhitespace(view: EditorView, from: number, to: number): { newFrom: number; newTo: number } {
  const state = view.state;
  let newFrom = from;
  let newTo = to;

  // Trim leading whitespace
  while (newFrom < newTo && /\s/.test(state.doc.sliceString(newFrom, newFrom + 1))) {
    newFrom++;
  }

  // Trim trailing whitespace
  while (newTo > newFrom && /\s/.test(state.doc.sliceString(newTo - 1, newTo))) {
    newTo--;
  }

  return { newFrom, newTo };
}

/**
 * Toggle inline formatting (bold, italic, etc.)
 * If text is already formatted, remove formatting
 * If not, apply formatting
 */
function toggleInlineFormat(view: EditorView, formatKey: keyof typeof FORMAT_MARKERS): void {
  const marker = FORMAT_MARKERS[formatKey];
  if (!marker) return;

  const state = view.state;
  const { newFrom: from, newTo: to } = trimSelectionWhitespace(view, state.selection.main.from, state.selection.main.to);
  const doc = state.doc.toString();
  const selectedText = state.sliceDoc(from, to);

  // Case 1: Check if surrounding text has the markers (cursor inside formatted text)
  const wrappedFormat = detectWrappedFormat(doc, from, to, marker.prefix, marker.suffix);
  if (wrappedFormat) {
    // Remove formatting by replacing the whole wrapped section with inner text
    view.dispatch({
      changes: { from: wrappedFormat.from, to: wrappedFormat.to, insert: wrappedFormat.innerText },
      selection: { anchor: wrappedFormat.from, head: wrappedFormat.from + wrappedFormat.innerText.length },
    });
    view.focus();
    return;
  }

  // Case 2: Check if selection itself is wrapped (user selected including markers)
  const innerText = detectInnerFormat(selectedText, marker.pattern);
  if (innerText !== null) {
    view.dispatch({
      changes: { from, to, insert: innerText },
      selection: { anchor: from, head: from + innerText.length },
    });
    view.focus();
    return;
  }

  // Case 3: No formatting detected, apply it
  const newText = `${marker.prefix}${selectedText}${marker.suffix}`;
  const newFrom = from + marker.prefix.length;
  const newTo = newFrom + selectedText.length;

  view.dispatch({
    changes: { from, to, insert: newText },
    selection: { anchor: newFrom, head: newTo },
  });
  view.focus();
}

// ============================================================================
// LINE-BASED OPERATIONS (Lists, Quotes, Headers)
// ============================================================================

interface LinePrefixConfig {
  pattern: RegExp;
  getPrefix: (lineIndex: number, match?: RegExpMatchArray) => string;
  removePrefix: (line: string, match: RegExpMatchArray) => string;
}

const LINE_PREFIXES: Record<string, LinePrefixConfig> = {
  quote: {
    pattern: /^>\s?/,
    getPrefix: () => '> ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  list: {
    pattern: /^[-*+]\s/,
    getPrefix: () => '- ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  orderedList: {
    pattern: /^\d+\.\s/,
    getPrefix: idx => `${idx + 1}. `,
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  taskList: {
    pattern: /^-\s\[([ x])\]\s/,
    getPrefix: () => '- [ ] ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h1: {
    pattern: /^#\s/,
    getPrefix: () => '# ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h2: {
    pattern: /^##\s/,
    getPrefix: () => '## ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h3: {
    pattern: /^###\s/,
    getPrefix: () => '### ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h4: {
    pattern: /^####\s/,
    getPrefix: () => '#### ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h5: {
    pattern: /^#####\s/,
    getPrefix: () => '##### ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
  h6: {
    pattern: /^######\s/,
    getPrefix: () => '###### ',
    removePrefix: (line, match) => line.slice(match[0].length),
  },
};

/**
 * Toggle line-based formatting (lists, quotes, headers)
 * Works on multiple lines when selected
 */
function toggleLinePrefix(view: EditorView, prefixKey: string): void {
  const config = LINE_PREFIXES[prefixKey];
  if (!config) return;

  const state = view.state;
  const { from, to } = state.selection.main;

  // Get line numbers for selection
  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];
  let allHavePrefix = true;

  // First pass: check if all lines have the prefix
  for (let lineNum = startLine.number; lineNum <= endLine.number; lineNum++) {
    const line = state.doc.line(lineNum);
    const match = line.text.match(config.pattern);
    if (!match) {
      allHavePrefix = false;
      break;
    }
  }

  // Second pass: apply changes
  let lineIndex = 0;
  for (let lineNum = startLine.number; lineNum <= endLine.number; lineNum++) {
    const line = state.doc.line(lineNum);
    const match = line.text.match(config.pattern);

    if (allHavePrefix && match) {
      // Remove prefix
      const newText = config.removePrefix(line.text, match);
      changes.push({ from: line.from, to: line.to, insert: newText });
    } else if (!allHavePrefix) {
      // Add prefix (remove existing if different type for headers)
      let textWithoutPrefix = line.text;

      // For headers, remove any existing header prefix first
      if (prefixKey.startsWith('h')) {
        const headerMatch = line.text.match(/^#{1,6}\s/);
        if (headerMatch) {
          textWithoutPrefix = line.text.slice(headerMatch[0].length);
        }
      }

      const prefix = config.getPrefix(lineIndex, match || undefined);
      changes.push({ from: line.from, to: line.to, insert: prefix + textWithoutPrefix });
    }
    lineIndex++;
  }

  if (changes.length > 0) {
    view.dispatch({ changes });
    view.focus();
  }
}

/**
 * Toggle task item checkbox
 */
function toggleTaskCheckbox(view: EditorView): void {
  const state = view.state;
  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);

  const uncheckedMatch = line.text.match(/^(-\s\[)\s(\].*)$/);
  const checkedMatch = line.text.match(/^(-\s\[)x(\].*)$/);

  if (uncheckedMatch) {
    // Check the box
    view.dispatch({
      changes: { from: line.from, to: line.to, insert: `${uncheckedMatch[1]}x${uncheckedMatch[2]}` },
    });
  } else if (checkedMatch) {
    // Uncheck the box
    view.dispatch({
      changes: { from: line.from, to: line.to, insert: `${checkedMatch[1]} ${checkedMatch[2]}` },
    });
  }
  view.focus();
}

// ============================================================================
// CODE BLOCK OPERATIONS
// ============================================================================

/**
 * Insert or toggle code block (multi-line)
 */
function toggleCodeBlock(view: EditorView, language = ''): void {
  const state = view.state;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);
  const doc = state.doc.toString();

  // Check if selection is inside a code block
  const codeBlockPattern = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  while ((match = codeBlockPattern.exec(doc)) !== null) {
    const blockStart = match.index;
    const blockEnd = blockStart + match[0].length;

    if (from >= blockStart && to <= blockEnd) {
      // Inside a code block, extract content and remove block
      const content = match[2] ?? '';
      view.dispatch({
        changes: { from: blockStart, to: blockEnd, insert: content.trim() },
      });
      view.focus();
      return;
    }
  }

  // Not in a code block, create one
  const isMultiLine = selectedText.includes('\n');

  if (isMultiLine || selectedText.length > 50) {
    // Use fenced code block for multi-line
    const insert = `\`\`\`${language}\n${selectedText}\n\`\`\``;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 4 + language.length, head: from + 4 + language.length + selectedText.length },
    });
  } else {
    // Use inline code for short single-line
    toggleInlineFormat(view, 'code');
    return;
  }
  view.focus();
}

// ============================================================================
// LINK & IMAGE OPERATIONS
// ============================================================================

/**
 * Smart link insertion - detects if selection is a URL
 */
function insertLink(view: EditorView): void {
  const state = view.state;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);
  const doc = state.doc.toString();

  // Check if already in a link
  const linkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;
  let match;
  while ((match = linkPattern.exec(doc)) !== null) {
    const linkStart = match.index;
    const linkEnd = linkStart + match[0].length;

    if (from >= linkStart && to <= linkEnd) {
      // Inside a link, extract text and remove link formatting
      const linkText = match[1];
      view.dispatch({
        changes: { from: linkStart, to: linkEnd, insert: linkText },
      });
      view.focus();
      return;
    }
  }

  // Check if selection looks like a URL
  const urlPattern = /^https?:\/\/[^\s]+$/;
  const isUrl = urlPattern.test(selectedText);

  if (isUrl) {
    // Selected text is URL, create link with URL and place cursor in text part
    const insert = `[](${selectedText})`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 1 },
    });
  } else {
    // Selected text is link text, place cursor in URL part
    const insert = `[${selectedText}]()`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + selectedText.length + 3 },
    });
  }
  view.focus();
}

// ============================================================================
// SPECIAL INSERTIONS
// ============================================================================

/**
 * Insert horizontal rule
 */
function insertHorizontalRule(view: EditorView): void {
  const state = view.state;
  const { from } = state.selection.main;
  const line = state.doc.lineAt(from);

  // Insert at the end of current line with newlines
  const insert = line.text.length > 0 ? '\n\n---\n\n' : '---\n\n';
  view.dispatch({
    changes: { from: line.to, to: line.to, insert },
    selection: { anchor: line.to + insert.length },
  });
  view.focus();
}

/**
 * Insert math block (LaTeX)
 */
function insertMathBlock(view: EditorView, inline = true): void {
  const state = view.state;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);

  if (inline) {
    const insert = `$${selectedText}$`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 1, head: from + 1 + selectedText.length },
    });
  } else {
    const insert = `$$\n${selectedText}\n$$`;
    view.dispatch({
      changes: { from, to, insert },
      selection: { anchor: from + 3, head: from + 3 + selectedText.length },
    });
  }
  view.focus();
}

/**
 * Insert footnote
 */
function insertFootnote(view: EditorView): void {
  const state = view.state;
  const { from, to } = state.selection.main;
  const selectedText = state.sliceDoc(from, to);
  const doc = state.doc.toString();

  // Count existing footnotes to generate unique ID
  const footnoteCount = (doc.match(/\[\^\d+\]/g) || []).length / 2 + 1;

  const insert = `[^${footnoteCount}]`;
  const footnoteDefinition = `\n\n[^${footnoteCount}]: ${selectedText}`;

  // Insert reference at cursor
  view.dispatch({
    changes: [
      { from, to, insert },
      { from: doc.length, to: doc.length, insert: footnoteDefinition },
    ],
    selection: { anchor: from + insert.length },
  });
  view.focus();
}

/**
 * Indent or outdent selected lines
 */
function indentLines(view: EditorView, outdent = false): void {
  const state = view.state;
  const { from, to } = state.selection.main;

  const startLine = state.doc.lineAt(from);
  const endLine = state.doc.lineAt(to);

  const changes: { from: number; to: number; insert: string }[] = [];

  for (let lineNum = startLine.number; lineNum <= endLine.number; lineNum++) {
    const line = state.doc.line(lineNum);

    if (outdent) {
      // Remove leading tab or 2-4 spaces
      const match = line.text.match(/^(\t|  {1,2})/);
      if (match) {
        changes.push({ from: line.from, to: line.from + match[0].length, insert: '' });
      }
    } else {
      // Add tab
      changes.push({ from: line.from, to: line.from, insert: '\t' });
    }
  }

  if (changes.length > 0) {
    view.dispatch({ changes });
    view.focus();
  }
}

// ============================================================================
// MAIN COMMANDS EXPORT
// ============================================================================

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
    modalManager.add(new Modal(shallowRef(ImageSelectorModal), { props: { onImageSelect: handleImageSelect, nodeId: params.getDoc()?.id }, size: 'large' }));
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
    // Non-editor actions
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

    // Inline formatting toggles
    if (['bold', 'italic', 'underline', 'strike', 'code', 'superscript', 'subscript', 'mark'].includes(action)) {
      return toggleInlineFormat(view, action as keyof typeof FORMAT_MARKERS);
    }

    // Line-based toggles
    if (['quote', 'list', 'orderedList', 'taskList', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(action)) {
      return toggleLinePrefix(view, action);
    }

    // Special actions
    switch (action) {
      case 'link':
        return insertLink(view);

      case 'codeBlock':
        return toggleCodeBlock(view, payload || '');

      case 'horizontalRule':
        return insertHorizontalRule(view);

      case 'mathInline':
        return insertMathBlock(view, true);

      case 'mathBlock':
        return insertMathBlock(view, false);

      case 'footnote':
        return insertFootnote(view);

      case 'indent':
        return indentLines(view, false);

      case 'outdent':
        return indentLines(view, true);

      case 'toggleCheckbox':
        return toggleTaskCheckbox(view);

      case 'color': {
        const color = String(payload || '').trim();
        if (!color) return;
        const state = view.state;
        const { from, to } = state.selection.main;
        const selectedText = state.sliceDoc(from, to);
        const insert = `{color:${color}}(${selectedText})`;
        const selectFrom = insert.indexOf('(') + 1 + from;
        const selectTo = selectFrom + selectedText.length;
        view.dispatch({
          changes: { from, to, insert },
          selection: { anchor: selectFrom, head: selectTo },
        });
        view.focus();
        break;
      }

      case 'clearFormatting': {
        const state = view.state;
        const { from, to } = state.selection.main;
        let text = state.sliceDoc(from, to);

        // Remove common markdown formatting
        text = text
          .replace(/\*\*(.+?)\*\*/g, '$1') // bold
          .replace(/\*(.+?)\*/g, '$1') // italic
          .replace(/__(.+?)__/g, '$1') // underline
          .replace(/~~(.+?)~~/g, '$1') // strikethrough
          .replace(/`(.+?)`/g, '$1') // code
          .replace(/==(.+?)==/g, '$1') // mark
          .replace(/\^(.+?)\^/g, '$1') // superscript
          .replace(/~(.+?)~/g, '$1') // subscript
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // links

        view.dispatch({
          changes: { from, to, insert: text },
          selection: { anchor: from, head: from + text.length },
        });
        view.focus();
        break;
      }
    }
  }

  return { exec, insertText };
}
