import type MarkdownIt from 'markdown-it';

export const MERMAID_OPEN_RE = /^:{3,}mermaid\s*$/;
export const MERMAID_CLOSE_RE = /^:{3,}\s*$/;

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
      if (!MERMAID_OPEN_RE.test(state.src.slice(startPos, startMax))) return false;

      let nextLine = startLine;
      let haveEndMarker = false;

      for (;;) {
        nextLine++;
        if (nextLine >= endLine) break; // unterminated: autoclose at end of scope

        const pos = state.bMarks[nextLine]! + state.tShift[nextLine]!;
        const max = state.eMarks[nextLine]!;

        if (pos < max && state.sCount[nextLine]! < state.blkIndent) break; // de-indented, stop
        if (state.sCount[nextLine]! - state.blkIndent >= 4) continue; // closing marker can't be indented

        if (MERMAID_CLOSE_RE.test(state.src.slice(pos, max))) {
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
