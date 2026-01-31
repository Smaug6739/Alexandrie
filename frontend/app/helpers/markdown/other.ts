import type MarkdownIt from 'markdown-it';
import type { StateInline } from 'markdown-it/dist/index.cjs.js';

function superscriptPlugin(md: MarkdownIt) {
  md.inline.ruler.after('emphasis', 'superscript', (state: StateInline, silent: boolean) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== 0x5e /* ^ */) return false;

    let end = start + 1;
    while (end < state.src.length && state.src.charCodeAt(end) !== 0x5e /* ^ */) {
      end++;
    }

    if (end === start + 1 || end >= state.src.length) return false;

    if (!silent) {
      state.push('sup_open', 'sup', 1);
      state.push('text', '', 0).content = state.src.slice(start + 1, end);
      state.push('sup_close', 'sup', -1);
    }

    state.pos = end + 1;
    return true;
  });

  md.renderer.rules.sup_open = () => '<sup>';
  md.renderer.rules.sup_close = () => '</sup>';
}

function subscriptPlugin(md: MarkdownIt) {
  md.inline.ruler.after('emphasis', 'subscript', (state: StateInline, silent: boolean) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== 0x7e /* ~ */) return false;

    let end = start + 1;
    while (end < state.src.length && state.src.charCodeAt(end) !== 0x7e /* ~ */) {
      end++;
    }

    if (end === start + 1 || end >= state.src.length) return false;

    if (!silent) {
      state.push('sub_open', 'sub', 1);
      state.push('text', '', 0).content = state.src.slice(start + 1, end);
      state.push('sub_close', 'sub', -1);
    }

    state.pos = end + 1;
    return true;
  });

  md.renderer.rules.sub_open = () => '<sub>';
  md.renderer.rules.sub_close = () => '</sub>';
}

function footNotePlugin(md: MarkdownIt) {
  const footnotes: Map<string, string> = new Map();

  // Parse footnote definitions: [^id]: content
  md.block.ruler.before('reference', 'footnote_def', (state, startLine, endLine, silent) => {
    const start = state.bMarks[startLine]! + state.tShift[startLine]!;
    const max = state.eMarks[startLine];
    const line = state.src.slice(start, max);

    const match = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/);
    if (!match) return false;

    if (silent) return true;

    const id = match[1]!;
    const content = match[2]!;
    footnotes.set(id, content);

    state.line = startLine + 1;
    return true;
  });

  // Parse footnote references: [^id]
  md.inline.ruler.after('emphasis', 'footnote_ref', (state: StateInline, silent: boolean) => {
    const start = state.pos;
    const max = state.posMax;

    if (start + 2 >= max) return false;
    if (state.src.charCodeAt(start) !== 0x5b /* [ */) return false;
    if (state.src.charCodeAt(start + 1) !== 0x5e /* ^ */) return false;

    let end = start + 2;
    while (end < max && state.src.charCodeAt(end) !== 0x5d /* ] */) {
      end++;
    }

    if (end >= max) return false;

    const id = state.src.slice(start + 2, end);
    if (!id) return false;

    if (!silent) {
      const token = state.push('footnote_ref', '', 0);
      token.meta = { id };
    }

    state.pos = end + 1;
    return true;
  });

  md.renderer.rules.footnote_ref = (tokens, idx) => {
    const id = tokens[idx]?.meta.id;
    const content = footnotes.get(id) || '';
    return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}" title="${md.utils.escapeHtml(content)}">[${id}]</a></sup>`;
  };

  // Add footnotes section at the end
  const originalRender = md.render.bind(md);
  md.render = (src: string, env?: object) => {
    footnotes.clear();
    let result = originalRender(src, env);

    if (footnotes.size > 0) {
      result += '<section class="footnotes"><hr><ol>';
      footnotes.forEach((content, id) => {
        result += `<li id="fn-${id}">${md.renderInline(content)} <a href="#fnref-${id}" class="footnote-backref">↩</a></li>`;
      });
      result += '</ol></section>';
    }

    return result;
  };
}

export { superscriptPlugin, subscriptPlugin, footNotePlugin };
