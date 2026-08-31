import type { MarkdownIt } from 'markdown-it';
import { registerRawBlockRule } from './raw-block';

export const MERMAID_OPEN_RE = /^(:{3,}|`{3,})mermaid\s*$/;

export function mermaidPlugin(md: MarkdownIt) {
  registerRawBlockRule(md, 'mermaid_block', MERMAID_OPEN_RE, content => `<pre class="mermaid">${md.utils.escapeHtml(content)}</pre>\n`);
}
