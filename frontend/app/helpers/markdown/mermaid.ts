import type { MarkdownIt } from 'markdown-it';

export const MERMAID_OPEN_RE = /^(:{3,}|`{3,})mermaid\s*$/;

// Raw-capture block rule (like `fence`) rather than markdown-it-container, so diagram
// source is never fed through the nested block/inline parser: indentation, [labels],
// and | characters in Mermaid syntax would otherwise be misread as Markdown constructs.
export function mermaidPlugin(md: MarkdownIt) {
  md.block.ruler.before(
    'fence',
    'mermaid_block',
    (state, startLine, endLine, silent) => {
      const startPos = state.bMarks[startLine]! + state.tShift[startLine]!;
      const startMax = state.eMarks[startLine]!;
      const match = state.src.slice(startPos, startMax).match(MERMAID_OPEN_RE);
      if (!match) return false;

      const markerChar = match[1]![0];
      const minMarkerLen = match[1]!.length;

      let nextLine = startLine;
      let haveEndMarker = false;

      for (;;) {
        nextLine++;
        if (nextLine >= endLine) break; // unterminated: autoclose at end of scope

        const pos = state.bMarks[nextLine]! + state.tShift[nextLine]!;
        const max = state.eMarks[nextLine]!;

        if (pos < max && state.sCount[nextLine]! < state.blkIndent) break; // de-indented, stop
        if (state.sCount[nextLine]! - state.blkIndent >= 4) continue; // closing marker can't be indented

        const lineText = state.src.slice(pos, max).trim();
        if (lineText.length >= minMarkerLen && lineText.split('').every(c => c === markerChar)) {
          haveEndMarker = true;
          break;
        }
      }

      if (silent) return true;

      const content = state.getLines(startLine + 1, nextLine, state.blkIndent, false);
      const token = state.push('mermaid_block', 'pre', 0);
      token.block = true;
      token.content = content;
      token.map = [startLine, nextLine + (haveEndMarker ? 1 : 0)];

      state.line = nextLine + (haveEndMarker ? 1 : 0);
      return true;
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  );

  md.renderer.rules.mermaid_block = (tokens, idx) => {
    return `<pre class="mermaid">${md.utils.escapeHtml(tokens[idx]?.content ?? '')}</pre>\n`;
  };
}
