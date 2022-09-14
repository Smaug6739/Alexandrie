import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import container from 'markdown-it-container';
import { containerPlugin } from './markdown/container';
import katex from 'katex';

import { svg_info, svg_warning, containerOpen } from './constants';

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
md.use(containerPlugin);
md.use(container, 'definition', {
  validate: function (params: any) {
    return params.trim().match(/^definition\s+(.*)$/);
  },
  render: function (tokens: any, idx: any) {
    var m = tokens[idx].info.trim().match(/^definition\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return containerOpen(m[1], svg_info, 'red');
    } else {
      // closing tag
      return '</div>\n';
    }
  },
});
md.use(container, 'property', {
  validate: function (params: any) {
    return params.trim().match(/^property\s+(.*)$/);
  },
  render: function (tokens: any, idx: any) {
    var m = tokens[idx].info.trim().match(/^property\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return containerOpen(m[1], svg_info, 'blue');
    } else {
      // closing tag
      return '</div>\n';
    }
  },
});
md.use(container, 'theorem', {
  validate: function (params: any) {
    return params.trim().match(/^theorem\s+(.*)$/);
  },
  render: function (tokens: any, idx: any) {
    var m = tokens[idx].info.trim().match(/^theorem\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return containerOpen(m[1], svg_info, 'turquoise');
    } else {
      // closing tag
      return '</div>\n';
    }
  },
});
md.use(container, 'warning', {
  validate: function (params: any) {
    return params.trim().match(/^warning\s+(.*)$/);
  },
  render: function (tokens: any, idx: any) {
    var m = tokens[idx].info.trim().match(/^warning\s+(.*)$/);

    if (tokens[idx].nesting === 1) {
      // opening tag
      return containerOpen(m[1], svg_warning, 'yellow');
    } else {
      // closing tag
      return '</div>\n';
    }
  },
});
export default function compile(str: string, plugins: boolean): string {
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
    console.log(expressionWithoutDollar);
    console.log(render);

    text = text.replace(expression, `<span class="katex-container"><i>${render}</i></span>`);
  }
  return text;
}
