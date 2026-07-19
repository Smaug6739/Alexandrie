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
import { markdownItCheckbox } from './checkbox';
import { markdownItKatexPlugin } from './katex';
import { sourceMapPlugin } from './source-map';
import { internalLinkPlugin } from './internal-links';
import { tooltipPlugin } from './tooltip';

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
md.use(html5MediaPlugin);
md.use(svgObjectPlugin);
md.use(internalLinkPlugin);
md.use(sourceMapPlugin);

export default function compile(str: string = '', resolveNode?: (id: string) => string | undefined): string {
  // Replace &lt; &gt; &amp; to < > & (to avoid markdown-it escape)
  str = str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  return md.render(str, {
    html: true,
    resolveNode,
  });
}
