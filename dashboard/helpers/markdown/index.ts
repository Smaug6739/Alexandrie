import MarkdownIt from 'markdown-it';
import { containerPlugin } from './container';
import { anchorPlugin } from './anchor';
import { containerSvg } from './containers-svg';
import katex from 'katex';

const md = new MarkdownIt({ html: true });
md.use(containerPlugin);
md.use(anchorPlugin);
md.use(containerSvg);

export default function compile(str: string = '', plugins: boolean = true): string {
  let render = str;
  if (plugins) {
    // KATEX (math)
    const results = matchText(render);
    render = replaceText(render, results);
    render = md.render(render, {
      html: true,
    });
  } else {
    render = md.render(str, {
      html: true,
    });
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
      trust: true,
    });
    text = text.replace(expression, `<span class="katex-container"><i>${render}</i></span>`);
  }
  return text;
}
