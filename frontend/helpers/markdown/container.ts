import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import type { RenderRule } from 'markdown-it/lib/renderer.mjs';

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('green', 'TIP', md))
    .use(...createContainer('grey', 'INFO', md))
    .use(...createContainer('blue', 'INFO', md))
    .use(...createContainer('yellow', 'WARNING', md))
    .use(...createContainer('red', 'DANGER', md))
    .use(...createContainer('details', 'Details', md))
    .use(...createContainer('turquoise', 'INFO', md))
    .use(...createInvisibleContainer('no-print'))
    .use(...createInvisibleContainer('center'))
    .use(...createInvisibleContainer('columns'))
    .use(...createInvisibleContainer('column'));
};

type ContainerArgs = [typeof container, string, { render: RenderRule }];

function createContainer(klass: string, defaultTitle: string, md: MarkdownIt): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        const info = token?.info.trim().slice(klass.length).trim();
        if (token?.nesting === 1) {
          const title = md.renderInline(info || defaultTitle);
          if (klass === 'details') {
            return `<details class="${klass} custom-block no-print"><summary>${title}</summary>\n`;
          }
          return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`;
        } else {
          return klass === 'details' ? `</details>\n` : `</div>\n`;
        }
      },
    },
  ];
}

function createInvisibleContainer(klass: string): ContainerArgs {
  return [
    container,
    klass,
    {
      render(tokens, idx) {
        const token = tokens[idx];
        if (token?.nesting === 1) return `<div class="${klass}">\n`;
        return `</div>\n`;
      },
    },
  ];
}
