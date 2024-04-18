import type MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

export const anchorPlugin = (md: MarkdownIt) => {
  md.use(anchor, {
    level: [1, 2, 3, 4, 5, 6],
    permalink: anchor.permalink.ariaHidden({
      class: 'header-anchor',
      symbol: '#',
      space: true,
      placement: 'before',
    }),
  });
};
