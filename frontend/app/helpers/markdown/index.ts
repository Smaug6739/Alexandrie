import MarkdownIt from 'markdown-it';
import { containerPlugin } from './container';
import { anchorPlugin } from './anchor';
import { containerSvg } from './containers-svg';
import { copyCodePlugin } from './code-block';
import { advancedBlocks } from './cards';
import { mermaidPlugin } from './mermaid';
import underline from './underline';
import highlight from 'markdown-it-highlightjs';
// @ts-expect-error no types provided
import mark from 'markdown-it-mark';
import colorPlugin from './colors';
import { subscriptPlugin, superscriptPlugin, footNotePlugin, html5MediaPlugin, svgObjectPlugin } from './other';
import { markdownItCheckbox, checkboxLine } from './checkbox';
import { markdownItKatexPlugin } from './katex';
import { sourceMapPlugin } from './source-map';
import { internalLinkPlugin } from './internal-links';
import { tooltipPlugin } from './tooltip';
import { counterPlugin } from './counters';
import { full as emojiPlugin } from 'markdown-it-emoji';

const md = new MarkdownIt({ html: true, linkify: true });
md.use(containerPlugin);
md.use(anchorPlugin);
md.use(containerSvg);
md.use(advancedBlocks);
md.use(mermaidPlugin);
md.use(copyCodePlugin);
md.use(underline);
md.use(mark);
md.use(markdownItKatexPlugin);
md.use(highlight);
md.use(markdownItCheckbox);
md.use(subscriptPlugin);
md.use(superscriptPlugin);
md.use(footNotePlugin);
md.use(colorPlugin, {
  enableBracketSyntax: true, // also parse [text]{color=value}
  allowHex: true, // allow #rgb and #rrggbb
});
md.use(tooltipPlugin);
md.use(counterPlugin);
md.use(emojiPlugin);
md.use(html5MediaPlugin);
md.use(svgObjectPlugin);
md.use(internalLinkPlugin);
md.use(sourceMapPlugin);

// Replace &lt; &gt; &amp; to < > & (to avoid markdown-it escape)
const unescapeEntities = (str: string) => str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

export default function compile(str: string = '', resolveNode?: (id: string) => string | undefined): string {
  return md.render(unescapeEntities(str), {
    html: true,
    resolveNode,
  });
}

// Tick or untick the checkbox the renderer numbered `index`. Its line is found with the
// same parser, so numbered, quoted or fenced task lines can't shift the count.
export function toggleMarkdownCheckbox(markdown: string, index: number, checked: boolean): string {
  const line = checkboxLine(md, unescapeEntities(markdown), index);
  if (line === undefined) return markdown;
  const lines = markdown.split('\n');
  lines[line] = lines[line]!.replace(/\[[ xX]\]/, checked ? '[x]' : '[ ]');
  return lines.join('\n');
}
