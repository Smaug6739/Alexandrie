import type MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import type { RenderRule } from 'markdown-it/lib/renderer.mjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const containerPlugin_ = container as any;

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('green', 'TIP', md))
    .use(...createContainer('grey', 'INFO', md))
    .use(...createContainer('blue', 'INFO', md))
    .use(...createContainer('yellow', 'WARNING', md))
    .use(...createContainer('red', 'DANGER', md))
    .use(...createContainer('details', 'Details', md))
    .use(...createContainer('teal', 'INFO', md))
    .use(...createInvisibleContainer('no-print'))
    .use(...createInvisibleContainer('center'))
    .use(...createInvisibleContainer('columns'))
    .use(...createInvisibleContainer('column'));
};

type ContainerArgs = [typeof containerPlugin_, string, { render: RenderRule }];

function createContainer(klass: string, defaultTitle: string, md: MarkdownIt): ContainerArgs {
  return [
    containerPlugin_,
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
          return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p><div class="custom-block-content">\n`;
        } else {
          return klass === 'details' ? `</details>\n` : `</div></div>\n`;
        }
      },
    },
  ];
}

function createInvisibleContainer(klass: string): ContainerArgs {
  return [
    containerPlugin_,
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
