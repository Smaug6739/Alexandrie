import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

import katex from 'katex';

const md = new MarkdownIt({ html: true });
md.use(anchor, {
  level: [1, 2, 3, 4, 5, 6],
  permalink: anchor.permalink.ariaHidden({
    class: 'header-anchor',
    symbol: '#',
    space: true,
    placement: 'before',
  }),
});

export default function compile(str: string, plugins: boolean): string {
  let render = md.render(str, {
    html: true,
  });
  if (plugins) {
    // KATEX (math)
    const results = matchText(render);
    render = replaceText(render, results);
  }
  return render;
}
// A function for matching $<sequence>$ without regex.
interface Result {
  start: number;
  end: number;
}
function matchText(text: string) {
  let i = 0;
  let possible_start = -1;
  const results: Result[] = [];
  while (i < text.length) {
    const character = text[i];
    if (character === '$') {
      if (possible_start == -1) {
        possible_start = i;
      } else {
        results.push({
          start: possible_start,
          end: i,
        });
        possible_start = -1;
      }
    }
    i++;
  }
  return results;
}
function replaceText(text: string, results: Result[]): string {
  const copy = text;
  for (const result of results) {
    const expression = copy.substring(result.start, result.end + 1);
    const expressionWithoutDollar = expression.slice(1, -1);
    const render = katex.renderToString(expressionWithoutDollar, {
      throwOnError: false,
      displayMode: true,
    });
    text = text.replace(expression, `<span class="container"><i class="katex-i">${render}</i></span>`);
  }
  return text;
}
