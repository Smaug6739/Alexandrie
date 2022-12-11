import type MarkdownIt from 'markdown-it';
import type { RenderRule } from 'markdown-it/lib/renderer';
import container from 'markdown-it-container';

export const containerPlugin = (md: MarkdownIt) => {
  md.use(...createContainer('green', 'TIP', md))
    .use(...createContainer('grey', 'INFO', md))
    .use(...createContainer('blue', 'INFO', md))
    .use(...createContainer('yellow', 'WARNING', md))
    .use(...createContainer('red', 'DANGER', md))
    .use(...createContainer('details', 'Details', md))
    .use(...createContainer('turquoise', 'INFO', md));
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
            return `<details class="${klass} custom-block"><summary>${title}</summary>\n`;
          }
          return `<div class="${klass} custom-block"><p class="custom-block-title">${title}</p>\n`;
        } else {
          return klass === 'details' ? `</details>\n` : `</div>\n`;
        }
      },
    },
  ];
}
